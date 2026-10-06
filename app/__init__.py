from flask import Flask

from app.routes import main_bp
from app.templates.login import login_bp


def create_app():

    app = Flask(__name__)

    app.secret_key = "clave-secreta-proyecto"

    app.register_blueprint(main_bp)
    app.register_blueprint(login_bp)

    return app