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
    x_prefix=1,
)

if __name__ == "__main__":
    try:
        conexion = obtener_conexion()
        print("Conexión a la base de datos exitosa")
        conexion.close()
    except Exception as e:
        print("Fallo en la conexión a la base de datos:", e)

    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False,
    )