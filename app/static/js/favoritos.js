/* =========================================================
   favoritos.js - Funcionalidad 7: Favoritos con corazon
   - Agrega un boton de corazon en la imagen de cada producto
   - Guarda los favoritos en localStorage (clave "sais_favs")
   - Muestra un aviso flotante (toast) al marcar / desmarcar
   - Sincroniza los corazones entre pestanas (evento "storage")
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

        /* ---------- Aviso flotante (toast) ---------- */
        const toastBox = document.createElement("div");
        toastBox.id = "sf-toast";
        toastBox.setAttribute("role", "status");
        toastBox.setAttribute("aria-live", "polite");
        document.body.appendChild(toastBox);
        let toastTimer;

        function showToast(text) {
            toastBox.textContent = text;
            toastBox.classList.add("show");
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
                toastBox.classList.remove("show");
            }, 2200);
        }

        /* ---------- Lectura / escritura en localStorage ---------- */
        const FAV_KEY = "sais_favs";

        function readFavs() {
            try {
                const f = JSON.parse(localStorage.getItem(FAV_KEY));
                return Array.isArray(f) ? f : [];
            } catch (e) {
                return [];
            }
        }
        function writeFavs(list) {
            try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) { /* modo privado */ }
        }

        function paintHeart(btn, on) {
            btn.classList.toggle("on", on);
            btn.setAttribute("aria-pressed", String(on));
            btn.textContent = on ? "\u2665" : "\u2661";   // ♥ / ♡
        }

        /* ---------- Buscar las tarjetas de producto ---------- */
        // Se detectan por el boton "Agregar al carrito" (data-add-product)
        // y tambien por la clase .product-item, para que funcione aunque
        // el HTML cambie un poco.
        const cards = new Set();
        document.querySelectorAll("[data-add-product]").forEach(function (b) {
            const c = b.closest("article, .product-item");
            if (c) cards.add(c);
        });
        document.querySelectorAll("article.product-item, .product-item").forEach(function (c) {
            cards.add(c);
        });

        cards.forEach(function (card, index) {
            const img = card.querySelector("img");
            const holder = img ? img.parentElement : card;
            if (holder.querySelector(".fav-btn")) return;      // evita duplicados

            const addBtn = card.querySelector("[data-add-product]");
            const id = card.id || (addBtn && addBtn.dataset.addProduct) || ("producto-" + index);
            const nameEl = card.querySelector("h1, h2, h3");
            const name = nameEl ? nameEl.textContent.replace(/\s+/g, " ").trim() : id;

            if (getComputedStyle(holder).position === "static") {
                holder.style.position = "relative";
            }

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "fav-btn";
            btn.dataset.favFor = id;
            btn.setAttribute("aria-label", "Guardar " + name + " en favoritos");
            paintHeart(btn, readFavs().indexOf(id) >= 0);
            holder.appendChild(btn);

            btn.addEventListener("click", function () {
                const favs = readFavs();
                const idx = favs.indexOf(id);
                if (idx >= 0) {
                    favs.splice(idx, 1);
                    showToast("Quitaste " + name + " de tus favoritos");
                } else {
                    favs.push(id);
                    showToast("\u2665 " + name + " guardado en favoritos");
                }
                writeFavs(favs);
                paintHeart(btn, idx < 0);
            });
        });

        /* ---------- Sincronizar entre pestanas ---------- */
        window.addEventListener("storage", function (e) {
            if (e.key !== FAV_KEY) return;
            const favs = readFavs();
            document.querySelectorAll(".fav-btn").forEach(function (b) {
                paintHeart(b, favs.indexOf(b.dataset.favFor) >= 0);
            });
        });
    });
})();