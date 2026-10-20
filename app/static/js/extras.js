/* extras.js - toast reutilizable: window.cuyToast(mensaje, tipo, ms) */
(function () {
    "use strict";

    function getWrap() {
        let wrap = document.getElementById("cuy-toast-wrap");
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.id = "cuy-toast-wrap";
            wrap.setAttribute("role", "status");
            wrap.setAttribute("aria-live", "polite");
            document.body.appendChild(wrap);
        }
        return wrap;
    }

    // tipo: "success" | "error" | "info"
    window.cuyToast = function (mensaje, tipo, ms) {
        const toast = document.createElement("div");
        toast.className = "cuy-toast" + (tipo === "error" ? " cuy-toast--error" : tipo === "info" ? " cuy-toast--info" : "");
        toast.textContent = mensaje;
        getWrap().appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add("cuy-toast--show");
        });

        setTimeout(function () {
            toast.classList.remove("cuy-toast--show");
            setTimeout(function () { toast.remove(); }, 300);
        }, ms || 3500);
    };
})();
