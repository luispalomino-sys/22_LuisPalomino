
import os
import secrets
from datetime import timedelta

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_wtf.csrf import CSRFError, CSRFProtect

load_dotenv()

csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)

    secret = os.getenv("SECRET_KEY")

    if not secret:
        secret = secrets.token_hex(32)
        print(
            "AVISO: define SECRET_KEY en .env y en las variables "
            "de entorno del servidor."
        )

    app.config["SECRET_KEY"] = secret
    app.config["WTF_CSRF_TIME_LIMIT"] = None
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = (
        os.getenv("COOKIE_SECURE", "false").lower() == "true"
    )
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=15)

    csrf.init_app(app)

    @app.errorhandler(CSRFError)
    def handle_csrf_error(error):
        return jsonify(
            ok=False,
            error="Tu sesión expiró. Recarga la página e inténtalo de nuevo."
        ), 400

    @app.context_processor
    def inject_globals():
        numero = "".join(
            ch for ch in os.getenv("WHATSAPP_NUMBER", "")
            if ch.isdigit()
        )
        return {"whatsapp_number": numero}

    from app.routes import main_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp)

    return app
