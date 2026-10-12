/* ==========================================================
   TRANSICIÓN ENTRE PESTAÑAS
   1. Al hacer clic en un enlace interno: anima la salida del
      contenido y recién después navega.
   2. Marca la pestaña activa del menú (aria-current).
   3. Recuerda (sessionStorage) que la navegación fue interna
      para que el header no vuelva a animarse.
   La animación de ENTRADA es 100% CSS (page-transition.css).
   ========================================================== */

(function () {
    "use strict";

    var root = document.documentElement;
    var LEAVE_MS = 320;                 // debe coincidir con --pt-leave-duration
    var FLAG = "pt-internal-nav";
    var leaving = false;

    var reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* ------------------------------------------------------
       0. ¿Venimos de una navegación interna?
       (se ejecuta lo antes posible para evitar parpadeos)
       ------------------------------------------------------ */
    try {
        if (sessionStorage.getItem(FLAG) === "1") {
            root.classList.add("pt-internal");
            sessionStorage.removeItem(FLAG);
        }
    } catch (e) { /* sessionStorage puede estar bloqueado */ }


    /* ------------------------------------------------------
       1. Marcar pestaña activa
       ------------------------------------------------------ */
    function normalize(path) {
        return path.replace(/\/+$/, "") || "/";
    }

    function markActiveLinks() {
        var current = normalize(window.location.pathname);

        document
            .querySelectorAll("header nav a[href]")
            .forEach(function (link) {
                var url;

                try {
                    url = new URL(link.getAttribute("href"), window.location.href);
                } catch (e) {
                    return;
                }

                if (
                    url.origin === window.location.origin &&
                    normalize(url.pathname) === current
                ) {
                    link.setAttribute("aria-current", "page");
                }
            });
    }


    /* ------------------------------------------------------
       2. ¿Este clic debe disparar la transición?
       ------------------------------------------------------ */
    function shouldTransition(event, link) {

        // Otro script ya gestionó el clic (p. ej. el carrito abre un mini-carrito)
        if (event.defaultPrevented) return false;

        // Solo clic izquierdo, sin teclas modificadoras
        if (event.button !== 0) return false;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

        // Atributos que implican otro comportamiento
        if (link.hasAttribute("download")) return false;
        if (link.hasAttribute("data-no-transition")) return false;

        var target = link.getAttribute("target");
        if (target && target !== "_self") return false;

        var href = link.getAttribute("href");
        if (!href || href.charAt(0) === "#") return false;
        if (/^(mailto:|tel:|javascript:|sms:|whatsapp:)/i.test(href)) return false;

        var url;
        try {
            url = new URL(link.href, window.location.href);
        } catch (e) {
            return false;
        }

        // Solo mismo origen
        if (url.origin !== window.location.origin) return false;

        // Misma página (solo cambia el # o nada): no hace falta animar
        if (
            normalize(url.pathname) === normalize(window.location.pathname) &&
            url.search === window.location.search
        ) {
            return false;
        }

        // Archivos estáticos (pdf, imágenes, etc.)
        if (/\.(pdf|zip|png|jpe?g|gif|webp|svg|xml|txt|mp4)$/i.test(url.pathname)) {
            return false;
        }

        return true;
    }


    /* ------------------------------------------------------
       3. Salida animada + navegación
       ------------------------------------------------------ */
    function go(href) {
        try {
            sessionStorage.setItem(FLAG, "1");
        } catch (e) { /* ignorar */ }

        window.location.href = href;
    }

    document.addEventListener("click", function (event) {

        var link = event.target.closest && event.target.closest("a[href]");
        if (!link) return;

        if (!shouldTransition(event, link)) return;

        // Si el usuario prefiere menos movimiento, navegamos directo
        if (reducedMotion) return;

        // Evitar dobles clics mientras se anima
        event.preventDefault();
        if (leaving) return;
        leaving = true;

        var href = link.href;

        root.classList.add("pt-leaving");

        window.setTimeout(function () {
            go(href);
        }, LEAVE_MS);
    });


    /* ------------------------------------------------------
       4. Botón "atrás" del navegador (bfcache):
          si la página vuelve desde caché hay que limpiar el estado
       ------------------------------------------------------ */
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            leaving = false;
            root.classList.remove("pt-leaving");
        }
    });


    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", markActiveLinks);
    } else {
        markActiveLinks();
    }

})();
