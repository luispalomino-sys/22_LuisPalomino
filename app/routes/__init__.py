
import re

from flask import (
    Blueprint,
    Response,
    jsonify,
    render_template,
    request,
    url_for,
)
from app.db import get_connection

main_bp = Blueprint("main", __name__)

MOTIVOS_VALIDOS = {
    "Quiero comprar cuys",
    "Quiero comprar quinua",
    "Quiero información sobre los productos",
    "Quiero ser productor asociado",
    "Quiero conocer más sobre la cooperativa",
    "Tengo una consulta",
    "Otro",
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
TELEFONO_RE = re.compile(r"^\+?[0-9 ()-]{6,20}$")


def validar_contacto(nombre, correo, telefono, motivo, mensaje):
    """Valida los datos del formulario de contacto."""
    errores = {}

    if not 2 <= len(nombre) <= 150:
        errores["nombre"] = (
            "El nombre debe tener entre 2 y 150 caracteres."
        )

    if len(correo) > 150 or not EMAIL_RE.match(correo):
        errores["correo"] = "Ingresa un correo electrónico válido."

    if telefono and not TELEFONO_RE.match(telefono):
        errores["telefono"] = (
            "Ingresa un teléfono válido (6 a 20 dígitos)."
        )

    if motivo not in MOTIVOS_VALIDOS:
        errores["motivo"] = "Selecciona un motivo de contacto válido."

    if not 5 <= len(mensaje) <= 500:
        errores["mensaje"] = (
            "El mensaje debe tener entre 5 y 500 caracteres."
        )

    return errores


@main_bp.route("/")
def inicio():
    return render_template("clientes/index.html")


@main_bp.route("/nosotros")
def nosotros():
    return render_template("clientes/nosotros.html")


@main_bp.route("/conoce-matahuasi")
def conoce_matahuasi():
    return render_template("clientes/conoce.html")


@main_bp.route("/productos")
def productos():
    return render_template("clientes/productos.html")


@main_bp.route("/contactos", methods=["GET", "POST"])
def contactos():
    if request.method == "POST":
        nombre = request.form.get("nombre", "").strip()
        correo = request.form.get("correo", "").strip()
        telefono = request.form.get("telefono", "").strip()
        motivo = request.form.get("motivo", "").strip()
        mensaje = request.form.get("mensaje", "").strip()

        errores = validar_contacto(
            nombre, correo, telefono, motivo, mensaje
        )

        if errores:
            return jsonify(ok=False, errors=errores), 400

        conn = None
        cursor = None

        try:
            conn = get_connection()
            cursor = conn.cursor()

            sql = """
                INSERT INTO contactos
                    (nombre, correo, telefono, motivo, mensaje)
                VALUES (%s, %s, NULLIF(%s, ''), %s, %s)
            """

            cursor.execute(
                sql,
                (nombre, correo, telefono, motivo, mensaje),
            )

            if cursor.rowcount == 0:
                conn.rollback()
                return jsonify(
                    ok=False,
                    errors={
                        "motivo": "El motivo seleccionado no existe."
                    },
                ), 400

            conn.commit()
            return jsonify(ok=True)

        except Exception as e:
            if conn:
                conn.rollback()

            print("ERROR AL GUARDAR CONTACTO:", e)
            return jsonify(
                ok=False,
                error=(
                    "No pudimos guardar tu mensaje. "
                    "Inténtalo más tarde."
                ),
            ), 500

        finally:
            if cursor:
                cursor.close()

            if conn:
                conn.close()

    return render_template("clientes/contactos.html")


@main_bp.route("/compra")
def compra():
    return render_template("clientes/compra.html")


@main_bp.route("/sitemap.xml")
def sitemap():
    paginas = [
        "main.inicio",
        "main.nosotros",
        "main.conoce_matahuasi",
        "main.productos",
        "main.contactos",
    ]

    urls = "".join(
        "  <url>\n"
        f"    <loc>{url_for(pagina, _external=True)}</loc>\n"
        "  </url>\n"
        for pagina in paginas
    )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}"
        "</urlset>\n"
    )

    return Response(xml, mimetype="application/xml")


@main_bp.route("/robots.txt")
def robots():
    texto = (
        "User-agent: *\n"
        "Allow: /\n"
        f"Sitemap: {url_for('main.sitemap', _external=True)}\n"
    )

    return Response(texto, mimetype="text/plain")
