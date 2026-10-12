/* ==========================================================
   TRANSICIÓN ENTRE PESTAÑAS  (v2)

   SALIDA   : al hacer clic en un enlace interno, el contenido se
              desvanece y luego se navega.
   ENTRADA  : cada elemento visible (títulos, textos, imágenes,
              tarjetas, botones, campos) se anima por separado.
              El retraso depende de su posición en pantalla, lo que
              genera una onda diagonal arriba-izquierda -> abajo-derecha.
   MENÚ     : un indicador se desliza hasta la pestaña activa.
   ========================================================== */

(function () {
    "use strict";

    var root = document.documentElement;

    var LEAVE_MS = 300;                 // >= --pt-leave-ms del CSS
    var FLAG = "pt-internal-nav";
    var IND_KEY = "pt-indicator-prev";
    var MAX_ITEMS = 90;                 // límite de elementos animados al cargar
    var MAX_LATER = 160;                // límite de elementos animados con el scroll
    var leaving = false;

    // Elementos con su propio sistema de animación: no se tocan
    var SKIP_SELECTOR =
        ".product-item, .cuy-experience, .cuy-gallery-item, .reveal-item, .rv, " +
        ".hero-slide, .slider-dot, [data-pt-skip], [role='dialog'], [aria-modal='true']";

    var reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* ------------------------------------------------------
       0. Estado inicial (lo antes posible, desde el <head>)
       ------------------------------------------------------ */
    try {
        if (sessionStorage.getItem(FLAG) === "1") {
            root.classList.add("pt-internal");
            sessionStorage.removeItem(FLAG);
        }
    } catch (e) { /* sessionStorage puede estar bloqueado */ }

    if (!reducedMotion) {
        // Oculta <main> hasta preparar los elementos...
        root.classList.add("pt-js");

        // ...con un seguro: nunca debe quedar oculto.
        window.setTimeout(function () {
            root.classList.add("pt-ready");
        }, 2500);
    }


    /* ------------------------------------------------------
       1. ENTRADA: clasificar y escalonar los elementos
       ------------------------------------------------------ */
    function hasVisibleBox(cs) {
        var bg = cs.backgroundColor;
        var hasBg = bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
        var hasShadow = cs.boxShadow && cs.boxShadow !== "none";
        var hasBorder =
            (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none") ||
            (parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomStyle !== "none") ||
            (parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftStyle !== "none");
        return !!(hasBg || hasShadow || hasBorder);
    }

    function classify(el, cs, rect, vw) {
        var tag = el.tagName;

        if (tag === "H1" || tag === "H2") return "head";
        if (/^H[3-6]$/.test(tag)) return "text";
        if (tag === "IMG" || tag === "VIDEO" || tag === "IFRAME") return "media";
        if (/^(P|LI|BLOCKQUOTE|LABEL)$/.test(tag)) return "text";
        if (/^(INPUT|TEXTAREA|SELECT|BUTTON|TABLE)$/.test(tag)) return "card";

        if (tag === "A") {
            if (hasVisibleBox(cs)) return "card";
            // Enlace de texto suelto (los que están dentro de un párrafo ya se animan con él)
            return el.closest("p, li, h1, h2, h3, h4, h5, h6") ? null : "text";
        }

        // div / article / aside / form / figure / section: ¿es una "tarjeta"?
        if (
            (hasVisibleBox(cs) ||
                (cs.backgroundImage && cs.backgroundImage !== "none")) &&
            rect.width >= 60 &&
            rect.height >= 32 &&
            rect.width < vw * 0.94           // descarta bandas de fondo a todo el ancho
        ) {
            return "card";
        }

        return null;
    }

    // Elementos "absolute" que cubren por completo a su contenedor
    // (imagen de fondo del banner o capa oscura encima).
    function classifyCover(el, rect) {
        var parent = el.parentElement;
        if (!parent) return null;

        var pr = parent.getBoundingClientRect();
        if (pr.width < 8 || pr.height < 8) return null;

        var covers =
            rect.width >= pr.width * 0.95 && rect.height >= pr.height * 0.95;
        if (!covers) return null;

        if (el.tagName === "IMG" || el.tagName === "VIDEO") return "cover";
        return "veil";
    }

    function isShown(el) {
        if (typeof el.checkVisibility === "function") {
            return el.checkVisibility({
                opacityProperty: true,
                visibilityProperty: true
            });
        }
        return true;
    }

    // Quita la animación de un elemento cuando termina (para que no se
    // repita si otro script lo oculta/muestra más tarde).
    function cleanupWhenDone(el) {
        el.addEventListener("animationend", function onEnd(e) {
            if (e.target !== el) return;
            el.removeEventListener("animationend", onEnd);
            el.removeAttribute("data-pt");
            el.style.removeProperty("--pt-d");
        });
    }

    function prepareEntrance() {
        var main = document.querySelector("main");
        if (!main) return;

        var vw = window.innerWidth || 1280;
        var vh = window.innerHeight || 720;

        var candidates = main.querySelectorAll(
            "h1,h2,h3,h4,h5,h6,p,li,blockquote,label,input,textarea,select," +
            "button,a,img,video,iframe,figure,table,div,article,aside,form,section"
        );

        var items = [];     // visibles al cargar  -> onda diagonal inmediata
        var later = [];     // bajo el pliegue     -> se animan al aparecer con el scroll

        for (var i = 0; i < candidates.length; i++) {
            var el = candidates[i];

            if (el.closest(SKIP_SELECTOR)) continue;

            var rect = el.getBoundingClientRect();
            if (rect.width < 8 || rect.height < 8) continue;
            if (rect.bottom < 0) continue;

            var cs = window.getComputedStyle(el);
            if (cs.position === "fixed") continue;
            if (cs.animationName && cs.animationName !== "none") continue;
            if (!isShown(el)) continue;

            // Fondos de banner (imagen + velo oscuro, ambos "absolute"):
            // entran juntos con un fundido, sin retraso.
            if (cs.position === "absolute") {
                var coverType = classifyCover(el, rect);
                if (coverType && rect.top <= vh * 1.02) {
                    items.push({ el: el, type: coverType, delay: 0 });
                }
                continue;
            }

            var type = classify(el, cs, rect, vw);
            if (!type) continue;

            if (rect.top > vh * 1.02) {
                if (later.length < MAX_LATER) later.push({ el: el, type: type });
                continue;
            }

            // Onda diagonal: más abajo / más a la derecha => más tarde
            var top = Math.max(0, rect.top);
            var delay =
                (top / vh) * 480 +
                (Math.max(0, rect.left) / vw) * 220 +
                (type === "text" ? 70 : type === "media" ? 40 : 0);

            items.push({ el: el, type: type, delay: Math.min(1000, Math.round(delay / 10) * 10) });
        }

        // Si hay demasiados, se animan los primeros en el orden de la onda
        items.sort(function (a, b) { return a.delay - b.delay; });
        if (items.length > MAX_ITEMS) items.length = MAX_ITEMS;

        items.forEach(function (item) {
            item.el.style.setProperty("--pt-d", item.delay + "ms");
            item.el.setAttribute("data-pt", item.type);
            cleanupWhenDone(item.el);
        });

        prepareScrollReveal(later);

        // Seguro: limpiar lo que no haya terminado
        window.setTimeout(function () {
            main.querySelectorAll("[data-pt]").forEach(function (el) {
                el.removeAttribute("data-pt");
                el.style.removeProperty("--pt-d");
            });
        }, 3500);
    }

    /* Contenido bajo el pliegue: espera oculto y entra con el mismo
       efecto (escalonado entre los que aparecen a la vez). */
    function prepareScrollReveal(later) {
        if (!later.length || !("IntersectionObserver" in window)) return;

        var types = new Map();
        later.forEach(function (item) {
            types.set(item.el, item.type);
            item.el.setAttribute("data-pt-wait", "");
        });

        function reveal(el, delay) {
            var type = types.get(el);
            io.unobserve(el);
            el.style.setProperty("--pt-d", delay + "ms");
            el.setAttribute("data-pt", type);
            el.removeAttribute("data-pt-wait");
            cleanupWhenDone(el);
        }

        var io = new IntersectionObserver(function (entries) {
            var visible = entries
                .filter(function (e) { return e.isIntersecting; })
                .sort(function (a, b) {
                    var ra = a.boundingClientRect, rb = b.boundingClientRect;
                    return (ra.top - rb.top) || (ra.left - rb.left);
                });

            visible.forEach(function (entry, k) {
                reveal(entry.target, Math.min(k * 70, 450));
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });

        later.forEach(function (item) { io.observe(item.el); });

        // Al imprimir, todo debe verse
        window.addEventListener("beforeprint", function () {
            later.forEach(function (item) {
                item.el.removeAttribute("data-pt-wait");
                item.el.removeAttribute("data-pt");
            });
        });
    }

    function startEntrance() {
        // 1) Se "des-oculta" <main> para poder medir (checkVisibility tiene en
        //    cuenta la opacidad de los ancestros). Todo es síncrono: no se pinta
        //    ningún fotograma entre este paso y el siguiente.
        root.classList.add("pt-ready");

        // 2) Se etiqueta cada elemento; al pintarse por primera vez ya está
        //    oculto por el estado inicial (backwards) de su animación.
        if (!reducedMotion) {
            try {
                prepareEntrance();
            } catch (e) {
                if (window.console) console.warn("page-transition:", e);
            }
        }
    }


    /* ------------------------------------------------------
       2. MENÚ: pestaña activa + indicador deslizante
       ------------------------------------------------------ */
    function normalize(path) {
        return path.replace(/\/+$/, "") || "/";
    }

    function markActiveLinks() {
        var current = normalize(window.location.pathname);

        document.querySelectorAll("header nav a[href]").forEach(function (link) {
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

    function applyIndicator(ind, pos) {
        ind.style.setProperty("--x", pos.x + "px");
        ind.style.setProperty("--y", pos.y + "px");
        ind.style.setProperty("--w", pos.w + "px");
        ind._pos = pos;
    }

    function measureIndicator(nav, active) {
        var nr = nav.getBoundingClientRect();
        var ar = active.getBoundingClientRect();
        return { x: ar.left - nr.left, y: ar.bottom - nr.top + 5, w: ar.width };
    }

    function setupIndicator() {
        var nav = document.querySelector("header nav");
        if (!nav || nav.offsetWidth === 0) return;           // menú móvil: no aplica

        var active = nav.querySelector('a[aria-current="page"]');
        if (!active) return;

        var ind = nav.querySelector(".pt-indicator");
        if (!ind) {
            ind = document.createElement("span");
            ind.className = "pt-indicator";
            ind.setAttribute("aria-hidden", "true");
            nav.appendChild(ind);
        }

        var target = measureIndicator(nav, active);

        var prev = null;
        try {
            prev = JSON.parse(sessionStorage.getItem(IND_KEY) || "null");
            sessionStorage.removeItem(IND_KEY);
        } catch (e) { /* ignorar */ }

        if (prev && root.classList.contains("pt-internal") && !reducedMotion) {
            // Empieza donde estaba en la página anterior y se desliza hasta la nueva
            applyIndicator(ind, prev);
            ind.classList.add("pt-ind-on");
            void ind.offsetWidth;                            // fuerza el reflow
            ind.classList.add("pt-ind-anim");
            applyIndicator(ind, target);
        } else {
            applyIndicator(ind, target);
            ind.classList.add("pt-ind-on");
            window.requestAnimationFrame(function () {
                ind.classList.add("pt-ind-anim");
            });
        }

        // Reajuste si cambian las fuentes/idioma o el tamaño de ventana
        function refresh() {
            var a = nav.querySelector('a[aria-current="page"]');
            if (a && nav.offsetWidth > 0) applyIndicator(ind, measureIndicator(nav, a));
        }
        window.addEventListener("load", refresh);
        window.addEventListener("resize", refresh);
    }


    /* ------------------------------------------------------
       3. SALIDA: ¿este clic debe disparar la transición?
       ------------------------------------------------------ */
    function shouldTransition(event, link) {
        if (event.defaultPrevented) return false;            // otro script ya lo gestionó (p. ej. mini-carrito)
        if (event.button !== 0) return false;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

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

        if (url.origin !== window.location.origin) return false;

        if (
            normalize(url.pathname) === normalize(window.location.pathname) &&
            url.search === window.location.search
        ) {
            return false;
        }

        if (/\.(pdf|zip|png|jpe?g|gif|webp|svg|xml|txt|mp4)$/i.test(url.pathname)) {
            return false;
        }

        return true;
    }

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
        if (reducedMotion) return;                           // navegación normal

        event.preventDefault();
        if (leaving) return;                                 // evita dobles clics
        leaving = true;

        // Guarda dónde está el indicador para deslizarlo desde ahí
        try {
            var ind = document.querySelector("header nav .pt-indicator");
            if (ind && ind._pos) {
                sessionStorage.setItem(IND_KEY, JSON.stringify(ind._pos));
            }
        } catch (e) { /* ignorar */ }

        var href = link.href;
        root.classList.add("pt-leaving");

        window.setTimeout(function () {
            go(href);
        }, LEAVE_MS);
    });

    // Botón "atrás" con bfcache: limpiar el estado de salida
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            leaving = false;
            root.classList.remove("pt-leaving");
        }
    });


    /* ------------------------------------------------------
       Arranque
       ------------------------------------------------------ */
    function init() {
        markActiveLinks();
        setupIndicator();
        startEntrance();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
