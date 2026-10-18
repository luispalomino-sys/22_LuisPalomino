
import re
import time
from functools import wraps

from flask import (
    Blueprint,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash

from app.db import get_connection


admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

# Configuración de seguridad
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_MINUTES = 15
IDLE_TIMEOUT_SECONDS = 15 * 60

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
TELEFONO_RE = re.compile(r"^[0-9+\-\s()]{7,30}$")


def get_login_ip():
    """Obtiene la dirección IP que ve Flask."""
    return request.remote_addr or "unknown"


def admin_required(view):
    """Impide acceder al panel sin iniciar sesión."""
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if not session.get("admin_id"):
            flash("Inicia sesión para acceder al panel.", "warning")
            return redirect(url_for("admin.login"))

        return view(*args, **kwargs)

    return wrapped_view


@admin_bp.before_request
def check_admin_inactivity():
    """Cierra la sesión después de 15 minutos sin actividad."""
    if not session.get("admin_id"):
        return None

    ahora = time.time()
    ultima_actividad = session.get("admin_last_activity", ahora)

    if ahora - ultima_actividad >= IDLE_TIMEOUT_SECONDS:
        session.clear()
        flash(
            "Tu sesión se cerró por inactividad. "
            "Inicia sesión nuevamente.",
            "warning",
        )

        if request.endpoint == "admin.login":
            return None

        return redirect(url_for("admin.login"))

    session["admin_last_activity"] = ahora
    session.permanent = True
    return None


def get_login_attempt(cursor, correo, ip_address):
    """Consulta el estado de bloqueo de un correo y una IP."""
    cursor.execute(
        """
        SELECT
            intentos,
            bloqueado_hasta,
            CASE
                WHEN bloqueado_hasta > UTC_TIMESTAMP() THEN 1
                ELSE 0
            END AS bloqueado,
            GREATEST(
                0,
                TIMESTAMPDIFF(
                    SECOND,
                    UTC_TIMESTAMP(),
                    bloqueado_hasta
                )
            ) AS segundos
        FROM admin_login_attempts
        WHERE correo = %s AND ip_address = %s
        """,
        (correo, ip_address),
    )

    return cursor.fetchone()


def register_failed_attempt(conn, cursor, correo, ip_address):
    """Registra un intento fallido y bloquea al llegar al límite."""

    try:
        cursor.execute(
            """
            INSERT INTO admin_login_attempts
                (correo, ip_address, intentos, bloqueado_hasta)
            VALUES (%s, %s, 1, NULL)
            ON DUPLICATE KEY UPDATE
                intentos = CASE
                    WHEN bloqueado_hasta IS NOT NULL
                         AND bloqueado_hasta <= UTC_TIMESTAMP()
                    THEN 1
                    ELSE intentos + 1
                END,
                bloqueado_hasta = CASE
                    WHEN bloqueado_hasta IS NOT NULL
                         AND bloqueado_hasta <= UTC_TIMESTAMP()
                    THEN NULL
                    ELSE bloqueado_hasta
                END
            """,
            (correo, ip_address),
        )

        cursor.execute(
            """
            UPDATE admin_login_attempts
            SET bloqueado_hasta = DATE_ADD(
                UTC_TIMESTAMP(),
                INTERVAL %s MINUTE
            )
            WHERE correo = %s
              AND ip_address = %s
              AND intentos >= %s
              AND (
                  bloqueado_hasta IS NULL
                  OR bloqueado_hasta <= UTC_TIMESTAMP()
              )
            """,
            (
                LOCKOUT_MINUTES,
                correo,
                ip_address,
                MAX_LOGIN_ATTEMPTS,
            ),
        )

        conn.commit()

    except Exception:
        conn.rollback()
        raise


def clear_failed_attempts(cursor, conn, correo, ip_address):
    """Elimina el contador después de iniciar sesión correctamente."""
    cursor.execute(
        """
        DELETE FROM admin_login_attempts
        WHERE correo = %s AND ip_address = %s
        """,
        (correo, ip_address),
    )
    conn.commit()


@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    print("PRUEBA: se está ejecutando el login nuevo")
    # Si ya inició sesión, ir al panel.
    if session.get("admin_id"):
        return redirect(url_for("admin.dashboard"))

    if request.method == "GET":
        return render_template("admin/login.html")

    correo = request.form.get("correo", "").strip().lower()
    password = request.form.get("password", "")

    if not correo or not password:
        flash("Ingresa tu correo y contraseña.", "error")
        return render_template("admin/login.html"), 400

    if len(correo) > 150 or not EMAIL_RE.fullmatch(correo):
        flash("Correo o contraseña incorrectos.", "error")
        return render_template("admin/login.html"), 401

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        ip_address = get_login_ip()

        # Comprobar si el acceso está bloqueado.
        intento = get_login_attempt(cursor, correo, ip_address)

        if intento and intento["bloqueado"]:
            segundos = int(intento["segundos"] or 0)
            minutos = max(1, (segundos + 59) // 60)

            flash(
                f"Demasiados intentos fallidos. "
                f"Inténtalo nuevamente en aproximadamente "
                f"{minutos} minuto(s).",
                "error",
            )
            return render_template("admin/login.html"), 429

        cursor.execute(
            """
            SELECT id, correo, password_hash, activo
            FROM admin_users
            WHERE correo = %s
            LIMIT 1
            """,
            (correo,),
        )
        admin = cursor.fetchone()

        credenciales_validas = (
            admin is not None
            and bool(admin["activo"])
            and check_password_hash(admin["password_hash"], password)
        )

        if not credenciales_validas:
            register_failed_attempt(
                conn, cursor, correo, ip_address
            )
            flash("Correo o contraseña incorrectos.", "error")
            return render_template("admin/login.html"), 401

        # Restablecer el contador después de un acceso correcto.
        clear_failed_attempts(cursor, conn, correo, ip_address)

        session.clear()
        session["admin_id"] = admin["id"]
        session["admin_correo"] = admin["correo"]
        session["admin_last_activity"] = time.time()
        session.permanent = True

        flash("Has iniciado sesión correctamente.", "success")
        return redirect(url_for("admin.dashboard"))

    except Exception:
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass

        # El detalle técnico se deja en los registros del servidor.
        import logging
        logging.exception("Error durante el inicio de sesión")

        flash(
            "No se pudo procesar el inicio de sesión. "
            "Verifica la conexión con la base de datos.",
            "error",
        )
        return render_template("admin/login.html"), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@admin_bp.route("/", methods=["GET"])
@admin_required
def dashboard():
    """Muestra los contactos y permite buscarlos."""
    busqueda = request.args.get("q", "").strip()
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        if busqueda:
            termino = f"%{busqueda}%"
            cursor.execute(
                """
                SELECT id, nombre, correo, telefono,
                       motivo, mensaje, fecha
                FROM contactos
                WHERE nombre LIKE %s
                   OR correo LIKE %s
                   OR telefono LIKE %s
                   OR motivo LIKE %s
                ORDER BY fecha DESC, id DESC
                """,
                (termino, termino, termino, termino),
            )
        else:
            cursor.execute(
                """
                SELECT id, nombre, correo, telefono,
                       motivo, mensaje, fecha
                FROM contactos
                ORDER BY fecha DESC, id DESC
                """
            )

        contactos = cursor.fetchall()

        return render_template(
            "admin/dashboard.html",
            contactos=contactos,
            q=busqueda,
        )

    except Exception:
        import logging
        logging.exception("Error al cargar el panel administrativo")
        flash("No se pudieron cargar los contactos.", "error")
        return render_template(
            "admin/dashboard.html",
            contactos=[],
            q=busqueda,
        ), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@admin_bp.route(
    "/contacto/<int:contacto_id>/editar",
    methods=["GET", "POST"],
)
@admin_required
def editar_contacto(contacto_id):
    """Muestra y actualiza los datos de un contacto."""
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, nombre, correo, telefono,
                   motivo, mensaje, fecha
            FROM contactos
            WHERE id = %s
            """,
            (contacto_id,),
        )
        contacto = cursor.fetchone()

        if not contacto:
            flash("El contacto no existe.", "warning")
            return redirect(url_for("admin.dashboard"))

        if request.method == "GET":
            return render_template(
                "admin/editar_contacto.html",
                contacto=contacto,
            )

        nombre = request.form.get("nombre", "").strip()
        correo = request.form.get("correo", "").strip().lower()
        telefono = request.form.get("telefono", "").strip()
        motivo = request.form.get("motivo", "").strip()
        mensaje = request.form.get("mensaje", "").strip()

        errores = []

        if not nombre or len(nombre) > 150:
            errores.append("El nombre es obligatorio y debe tener "
                           "como máximo 150 caracteres.")

        if not EMAIL_RE.fullmatch(correo) or len(correo) > 150:
            errores.append("Ingresa un correo válido.")

        if telefono and (
            len(telefono) > 30
            or not TELEFONO_RE.fullmatch(telefono)
        ):
            errores.append("El teléfono contiene caracteres no válidos.")

        if not motivo or len(motivo) > 150:
            errores.append("El motivo es obligatorio y debe tener "
                           "como máximo 150 caracteres.")

        if not mensaje or len(mensaje) > 500:
            errores.append("El mensaje es obligatorio y debe tener "
                           "como máximo 500 caracteres.")

        if errores:
            for error in errores:
                flash(error, "error")

            contacto.update(
                nombre=nombre,
                correo=correo,
                telefono=telefono,
                motivo=motivo,
                mensaje=mensaje,
            )

            return render_template(
                "admin/editar_contacto.html",
                contacto=contacto,
            ), 400

        cursor.execute(
            """
            UPDATE contactos
            SET nombre = %s,
                correo = %s,
                telefono = %s,
                motivo = %s,
                mensaje = %s
            WHERE id = %s
            """,
            (
                nombre,
                correo,
                telefono or None,
                motivo,
                mensaje,
                contacto_id,
            ),
        )
        conn.commit()

        flash("El contacto se actualizó correctamente.", "success")
        return redirect(url_for("admin.dashboard"))

    except Exception:
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass

        import logging
        logging.exception("Error al editar el contacto")
        flash("No se pudo actualizar el contacto.", "error")
        return redirect(url_for("admin.dashboard"))

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@admin_bp.route(
    "/contacto/<int:contacto_id>/eliminar",
    methods=["POST"],
)
@admin_required
def eliminar_contacto(contacto_id):
    """Elimina un contacto mediante una petición POST protegida por CSRF."""
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM contactos WHERE id = %s",
            (contacto_id,),
        )
        conn.commit()

        if cursor.rowcount:
            flash("El contacto se eliminó correctamente.", "success")
        else:
            flash("El contacto no existe o ya fue eliminado.", "warning")

    except Exception:
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass

        import logging
        logging.exception("Error al eliminar el contacto")
        flash("No se pudo eliminar el contacto.", "error")

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

    return redirect(url_for("admin.dashboard"))


@admin_bp.route("/logout", methods=["POST"])
def logout():
    """Cierra la sesión del administrador."""
    session.clear()
    flash("Has cerrado sesión correctamente.", "success")
    return redirect(url_for("admin.login"))
