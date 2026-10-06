import os

from werkzeug.middleware.proxy_fix import ProxyFix

from app import create_app
from app.database import obtener_conexion


app = create_app()

app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_for=1,
    x_proto=1,
    x_host=1,
    x_prefix=1
)


def probar_conexion():

    conn = None

    try:
        conn = obtener_conexion()
        print("CONEXIÓN MYSQL EXITOSA")

    except Exception as e:
        print("ERROR DE CONEXIÓN MYSQL:", e)

    finally:
        if conn:
            conn.close()


if __name__ == "__main__":

    probar_conexion()

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )