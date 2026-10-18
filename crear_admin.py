import getpass
import re

from werkzeug.security import generate_password_hash
from app.db import get_connection


def main():
    correo = input("Correo del administrador: ").strip().lower()

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", correo):
        print("Error: ingresa un correo válido.")
        return

    password = getpass.getpass("Contraseña (mínimo 12 caracteres): ")

    if len(password) < 12:
        print("Error: la contraseña debe tener al menos 12 caracteres.")
        return

    confirmacion = getpass.getpass("Confirma la contraseña: ")

    if password != confirmacion:
        print("Error: las contraseñas no coinciden.")
        return

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM admin_users WHERE correo = %s",
            (correo,)
        )

        if cursor.fetchone():
            print("Ya existe una cuenta con ese correo.")
            return

        password_hash = generate_password_hash(password)

        cursor.execute(
            """
            INSERT INTO admin_users (correo, password_hash)
            VALUES (%s, %s)
            """,
            (correo, password_hash)
        )

        conn.commit()
        print("Administrador creado correctamente.")

    except Exception as error:
        if conn:
            conn.rollback()

        print("No se pudo crear el administrador:", error)

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    main()
