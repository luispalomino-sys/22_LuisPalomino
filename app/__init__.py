import os
import secrets

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_wtf.csrf import CSRFError, CSRFProtect

load_dotenv()

csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)

    # Clave secreta necesaria para sesiones y tokens CSRF.
    # Defínela en tu .env como SECRET_KEY=<cadena larga y aleatoria>
    secret = os.getenv("SECRET_KEY")
    if not secret:
        secret = secrets.token_hex(32)
        print("AVISO: define SECRET_KEY en el archivo .env (se usa una clave temporal).")

    app.config["SECRET_KEY"] = secret
    app.config["WTF_CSRF_TIME_LIMIT"] = None  # el token dura lo que dure la sesión
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

    csrf.init_app(app)

    @app.errorhandler(CSRFError)
    def handle_csrf_error(error):
        return jsonify(
            ok=False,
            error="Tu sesión expiró. Recarga la página e inténtalo de nuevo."
        ), 400

    @app.context_processor
    def inject_globals():
        # Solo dígitos, con código de país. Ej: 51987654321
        numero = "".join(ch for ch in os.getenv("WHATSAPP_NUMBER", "") if ch.isdigit())
        return {"whatsapp_number": numero}

    from app.routes import main_bp
    app.register_blueprint(main_bp)

    return app
