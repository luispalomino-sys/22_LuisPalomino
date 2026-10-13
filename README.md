# Cooperativas Sais Capital Social — Sitio web (ASE261S2_T07_wp)

Sitio web en **Flask** con plantillas Jinja, Tailwind CSS y JavaScript vanilla.

## Funcionalidades
- Catálogo de productos con **popup animado del cuy** (`cuy-detalle.js/css`).
- **Transiciones** entre pestañas (`page-transition.js/css`) y **contadores animados** de impacto (`counters.js/css`).
- Página de contacto con **mapa**, **botón de WhatsApp**, protección **CSRF** y validación en servidor; guarda los mensajes en MySQL.
- Versión en **español/inglés** (`i18n.js`), engranaje de **accesibilidad** (tamaño de texto, alto contraste) y búsqueda.
- Favoritos, carrito con cupón, chatbot, `sitemap.xml` y `robots.txt` generados dinámicamente.

## Estructura
```
app.py                 Punto de entrada
app/__init__.py        Fábrica de la app (create_app, CSRF, config)
app/db.py              Conexión a MySQL
app/routes/__init__.py Rutas (/, /nosotros, /productos, /contactos, ...)
app/templates/         base.html + clientes/*.html
app/static/{css,js,img}
```

## Puesta en marcha local
```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # completa los valores (ver abajo)
python app.py               # http://localhost:5000
```

### Variables de entorno (`.env`)
| Variable | Descripción |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión MySQL |
| `SECRET_KEY` | Cadena larga y aleatoria (sesiones y CSRF) |
| `WHATSAPP_NUMBER` | Con código de país, solo dígitos. Vacío = el botón no se muestra |

> **Nunca subas `.env` a GitHub.** Está en `.gitignore`.

## Docker
```bash
docker build -t cuy-web .
docker run --env-file .env -p 5000:5000 cuy-web
```

## Flujo de ramas
`main` ← `develop` ← `feature/*`. Rama de integración actual: `feature/integracion-us1-us2-us3`.
