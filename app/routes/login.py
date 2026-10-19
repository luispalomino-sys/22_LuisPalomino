from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import obtener_conexion

login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["GET", "POST"])
def login():
    mensaje = None
    if request.method == "POST":
        correo = request.form["correo"]
        clave = request.form["clave"]

        conexion = obtener_conexion()
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT * FROM login WHERE correo = %s", (correo,))
        usuario = cursor.fetchone()
        cursor.close()
        conexion.close()

        if usuario and check_password_hash(usuario["password"], clave):
            session["usuario_id"] = usuario["id"]
            session["usuario_nombre"] = usuario["nombre"]
            return redirect(url_for("main.inicio"))
        else:
            mensaje = "Correo o contraseña incorrectos"

    return render_template("login/login.html", mensaje=mensaje)


@login_bp.route("/registro", methods=["GET", "POST"])
def registro():
    mensaje = None
    if request.method == "POST":
        nombre = request.form["nombre"]
        apellido = request.form["apellido"]
        correo = request.form["correo"]
        usuario = request.form["usuario"]
        clave = request.form["clave"]

        conexion = obtener_conexion()
        cursor = conexion.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM login WHERE correo = %s OR usuario = %s",
            (correo, usuario),
        )
        existente = cursor.fetchone()

        if existente:
            mensaje = "El correo o usuario ya se encuentra registrado"
            cursor.close()
            conexion.close()
        else:
            clave_segura = generate_password_hash(clave)
            cursor.execute(
                """
                INSERT INTO login (nombre, apellido, correo, usuario, password)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (nombre, apellido, correo, usuario, clave_segura),
            )
            conexion.commit()
            cursor.close()
            conexion.close()
            return redirect(url_for("login.login"))

    return render_template("login/registro.html", mensaje=mensaje)


@login_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login.login"))