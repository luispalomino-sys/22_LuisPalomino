/* ==========================================================
   features.js - Funcionalidades nuevas de JavaScript
   1. Buscador global (Ctrl+K o "/")
   2. Mini-carrito lateral
   3. Cupones de descuento
   4. Validacion de formularios en tiempo real
   5. Barra de progreso + boton "volver arriba"
   6. Animacion de aparicion al hacer scroll
<<<<<<< HEAD:app/static/js/features.js
=======
   7. Favoritos con corazon + avisos (toast)
   8. Control de tamano de texto (accesibilidad)
>>>>>>> origin/develop:mi-proyecto/app/static/js/features.js
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const CART_KEY = "sais_cart";
    const readCart = () => {
        try {
            const c = JSON.parse(localStorage.getItem(CART_KEY));
            return Array.isArray(c) ? c : [];
        } catch (e) { return []; }
    };
    const money = (n) => "S/ " + Number(n).toFixed(2);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");


    /* ---------------- 1. BUSCADOR GLOBAL ---------------- */
    const INDEX = [
        { t: "Inicio", d: "Juntos por un campo más fuerte", u: "/", k: "home portada cooperativa" },
        { t: "Nosotros", d: "Historia, misión, visión y valores", u: "/nosotros", k: "historia mision vision valores cooperativa" },
        { t: "Conoce Matahuasi", d: "Lugares turísticos y cultura de Junín", u: "/conoce-matahuasi", k: "turismo junin lugares" },
        { t: "Productos", d: "Cuy y quinua de nuestros productores", u: "/productos", k: "tienda catalogo cuy quinua" },
        { t: "Cuy", d: "Producto - S/ 35.00", u: "/productos#cuy", k: "carne criadero" },
        { t: "Quinua", d: "Producto - S/ 18.00", u: "/productos#quinua", k: "grano andino" },
        { t: "Contactos", d: "Escríbenos por el formulario", u: "/contactos", k: "mensaje correo telefono" },
        { t: "Compra", d: "Tu carrito y proceso de pedido", u: "/compra", k: "carrito pedido pago envio" }
    ];

    const sOverlay = document.createElement("div");
    sOverlay.className = "sf-overlay";
    sOverlay.innerHTML = `
        <div class="sf-box" role="dialog" aria-label="Buscar en el sitio">
            <input type="text" id="sf-input" placeholder="Buscar páginas y productos..." autocomplete="off">
            <ul class="sf-list" id="sf-list"></ul>
            <div class="sf-hint">↑↓ para moverte · Enter para abrir · Esc para cerrar</div>
        </div>`;
    document.body.appendChild(sOverlay);

    const sInput = sOverlay.querySelector("#sf-input");
    const sList = sOverlay.querySelector("#sf-list");
    let sActive = 0;
    let sResults = [];

    function highlight(text, q) {
        const safe = esc(text);
        if (!q) return safe;
        const i = norm(text).indexOf(q);
        if (i < 0) return safe;
        return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
    }

    function renderSearch() {
        const q = norm(sInput.value.trim());
        sResults = INDEX.filter((x) => !q || norm(x.t + " " + x.d + " " + x.k).includes(q));
        sActive = 0;
        if (!sResults.length) {
            sList.innerHTML = '<li class="sf-empty">Sin resultados para "' + esc(sInput.value) + '"</li>';
            return;
        }
        sList.innerHTML = sResults.map((r, i) =>
            `<li class="sf-item${i === 0 ? " active" : ""}"><a href="${r.u}">${highlight(r.t, q)}<small>${esc(r.d)}</small></a></li>`
        ).join("");
    }

    function setActive(n) {
        const items = sList.querySelectorAll(".sf-item");
        if (!items.length) return;
        sActive = (n + items.length) % items.length;
        items.forEach((li, i) => li.classList.toggle("active", i === sActive));
        items[sActive].scrollIntoView({ block: "nearest" });
    }

    const openSearch = () => {
        sOverlay.classList.add("open");
        sInput.value = "";
        renderSearch();
        setTimeout(() => sInput.focus(), 0);
    };
    const closeSearch = () => sOverlay.classList.remove("open");

    sInput.addEventListener("input", renderSearch);
    sInput.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive(sActive + 1); }
        if (e.key === "ArrowUp") { e.preventDefault(); setActive(sActive - 1); }
        if (e.key === "Enter" && sResults[sActive]) window.location.href = sResults[sActive].u;
    });
    sOverlay.addEventListener("click", (e) => { if (e.target === sOverlay) closeSearch(); });

    const searchBtn = document.getElementById("search-button");
    if (searchBtn) searchBtn.addEventListener("click", openSearch);

    document.addEventListener("keydown", (e) => {
        const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
        else if (e.key === "/" && !typing) { e.preventDefault(); openSearch(); }
        else if (e.key === "Escape") { closeSearch(); closeMini(); }
    });


    /* ---------------- 2. MINI-CARRITO LATERAL ---------------- */
    const mOverlay = document.createElement("div");
    mOverlay.className = "mc-overlay";
    const mPanel = document.createElement("aside");
    mPanel.className = "mc-panel";
    mPanel.setAttribute("aria-label", "Mini carrito");
    mPanel.innerHTML = `
        <div class="mc-head"><span>Tu carrito</span><button type="button" id="mc-close" aria-label="Cerrar">&times;</button></div>
        <div class="mc-body" id="mc-body"></div>
        <div class="mc-foot">
            <div class="mc-total"><span>Subtotal</span><span id="mc-total">S/ 0.00</span></div>
            <a class="mc-go" href="/compra">Ir a comprar</a>
        </div>`;
    document.body.append(mOverlay, mPanel);

    function renderMini() {
        const cart = readCart();
        const body = mPanel.querySelector("#mc-body");
        if (!cart.length) {
            body.innerHTML = '<p class="mc-empty">🛒<br>Tu carrito está vacío.</p>';
        } else {
            body.innerHTML = cart.map((it) => `
                <div class="mc-row">
                    <img src="${esc(it.image)}" alt="${esc(it.name)}">
                    <div><strong>${esc(it.name)}</strong><br><small>${it.quantity} × ${money(it.price)}</small></div>
                    <button type="button" data-mc-remove="${esc(it.id)}">Quitar</button>
                </div>`).join("");
        }
        const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
        mPanel.querySelector("#mc-total").textContent = money(total);
    }

    function openMini() { renderMini(); mOverlay.classList.add("open"); mPanel.classList.add("open"); }
    function closeMini() { mOverlay.classList.remove("open"); mPanel.classList.remove("open"); }

    mOverlay.addEventListener("click", closeMini);
    mPanel.querySelector("#mc-close").addEventListener("click", closeMini);
    mPanel.addEventListener("click", (e) => {
        const id = e.target.dataset && e.target.dataset.mcRemove;
        if (!id) return;
        localStorage.setItem(CART_KEY, JSON.stringify(readCart().filter((i) => i.id !== id)));
        window.dispatchEvent(new Event("sais:cart-changed"));
        renderMini();
    });

    const onCheckout = !!document.getElementById("purchase-step-1");
    const cartLink = document.querySelector('a[aria-label="Carrito de compras"]');
    if (cartLink && !onCheckout) {
        cartLink.addEventListener("click", (e) => { e.preventDefault(); openMini(); });
    }
    // Se abre solo al agregar un producto
    document.querySelectorAll("[data-add-product]").forEach((b) =>
        b.addEventListener("click", () => setTimeout(openMini, 150)));


    /* ---------------- 3. CUPONES DE DESCUENTO ---------------- */
    const COUPONS = { SAIS10: 0.10, CUY15: 0.15, QUINUA5: 0.05 };

    const subtotalEl = document.getElementById("cart-subtotal");
    if (subtotalEl) {
        const subRow = subtotalEl.parentElement;

        const dRow = document.createElement("div");
        dRow.className = "flex justify-between text-[#17624f]";
        dRow.id = "cart-discount-row";
        dRow.innerHTML = '<span>Descuento</span><strong id="cart-discount">- S/ 0.00</strong>';
        subRow.after(dRow);

        const box = document.createElement("div");
        box.className = "cp-box";
        box.innerHTML = `
            <label style="font-size:.85rem;font-weight:600">¿Tienes un cupón?</label>
            <div class="cp-row" style="margin-top:6px">
                <input type="text" id="coupon-input" placeholder="Ej. SAIS10" maxlength="12">
                <button type="button" id="coupon-apply">Aplicar</button>
            </div>
            <p class="cp-msg" id="coupon-msg"></p>`;
        subRow.parentElement.after(box);

        const input = box.querySelector("#coupon-input");
        const msg = box.querySelector("#coupon-msg");
        const btn = box.querySelector("#coupon-apply");

        function syncDiscountRows() {
            const has = Number(localStorage.getItem("sais_coupon_rate") || 0) > 0;
            dRow.style.display = has ? "flex" : "none";
            const fin = document.getElementById("final-discount-row");
            if (fin) fin.style.display = has ? "flex" : "none";
        }

        function setCoupon(code, rate) {
            if (rate > 0) {
                localStorage.setItem("sais_coupon_rate", rate);
                localStorage.setItem("sais_coupon_code", code);
            } else {
                localStorage.removeItem("sais_coupon_rate");
                localStorage.removeItem("sais_coupon_code");
            }
            syncDiscountRows();
            window.dispatchEvent(new Event("sais:cart-changed"));
        }

        btn.addEventListener("click", () => {
            const applied = localStorage.getItem("sais_coupon_code");
            if (applied) {                       // segundo click = quitar
                setCoupon("", 0);
                input.value = ""; input.disabled = false;
                btn.textContent = "Aplicar";
                msg.textContent = "Cupón eliminado."; msg.className = "cp-msg";
                return;
            }
            const code = input.value.trim().toUpperCase();
            if (!COUPONS[code]) {
                msg.textContent = "Cupón no válido."; msg.className = "cp-msg err";
                return;
            }
            setCoupon(code, COUPONS[code]);
            input.disabled = true; btn.textContent = "Quitar";
            msg.textContent = `Cupón ${code} aplicado: ${COUPONS[code] * 100}% de descuento.`;
            msg.className = "cp-msg ok";
        });
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") btn.click(); });

        // Fila de descuento en el resumen final (paso 3)
        const finShip = document.getElementById("final-shipping");
        if (finShip) {
            const fRow = document.createElement("div");
            fRow.id = "final-discount-row";
            fRow.className = "flex justify-between text-[#17624f]";
            fRow.innerHTML = '<span>Descuento</span><strong id="final-discount">- S/ 0.00</strong>';
            finShip.parentElement.before(fRow);
        }

        // Restaurar cupón guardado
        const saved = localStorage.getItem("sais_coupon_code");
        if (saved) {
            input.value = saved; input.disabled = true; btn.textContent = "Quitar";
            msg.textContent = `Cupón ${saved} aplicado.`; msg.className = "cp-msg ok";
        }
        syncDiscountRows();
        window.dispatchEvent(new Event("sais:cart-changed"));
    }


    /* ---------------- 4. VALIDACION EN TIEMPO REAL ---------------- */
    const RULES = {
        "contact-name": (v) => v.trim().length >= 3 || "Escribe tu nombre completo (mín. 3 letras).",
        "contact-email": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Correo no válido.",
        "contact-phone": (v) => v === "" || /^9\d{8}$/.test(v.replace(/\s/g, "")) || "Celular peruano de 9 dígitos (empieza en 9).",
        "contact-subject": (v) => v.trim().length >= 4 || "El asunto es muy corto.",
        "contact-message": (v) => v.trim().length >= 10 || "Cuéntanos un poco más (mín. 10 caracteres).",
        "buyer-name": (v) => v.trim().length >= 3 || "Escribe tu nombre completo.",
        "buyer-email": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Correo no válido.",
        "buyer-phone": (v) => /^9\d{8}$/.test(v.replace(/\s/g, "")) || "Celular peruano de 9 dígitos (empieza en 9).",
        "buyer-address": (v) => v.trim().length >= 6 || "Ingresa una dirección más completa.",
        "buyer-district": (v) => v.trim().length >= 3 || "Ingresa el distrito.",
        "buyer-city": (v) => v.trim().length >= 3 || "Ingresa la ciudad."
    };

    function validateField(el) {
        const rule = RULES[el.id];
        if (!rule) return true;
        const res = rule(el.value);
        let err = el.parentElement.querySelector(".fv-error[data-for='" + el.id + "']");
        if (res === true) {
            el.classList.remove("fv-invalid");
            el.classList.toggle("fv-valid", el.value.trim() !== "");
            if (err) err.remove();
            return true;
        }
        el.classList.add("fv-invalid");
        el.classList.remove("fv-valid");
        if (!err) {
            err = document.createElement("p");
            err.className = "fv-error";
            err.dataset.for = el.id;
            el.after(err);
        }
        err.textContent = res;
        return false;
    }

    Object.keys(RULES).forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("blur", () => validateField(el));
        el.addEventListener("input", () => { if (el.classList.contains("fv-invalid")) validateField(el); });
    });

    // Contador de caracteres del mensaje
    const msgArea = document.getElementById("contact-message");
    if (msgArea) {
        const max = 500;
        msgArea.maxLength = max;
        const counter = document.createElement("div");
        counter.className = "fv-counter";
        counter.textContent = `0 / ${max}`;
        msgArea.after(counter);
        msgArea.addEventListener("input", () => { counter.textContent = `${msgArea.value.length} / ${max}`; });
    }

    // Bloquea el envio si hay errores (fase de captura: corre antes que main.js)
    document.addEventListener("submit", (e) => {
        const fields = [...e.target.querySelectorAll("input[id], textarea[id]")].filter((f) => RULES[f.id]);
        const bad = fields.filter((f) => !validateField(f));
        if (bad.length) {
            e.preventDefault();
            e.stopImmediatePropagation();
            bad[0].focus();
        }
    }, true);


    /* ---------------- 5. PROGRESO + VOLVER ARRIBA ---------------- */
    const bar = document.createElement("div");
    bar.id = "scroll-progress";
    const topBtn = document.createElement("button");
    topBtn.id = "back-to-top";
    topBtn.type = "button";
    topBtn.setAttribute("aria-label", "Volver arriba");
    topBtn.textContent = "↑";
    document.body.append(bar, topBtn);

    function onScroll() {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
        topBtn.classList.toggle("show", window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    onScroll();


    /* ---------------- 6. APARICION AL HACER SCROLL ---------------- */
    const targets = document.querySelectorAll("main section:not(:first-of-type) article, main section:not(:first-of-type) h2");
    if ("IntersectionObserver" in window && targets.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
            });
        }, { threshold: 0.12 });
        targets.forEach((t) => { t.classList.add("rv"); io.observe(t); });
    }
<<<<<<< HEAD:app/static/js/features.js
=======


    /* ---------------- AVISO FLOTANTE (toast) - lo usa la funcion 7 ---------------- */
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
        toastTimer = setTimeout(() => toastBox.classList.remove("show"), 2200);
    }


    /* ---------------- 7. FAVORITOS CON CORAZON ---------------- */
    // Cada producto (article.product-item) recibe un boton de corazon.
    // Los favoritos se guardan en localStorage y se sincronizan entre pestanas.
    const FAV_KEY = "sais_favs";
    const readFavs = () => {
        try {
            const f = JSON.parse(localStorage.getItem(FAV_KEY));
            return Array.isArray(f) ? f : [];
        } catch (e) { return []; }
    };
    const writeFavs = (list) => localStorage.setItem(FAV_KEY, JSON.stringify(list));

    const favProducts = document.querySelectorAll("article.product-item[id]");

    function paintHeart(btn, on) {
        btn.classList.toggle("on", on);
        btn.setAttribute("aria-pressed", String(on));
        btn.textContent = on ? "♥" : "♡";
    }

    favProducts.forEach((article) => {
        const holder = article.querySelector(".product-image");
        if (!holder) return;

        const id = article.id;
        const nameEl = article.querySelector("h2, h3");
        const name = nameEl ? nameEl.textContent.trim() : id;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fav-btn";
        btn.dataset.favFor = id;
        btn.setAttribute("aria-label", "Guardar " + name + " en favoritos");
        paintHeart(btn, readFavs().includes(id));
        holder.appendChild(btn);

        btn.addEventListener("click", () => {
            const favs = readFavs();
            const idx = favs.indexOf(id);
            if (idx >= 0) {
                favs.splice(idx, 1);
                showToast("Quitaste " + name + " de tus favoritos");
            } else {
                favs.push(id);
                showToast("♥ " + name + " guardado en favoritos");
            }
            writeFavs(favs);
            paintHeart(btn, idx < 0);
        });
    });

    // Si cambias favoritos en otra pestana, se actualizan los corazones aqui
    window.addEventListener("storage", (e) => {
        if (e.key !== FAV_KEY) return;
        const favs = readFavs();
        document.querySelectorAll(".fav-btn").forEach((b) =>
            paintHeart(b, favs.includes(b.dataset.favFor)));
    });


    /* ---------------- 8. TAMANO DE TEXTO (ACCESIBILIDAD) ---------------- */
    // Cambia el font-size de <html>; como Tailwind usa rem, todo el sitio escala.
    const FS_KEY = "sais_font_size";
    const FS_STEPS = [87.5, 100, 112.5, 125];   // porcentajes
    const FS_DEFAULT = 1;                       // indice de 100 %

    const fsSaved = localStorage.getItem(FS_KEY);   // null si nunca se eligio
    let fsIndex = fsSaved === null ? FS_DEFAULT : Number(fsSaved);
    if (!Number.isInteger(fsIndex) || fsIndex < 0 || fsIndex >= FS_STEPS.length) fsIndex = FS_DEFAULT;

    const fsBox = document.createElement("div");
    fsBox.className = "fs-control";
    fsBox.setAttribute("role", "group");
    fsBox.setAttribute("aria-label", "Tamaño del texto");
    fsBox.innerHTML = `
        <button type="button" data-fs="-1" aria-label="Reducir texto">A&minus;</button>
        <button type="button" data-fs="0" aria-label="Tamaño normal">A</button>
        <button type="button" data-fs="1" aria-label="Aumentar texto">A+</button>`;
    document.body.appendChild(fsBox);

    function applyFontSize() {
        document.documentElement.style.fontSize = FS_STEPS[fsIndex] + "%";
        fsBox.querySelector('[data-fs="-1"]').disabled = fsIndex === 0;
        fsBox.querySelector('[data-fs="1"]').disabled = fsIndex === FS_STEPS.length - 1;
        fsBox.querySelector('[data-fs="0"]').classList.toggle("active", fsIndex === FS_DEFAULT);
        try { localStorage.setItem(FS_KEY, fsIndex); } catch (e) { /* modo privado */ }
    }

    fsBox.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-fs]");
        if (!b || b.disabled) return;
        const step = Number(b.dataset.fs);
        fsIndex = step === 0 ? FS_DEFAULT : fsIndex + step;
        applyFontSize();
        showToast("Texto al " + FS_STEPS[fsIndex] + " %");
    });
    applyFontSize();

>>>>>>> origin/develop:mi-proyecto/app/static/js/features.js
});