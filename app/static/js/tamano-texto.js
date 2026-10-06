/* =========================================================
   tamano-texto.js - Funcionalidad 8: Control de tamano de texto
   - Botones A- / A / A+ fijos en pantalla
   - Cambia el font-size de <html> (Tailwind usa rem, todo escala)
   - Guarda la eleccion en localStorage (clave "sais_font_size")
   ========================================================= */
(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        const FS_KEY = "sais_font_size";
        const FS_STEPS = [87.5, 100, 112.5, 125];   // porcentajes
        const FS_DEFAULT = 1;                       // indice de 100 %

        const saved = localStorage.getItem(FS_KEY); // null si nunca se eligio
        let index = saved === null ? FS_DEFAULT : Number(saved);
        if (!Number.isInteger(index) || index < 0 || index >= FS_STEPS.length) index = FS_DEFAULT;

        const box = document.createElement("div");
        box.className = "fs-control";
        box.setAttribute("role", "group");
        box.setAttribute("aria-label", "Tama\u00f1o del texto");
        box.innerHTML =
            '<button type="button" data-fs="-1" aria-label="Reducir texto">A&minus;</button>' +
            '<button type="button" data-fs="0" aria-label="Tama\u00f1o normal">A</button>' +
            '<button type="button" data-fs="1" aria-label="Aumentar texto">A+</button>';
        document.body.appendChild(box);

        function apply() {
            document.documentElement.style.fontSize = FS_STEPS[index] + "%";
            box.querySelector('[data-fs="-1"]').disabled = index === 0;
            box.querySelector('[data-fs="1"]').disabled = index === FS_STEPS.length - 1;
            box.querySelector('[data-fs="0"]').classList.toggle("active", index === FS_DEFAULT);
            try { localStorage.setItem(FS_KEY, index); } catch (e) { /* modo privado */ }
        }

        box.addEventListener("click", function (e) {
            const b = e.target.closest("button[data-fs]");
            if (!b || b.disabled) return;
            const step = Number(b.dataset.fs);
            index = step === 0 ? FS_DEFAULT : index + step;
            apply();
        });

        apply();
    });
})();