from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.db import get_connection

main_bp = Blueprint("main", __name__)


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

        if not nombre or not correo or not motivo or not mensaje:
            return "Faltan datos obligatorios", 400

        conn = None
        cursor = None

        try:
            conn = get_connection()
            cursor = conn.cursor()

            sql = """
                INSERT INTO contactos
                (nombre, correo, telefono, motivo, mensaje)
                VALUES (%s, %s, %s, %s, %s)
            """

            valores = (
                nombre,
                correo,
                telefono,
                motivo,
                mensaje
            )

            cursor.execute(sql, valores)
            conn.commit()

            return redirect(url_for("main.contactos"))

        except Exception as e:
            if conn:
                conn.rollback()

            print("ERROR AL GUARDAR CONTACTO:", e)
            return "Error al guardar el mensaje", 500

        finally:
            if cursor:
                cursor.close()

            if conn:
                conn.close()

    return render_template("clientes/contactos.html")


@main_bp.route("/compra")
def compra():
    return render_template("clientes/compra.html")