from flask import Blueprint, render_template, request, send_from_directory

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def inicio():
    return render_template("index.html")


@main_bp.route("/conoce-matahuasi")
def conoce_matahuasi():
    return render_template("conoce.html")


@main_bp.route("/nosotros")
def nosotros():
    return render_template("nosotros.html")


@main_bp.route("/datos")
def datos():
    return render_template("datos.html")


@main_bp.route("/contactos", methods=["GET", "POST"])
def contactos():
    # Nota: por ahora el formulario solo confirma el envío en pantalla.
    # La conexión a base de datos para guardar los mensajes es un punto
    # aparte (ver "Puntos adicionales" de la rúbrica).
    if request.method == "POST":
        nombre = request.form.get("nombre", "")
        return render_template("contactos.html", enviado=True, nombre=nombre)
    return render_template("contactos.html")


@main_bp.route("/productos")
def productos():
    return render_template("productos.html")


@main_bp.route("/sitemap.xml")
def sitemap():
    return send_from_directory("static", "sitemap.xml")