/* ==========================================================
   CONTADORES ANIMADOS DE IMPACTO  (feature/sp8-US3_Counters)

   Cada número con data-count cuenta de 0 al valor final
   cuando su tarjeta entra en pantalla (una sola vez).
   - Usa IntersectionObserver + requestAnimationFrame
   - Easing "easeOutCubic": arranca rápido y frena al final
   - Respeta prefers-reduced-motion
   - Sin JS o sin IntersectionObserver, se ve el valor final
   ========================================================== */

(function () {
    "use strict";

    var DURATION = 2000;   // ms que dura el conteo
    var STAGGER  = 150;    // ms de retraso entre tarjetas

    var section = document.querySelector("[data-impact]");
    if (!section) return;                       // solo existe en /nosotros

    var cards   = Array.prototype.slice.call(section.querySelectorAll(".impact-card"));
    var numbers = Array.prototype.slice.call(section.querySelectorAll("[data-count]"));

    var reduced = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function format(value) {
        return Math.round(value).toLocaleString("es-PE");
    }

    function render(el, value) {
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = prefix + format(value) + suffix;
    }

    function animateNumber(el, delay) {
        var target = parseFloat(el.getAttribute("data-count")) || 0;

        if (reduced) { render(el, target); return; }

        window.setTimeout(function () {
            var start = null;

            function frame(now) {
                if (start === null) start = now;
                var progress = Math.min((now - start) / DURATION, 1);
                render(el, target * easeOutCubic(progress));

                if (progress < 1) {
                    window.requestAnimationFrame(frame);
                } else {
                    render(el, target);
                    el.classList.add("is-done");
                }
            }
            window.requestAnimationFrame(frame);
        }, delay);
    }

    function showCard(card, index) {
        var delay = index * STAGGER;
        card.style.setProperty("--ic-delay", delay + "ms");
        card.classList.add("is-visible");

        var num = card.querySelector("[data-count]");
        if (num) animateNumber(num, delay);
    }

    // Sin soporte de IntersectionObserver: mostrar todo con su valor final
    if (!("IntersectionObserver" in window)) {
        numbers.forEach(function (el) { render(el, parseFloat(el.getAttribute("data-count")) || 0); });
        return;
    }

    // Preparar: ocultar tarjetas y poner los números en 0
    section.classList.add("js-counters");
    numbers.forEach(function (el) { render(el, 0); });

    var io = new IntersectionObserver(function (entries) {
        // Si varias tarjetas aparecen a la vez, se escalonan en orden
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        visible.forEach(function (entry, k) {
            showCard(entry.target, k);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.35 });

    cards.forEach(function (card) { io.observe(card); });
})();
