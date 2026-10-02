/* ==========================================================
 features.js - Funcionalidades avanzadas + Soporte Multidioma
 1. Buscador global (Ctrl+K o "/")
 2. Mini-carrito lateral
 3. Cupones de descuento
 4. Validación de formularios en tiempo real
 5. Barra de progreso + botón "volver arriba"
 6. Animación de aparición al hacer scroll
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
 const norm = (s) =>
 s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

 // Función auxiliar de traducción rápida con fallback
 const tr = (key, fallback) => (typeof t === "function" ? t(key) : fallback);

 /* ---------------- 1. BUSCADOR GLOBAL ---------------- */
 const INDEX_DATA = {
 es: [
 { t: "Inicio", d: "Juntos por un campo más fuerte", u: "/", k: "home portada cooperativa" },
 { t: "Nosotros", d: "Historia, misión, visión y valores", u: "/nosotros", k: "historia mision vision valores cooperativa" },
 { t: "Conoce Matahuasi", d: "Lugares turísticos y cultura de Junín", u: "/conoce-matahuasi", k: "turismo junin lugares" },
 { t: "Productos", d: "Cuy y quinua de nuestros productores", u: "/productos", k: "tienda catalogo cuy quinua" },
 { t: "Cuy", d: "Producto - S/ 35.00", u: "/productos#cuy", k: "carne criadero" },
 { t: "Quinua", d: "Producto - S/ 18.00", u: "/productos#quinua", k: "grano andino" },
 { t: "Contactos", d: "Escríbenos por el formulario", u: "/contactos", k: "mensaje correo telefono" },
 { t: "Compra", d: "Tu carrito y proceso de pedido", u: "/compra", k: "carrito pedido pago envio" }
 ],
 en: [
 { t: "Home", d: "Together for a stronger countryside", u: "/", k: "home cover cooperative" },
 { t: "About Us", d: "History, mission, vision, and values", u: "/nosotros", k: "history mission vision values cooperative" },
 { t: "Discover Matahuasi", d: "Tourist attractions and culture in Junin", u: "/conoce-matahuasi", k: "tourism junin places" },
 { t: "Products", d: "Guinea pig and quinoa from our farmers", u: "/productos", k: "shop catalog cuy guinea pig quinoa" },
 { t: "Guinea Pig (Cuy)", d: "Product - S/ 35.00", u: "/productos#cuy", k: "meat breeding" },
 { t: "Quinoa", d: "Product - S/ 18.00", u: "/productos#quinua", k: "andean grain" },
 { t: "Contact Us", d: "Write us through the form", u: "/contactos", k: "message email phone" },
 { t: "Checkout", d: "Your cart and ordering process", u: "/compra", k: "cart order payment shipping" }
 ]
 };

 const sOverlay = document.createElement("div");
 sOverlay.className = "sf-overlay";
 sOverlay.innerHTML = `
 <div class="sf-box" role="dialog" aria-label="Buscar en el sitio">
 <input type="text" id="sf-input" placeholder="${tr("search.placeholder", "Buscar páginas y productos...")}" autocomplete="off">
 <ul class="sf-list" id="sf-list"></ul>
 <div class="sf-hint" id="sf-hint">${tr("search.hint", "↑↓ para moverte | Enter para abrir | Esc para cerrar")}</div>
 </div>`;
 document.body.appendChild(sOverlay);

 const sInput = sOverlay.querySelector("#sf-input");
 const sList = sOverlay.querySelector("#sf-list");
 const sHint = sOverlay.querySelector("#sf-hint");
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
 const lang = localStorage.getItem("sais_lang") || "es";
 const currentIndex = INDEX_DATA[lang] || INDEX_DATA.es;
 const q = norm(sInput.value.trim());

 sResults = currentIndex.filter((x) => !q || norm(x.t + " " + x.d + " " + x.k).includes(q));
 sActive = 0;

 if (!sResults.length) {
 sList.innerHTML = `<li class="sf-empty">${tr("search.empty", "Sin resultados para")} "${esc(sInput.value)}"</li>`;
 return;
 }

 sList.innerHTML = sResults.map((r, i) => `
 <li class="sf-item ${i === 0 ? "active" : ""}"><a href="${r.u}">${highlight(r.t, q)}<small>${esc(r.d)}</small></a></li>
 `).join("");
 }

 function setActive(n) {
 const items = sList.querySelectorAll(".sf-item");
 if (!items.length) return;
 sActive = (n + items.length) % items.length;
 items.forEach((li, i) => li.classList.toggle("active", i === sActive));
 if (items[sActive]) items[sActive].scrollIntoView({ block: "nearest" });
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
 if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
 e.preventDefault(); openSearch();
 } else if (e.key === "/" && !typing) {
 e.preventDefault(); openSearch();
 } else if (e.key === "Escape") {
 closeSearch(); closeMini();
 }
 });

 /* ---------------- 2. MINI-CARRITO LATERAL ---------------- */
 const mOverlay = document.createElement("div");
 mOverlay.className = "mc-overlay";
 const mPanel = document.createElement("aside");
 mPanel.className = "mc-panel";
 mPanel.setAttribute("aria-label", "Mini carrito");
 mPanel.innerHTML = `
 <div class="mc-head"><span id="mc-head-title">${tr("cart.title", "Tu carrito")}</span><button type="button" id="mc-close" aria-label="Cerrar">&times;</button></div>
 <div class="mc-body" id="mc-body"></div>
 <div class="mc-foot">
 <div class="mc-total"><span id="mc-subtotal-lbl">${tr("cart.subtotal", "Subtotal")}</span><span id="mc-total">S/ 0.00</span></div>
 <a class="mc-go" id="mc-checkout-btn" href="/compra">${tr("cart.checkout", "Ir a comprar")}</a>
 </div>`;
 document.body.append(mOverlay, mPanel);

 function renderMini() {
 const cart = readCart();
 const body = mPanel.querySelector("#mc-body");

 // Actualizar etiquetas multidioma
 const headTitle = mPanel.querySelector("#mc-head-title");
 const subtotalLbl = mPanel.querySelector("#mc-subtotal-lbl");
 const checkoutBtn = mPanel.querySelector("#mc-checkout-btn");
 if (headTitle) headTitle.textContent = tr("cart.title", "Tu carrito");
 if (subtotalLbl) subtotalLbl.textContent = tr("cart.subtotal", "Subtotal");
 if (checkoutBtn) checkoutBtn.textContent = tr("cart.checkout", "Ir a comprar");

 if (!cart.length) {
 body.innerHTML = `<p class="mc-empty">${tr("cart.empty", "🛒<br>Tu carrito está vacío.")}</p>`;
 } else {
 body.innerHTML = cart.map((it) => `
 <div class="mc-row">
 <img src="${esc(it.image)}" alt="${esc(it.name)}">
 <div><strong>${esc(it.name)}</strong><br><small>${it.quantity} × ${money(it.price)}</small></div>
 <button type="button" data-mc-remove="${esc(it.id)}">${tr("cart.remove", "Quitar")}</button>
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

 document.querySelectorAll("[data-add-product]").forEach((b) =>
 b.addEventListener("click", () => setTimeout(openMini, 150))
 );

 /* ---------------- 3. CUPONES DE DESCUENTO ---------------- */
 const COUPONS = { SAIS10: 0.10, CUY15: 0.15, QUINUA5: 0.05 };
 const subtotalEl = document.getElementById("cart-subtotal");
 if (subtotalEl) {
 const subRow = subtotalEl.parentElement;
 const dRow = document.createElement("div");
 dRow.className = "flex justify-between text-[#17624f]";
 dRow.id = "cart-discount-row";
 dRow.innerHTML = `<span id="cart-discount-lbl">${tr("coupon.discount", "Descuento")}</span><strong id="cart-discount">- S/ 0.00</strong>`;
 subRow.after(dRow);

 const box = document.createElement("div");
 box.className = "cp-box";
 box.innerHTML = `
 <label id="cp-lbl" style="font-size:.85rem;font-weight:600">${tr("coupon.label", "¿Tienes un cupón?")}</label>
 <div class="cp-row" style="margin-top:6px">
 <input type="text" id="coupon-input" placeholder="${tr("coupon.placeholder", "Ej. SAIS10")}" maxlength="12">
 <button type="button" id="coupon-apply">${tr("coupon.apply", "Aplicar")}</button>
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
 if (applied) {
 setCoupon("", 0);
 input.value = ""; input.disabled = false;
 btn.textContent = tr("coupon.apply", "Aplicar");
 msg.textContent = tr("coupon.removed", "Cupón eliminado.");
 msg.className = "cp-msg";
 return;
 }
 const code = input.value.trim().toUpperCase();
 if (!COUPONS[code]) {
 msg.textContent = tr("coupon.invalid", "Cupón no válido.");
 msg.className = "cp-msg err";
 return;
 }
 setCoupon(code, COUPONS[code]);
 input.disabled = true;
 btn.textContent = tr("coupon.remove", "Quitar");
 msg.textContent = `${tr("coupon.applied", "Cupón aplicado")}: ${COUPONS[code] * 100}%`;
 msg.className = "cp-msg ok";
 });

 input.addEventListener("keydown", (e) => { if (e.key === "Enter") btn.click(); });

 const finShip = document.getElementById("final-shipping");
 if (finShip) {
 const fRow = document.createElement("div");
 fRow.id = "final-discount-row";
 fRow.className = "flex justify-between text-[#17624f]";
 fRow.innerHTML = `<span id="final-discount-lbl">${tr("coupon.discount", "Descuento")}</span><strong id="final-discount">- S/ 0.00</strong>`;
 finShip.parentElement.before(fRow);
 }

 const saved = localStorage.getItem("sais_coupon_code");
 if (saved) {
 input.value = saved; input.disabled = true;
 btn.textContent = tr("coupon.remove", "Quitar");
 msg.textContent = `${tr("coupon.applied", "Cupón aplicado")}: ${saved}`;
 msg.className = "cp-msg ok";
 }
 syncDiscountRows();
 window.dispatchEvent(new Event("sais:cart-changed"));
 }

 /* ---------------- 4. VALIDACIÓN EN TIEMPO REAL ---------------- */
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

 /* ---------------- 6. APARICIÓN AL HACER SCROLL ---------------- */
 const targets = document.querySelectorAll("main section:not(:first-of-type) article, main section:not(:first-of-type) h2");
 if ("IntersectionObserver" in window && targets.length) {
 const io = new IntersectionObserver((entries) => {
 entries.forEach((en) => {
 if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
 });
 }, { threshold: 0.12 });
 targets.forEach((t) => { t.classList.add("rv"); io.observe(t); });
 }

 /* ---------------- 7. ESCUCHAR CAMBIO DE IDIOMA ---------------- */
 window.addEventListener("sais:lang-changed", () => {
 if (sInput) sInput.placeholder = tr("search.placeholder", "Buscar páginas y productos...");
 if (sHint) sHint.textContent = tr("search.hint", "↑↓ para moverte | Enter para abrir | Esc para cerrar");
 renderSearch();
 renderMini();

 const cpLbl = document.getElementById("cp-lbl");
 const cpInput = document.getElementById("coupon-input");
 const cpBtn = document.getElementById("coupon-apply");
 const cartDiscLbl = document.getElementById("cart-discount-lbl");
 const finalDiscLbl = document.getElementById("final-discount-lbl");

 if (cpLbl) cpLbl.textContent = tr("coupon.label", "¿Tienes un cupón?");
 if (cpInput && !cpInput.disabled) cpInput.placeholder = tr("coupon.placeholder", "Ej. SAIS10");
 if (cpBtn) {
 const applied = localStorage.getItem("sais_coupon_code");
 cpBtn.textContent = applied ? tr("coupon.remove", "Quitar") : tr("coupon.apply", "Aplicar");
 }
 if (cartDiscLbl) cartDiscLbl.textContent = tr("coupon.discount", "Descuento");
 if (finalDiscLbl) finalDiscLbl.textContent = tr("coupon.discount", "Descuento");
 });
});