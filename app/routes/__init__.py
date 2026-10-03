from flask import Blueprint, render_template

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


@main_bp.route("/contactos")
def contactos():
    return render_template("clientes/contactos.html")


@main_bp.route("/compra")
def compra():
    return render_template("clientes/compra.html")