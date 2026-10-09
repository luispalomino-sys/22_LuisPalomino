/* ==========================================================
   FEATURES.JS
   Cooperativas Sais Capital Social

   Funciones:
   1. Buscador global
   2. Mini-carrito lateral
   3. Agregar / quitar productos
   4. Cupones
   5. Validación de formularios
   6. Barra de progreso
   7. Botón volver arriba
   8. Animaciones al hacer scroll
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const CART_KEY = "sais_cart";
    
    /* Traducción segura: usa i18n.js si está cargado */
    const tx = (key, fallback, vars) => {
        if (typeof t !== "function") return fallback;
        const result = t(key, vars);
        return result === key ? fallback : result;
    };

    /* ==========================================================
       UTILIDADES
       ========================================================== */

    function readCart() {
        try {
            const stored = localStorage.getItem(CART_KEY);

            if (!stored) return [];

            const cart = JSON.parse(stored);

            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));

        window.dispatchEvent(
            new Event("sais:cart-changed")
        );
    }

    function money(value) {
        return `S/ ${Number(value || 0).toFixed(2)}`;
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character])
        );
    }

    /* ==========================================================
       ESTILOS
       ========================================================== */

    function createStyles() {

        if (document.getElementById("sais-features-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "sais-features-styles";

        style.textContent = `

        .mc-overlay {
            position: fixed;
            inset: 0;
            z-index: 150;
            background: rgba(0,0,0,.45);
            opacity: 0;
            pointer-events: none;
            transition: .25s ease;
        }

        .mc-overlay.open {
            opacity: 1;
            pointer-events: auto;
        }

        .mc-panel {
            position: fixed;
            top: 0;
            right: 0;
            height: 100%;
            width: min(390px, 92vw);
            z-index: 160;
            background: #fff;
            box-shadow: -10px 0 40px rgba(0,0,0,.25);
            transform: translateX(100%);
            transition: transform .3s ease;
            display: flex;
            flex-direction: column;
        }

        .mc-panel.open {
            transform: translateX(0);
        }

        .mc-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 20px;
            background: #063f35;
            color: white;
            font-weight: 700;
        }

        .mc-head button {
            background: none;
            border: 0;
            color: white;
            font-size: 1.6rem;
            cursor: pointer;
        }

        .mc-body {
            flex: 1;
            overflow-y: auto;
            padding: 14px 20px;
        }

        .mc-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #eef3f1;
        }

        .mc-row img {
            width: 58px;
            height: 58px;
            object-fit: cover;
            border-radius: 10px;
        }

        .mc-row-info {
            flex: 1;
            color: #165449;
        }

        .mc-row-info strong {
            display: block;
            margin-bottom: 4px;
        }

        .mc-quantity {
            display: flex;
            align-items: center;
            gap: 7px;
            margin-top: 7px;
        }

        .mc-quantity button {
            width: 25px;
            height: 25px;
            border: 1px solid #dce8e3;
            border-radius: 6px;
            background: #f8faf8;
            cursor: pointer;
        }

        .mc-remove {
            border: 0;
            background: none;
            color: #c0392b;
            font-size: .75rem;
            cursor: pointer;
        }

        .mc-foot {
            padding: 18px 20px;
            border-top: 1px solid #e3ebe8;
        }

        .mc-total {
            display: flex;
            justify-content: space-between;
            font-weight: 700;
            color: #165449;
            margin-bottom: 12px;
        }

        .mc-go {
            display: block;
            text-align: center;
            background: #17624f;
            color: white;
            padding: 12px;
            border-radius: 999px;
            font-weight: 700;
            text-decoration: none;
        }

        .mc-empty {
            text-align: center;
            color: #6b7e78;
            padding: 50px 10px;
        }

        .cp-box {
            margin-top: 20px;
            padding: 16px;
            border: 1px solid #dce8e3;
            border-radius: 14px;
            background: #f8faf8;
        }

        .cp-row {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }

        .cp-row input {
            flex: 1;
            min-width: 0;
            padding: 10px 12px;
            border: 1px solid #dce8e3;
            border-radius: 8px;
            outline: none;
        }

        .cp-row button {
            padding: 10px 14px;
            border: 0;
            border-radius: 8px;
            background: #17624f;
            color: white;
            font-weight: 600;
            cursor: pointer;
        }

        .cp-msg {
            display: block;
            margin-top: 8px;
            font-size: .78rem;
        }

        .cp-success {
            color: #17624f;
        }

        .cp-error {
            color: #c0392b;
        }

        .fv-error {
            color: #c0392b;
            font-size: .78rem;
            margin-top: 5px;
        }

        .fv-invalid {
            border-color: #c0392b !important;
        }

        .fv-valid {
            border-color: #397d6c !important;
        }

        .fv-counter {
            text-align: right;
            color: #6b7e78;
            font-size: .75rem;
            margin-top: 4px;
        }

        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            width: 0;
            z-index: 500;
            background: #a9e6a1;
        }

        .back-top {
            position: fixed;
            right: 22px;
            bottom: 22px;
            width: 42px;
            height: 42px;
            border: 0;
            border-radius: 50%;
            background: #063f35;
            color: white;
            cursor: pointer;
            z-index: 120;
            opacity: 0;
            pointer-events: none;
            transform: translateY(10px);
            transition: .25s;
        }

        .back-top.show {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }

        .reveal-item {
            opacity: 0;
            transform: translateY(20px);
            transition:
                opacity .6s ease,
                transform .6s ease;
        }

        .reveal-item.revealed {
            opacity: 1;
            transform: translateY(0);
        }

        `;

        document.head.appendChild(style);
    }

    createStyles();


    /* ==========================================================
       CONTADOR DEL CARRITO
       ========================================================== */

    function updateCartCount() {

        const element = document.getElementById("cart-count");

        if (!element) return;

        const cart = readCart();

        const quantity = cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

        element.textContent = quantity;
    }


    /* ==========================================================
       CREAR MINI CARRITO
       ========================================================== */

    const miniOverlay = document.createElement("div");

    miniOverlay.className = "mc-overlay";


    const miniPanel = document.createElement("aside");

    miniPanel.className = "mc-panel";

    miniPanel.innerHTML = `

        <div class="mc-head">

            <span data-i18n="cart.title">
                Tu carrito
            </span>

            <button
                type="button"
                id="mc-close"
                aria-label="Cerrar carrito"
            >
                ×
            </button>

        </div>

        <div
            class="mc-body"
            id="mc-body"
        ></div>

        <div class="mc-foot">

            <div class="mc-total">

                <span data-i18n="cart.subtotal">
                    Subtotal
                </span>

                <span id="mc-total">
                    S/ 0.00
                </span>

            </div>

            <a
                href="/compra"
                class="mc-go"
                data-i18n="cart.checkout"
            >
                Ir a comprar
            </a>

        </div>
    `;

    document.body.appendChild(miniOverlay);
    document.body.appendChild(miniPanel);


    /* ==========================================================
       RENDER MINI CARRITO
       ========================================================== */

    function renderMiniCart() {

        const cart = readCart();

        const body = document.getElementById("mc-body");

        const totalElement =
            document.getElementById("mc-total");

        if (!body) return;


        if (cart.length === 0) {

            body.innerHTML = `

                <div class="mc-empty">

                    <div style="
                        font-size:2.5rem;
                        margin-bottom:10px;
                    ">
                        🛒
                    </div>

                    <p data-i18n="cart.empty">
                        Tu carrito está vacío.
                    </p>

                </div>
            `;

        } else {

            body.innerHTML = cart.map(item => `

                <div class="mc-row">

                    <img
                        src="${escapeHTML(item.image || "")}"
                        escapeHTML(tx("product." + item.id, item.name))
                    >

                    <div class="mc-row-info">

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <small>
                            ${money(item.price)}
                        </small>

                        <div class="mc-quantity">

                            <button
                                type="button"
                                data-cart-minus="${escapeHTML(item.id)}"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                data-cart-plus="${escapeHTML(item.id)}"
                            >
                                +
                            </button>

                            <button
                                type="button"
                                class="mc-remove"
                                data-mc-remove="${escapeHTML(item.id)}"
                            >
                                Quitar
                            </button>

                        </div>

                    </div>

                </div>

            `).join("");
        }


        const subtotal = cart.reduce(
            (sum, item) =>
                sum +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );

        if (totalElement) {
            totalElement.textContent = money(subtotal);
        }

        updateCartCount();

        if (typeof setLanguage === "function") {
            setLanguage(
                localStorage.getItem("sais_lang") || "es"
            );
        }
    }


    /* ==========================================================
       ABRIR / CERRAR MINI CARRITO
       ========================================================== */

    function openMiniCart() {

        renderMiniCart();

        miniOverlay.classList.add("open");
        miniPanel.classList.add("open");

        document.body.classList.add("overflow-hidden");
    }


    function closeMiniCart() {

        miniOverlay.classList.remove("open");
        miniPanel.classList.remove("open");

        document.body.classList.remove("overflow-hidden");
    }


    miniOverlay.addEventListener(
        "click",
        closeMiniCart
    );


    document
        .getElementById("mc-close")
        ?.addEventListener(
            "click",
            closeMiniCart
        );


    /* ==========================================================
       BOTÓN DEL CARRITO
       ========================================================== */

    const cartLink = document.querySelector(
        'a[aria-label="Carrito de compras"]'
    );

    const isPurchasePage =
        !!document.getElementById("purchase-step-1");


    if (cartLink && !isPurchasePage) {

        cartLink.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openMiniCart();
            }
        );
    }


    /* ==========================================================
       AGREGAR PRODUCTOS
       ========================================================== */

    function findProductData(button) {

        let id =
            button.dataset.productId ||
            button.dataset.id ||
            button.getAttribute("data-add-to-cart");


        let name =
            button.dataset.productName ||
            button.dataset.name;


        let price =
            button.dataset.productPrice ||
            button.dataset.price;


        let image =
            button.dataset.productImage ||
            button.dataset.image;


        /*
         * Si el botón no tiene atributos,
         * buscamos información dentro de su tarjeta.
         */

        const card =
            button.closest(
                "[data-product], .product-item, article, .product-card, .group"
            );


        if (card) {

            id =
                id ||
                card.dataset.productId ||
                card.dataset.id ||
                card.dataset.product;

            name =
                name ||
                card.dataset.productName ||
                card.dataset.name;

            price =
                price ||
                card.dataset.productPrice ||
                card.dataset.price;

            image =
                image ||
                card.dataset.productImage ||
                card.dataset.image;


            if (!name) {

                const title =
                    card.querySelector(
                        "h1, h2, h3, h4, .product-title"
                    );

                if (title) {
                    name = title.textContent.trim();
                }
            }


            if (!price) {

                const priceElement =
                    card.querySelector(
                        "[data-price], .price"
                    );

                if (priceElement) {

                    price =
                        priceElement.dataset.price ||
                        priceElement.textContent
                            .replace(/[^\d.,]/g, "")
                            .replace(",", ".");
                }
            }


            if (!image) {

                const img =
                    card.querySelector("img");

                if (img) {
                    image =
                        img.currentSrc ||
                        img.src;
                }
            }
        }


        /*
         * Último recurso: texto cercano al botón.
         */

        if (!name) {

            name =
                button.dataset.product ||
                button.textContent
                    .replace(/agregar al carrito/i, "")
                    .trim() ||
                "Producto";
        }


        if (!price) {

            const parentText =
                button.parentElement?.textContent || "";

            const match =
                parentText.match(
                    /(?:S\/|S\/\.)?\s*(\d+(?:[.,]\d{1,2})?)/
                );

            if (match) {
                price =
                    match[1].replace(",", ".");
            }
        }


        price = Number(
            String(price || 0)
                .replace("S/", "")
                .replace(",", ".")
                .trim()
        );


        if (!id) {
            id =
                name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
        }


        return {
            id: String(id),
            name: String(name || "Producto"),
            price: price,
            image: image || ""
        };
    }


    function addToCart(product) {

        const cart = readCart();

        const existing =
            cart.find(
                item =>
                    String(item.id) ===
                    String(product.id)
            );


        if (existing) {

            existing.quantity =
                Number(existing.quantity || 0) + 1;

        } else {

            cart.push({
                id: String(product.id),
                name: product.name,
                price: Number(product.price || 0),
                image: product.image || "",
                quantity: 1
            });
        }


        saveCart(cart);

        renderMiniCart();

        window.dispatchEvent(
            new Event("sais:cart-added")
        );
    }


    /*
     * Delegación de eventos:
     * funciona incluso si los productos se cargan
     * después de iniciar la página.
     */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-add-to-cart], .add-to-cart, [data-cart-add]"
                );


            if (!button) return;


            event.preventDefault();


            const product =
                findProductData(button);


            addToCart(product);
        }
    );


    /* ==========================================================
       CONTROLES DEL MINI CARRITO
       ========================================================== */

    miniPanel.addEventListener(
        "click",
        event => {

            const plus =
                event.target.closest(
                    "[data-cart-plus]"
                );

            const minus =
                event.target.closest(
                    "[data-cart-minus]"
                );

            const remove =
                event.target.closest(
                    "[data-mc-remove]"
                );


            if (plus) {

                const id =
                    String(plus.dataset.cartPlus);

                const cart = readCart();

                const item =
                    cart.find(
                        product =>
                            String(product.id) === id
                    );

                if (item) {
                    item.quantity++;
                }

                saveCart(cart);
                renderMiniCart();

                return;
            }


            if (minus) {

                const id =
                    String(minus.dataset.cartMinus);

                const cart = readCart();

                const item =
                    cart.find(
                        product =>
                            String(product.id) === id
                    );

                if (item) {

                    item.quantity--;

                    if (item.quantity <= 0) {

                        const index =
                            cart.indexOf(item);

                        cart.splice(index, 1);
                    }
                }

                saveCart(cart);
                renderMiniCart();

                return;
            }


            if (remove) {

                const id =
                    String(remove.dataset.mcRemove);

                const cart =
                    readCart().filter(
                        item =>
                            String(item.id) !== id
                    );

                saveCart(cart);
                renderMiniCart();
            }
        }
    );


    /* ==========================================================
       EVENTOS DEL CARRITO
       ========================================================== */

    window.addEventListener(
        "sais:cart-changed",
        () => {

            updateCartCount();
            renderMiniCart();
            updateCouponDiscount();
        }
    );


    window.addEventListener(
        "storage",
        event => {

            if (event.key === CART_KEY) {

                updateCartCount();
                renderMiniCart();
                updateCouponDiscount();
            }
        }
    );


    window.addEventListener(
        "sais:cart-added",
        () => {

            setTimeout(
                openMiniCart,
                100
            );
        }
    );


    updateCartCount();
    renderMiniCart();


    /* ==========================================================
       CUPONES
       ========================================================== */

    const COUPONS = {
        SAIS10: 0.10,
        CUY15: 0.15,
        QUINUA5: 0.05
    };


    function updateCouponDiscount() {

        const cart = readCart();

        const subtotal =
            cart.reduce(
                (sum, item) =>
                    sum +
                    Number(item.price || 0) *
                    Number(item.quantity || 0),
                0
            );


        const rate =
            Number(
                localStorage.getItem(
                    "sais_coupon_rate"
                ) || 0
            );


        const discount =
            subtotal * rate;


        const discountElement =
            document.getElementById(
                "cart-discount"
            );


        if (discountElement) {

            discountElement.textContent =
                `- S/ ${discount.toFixed(2)}`;
        }


        const shipping =
            subtotal > 0 ? 10 : 0;


        const total =
            Math.max(
                0,
                subtotal +
                shipping -
                discount
            );


        const totalElement =
            document.getElementById(
                "cart-total"
            );


        if (totalElement) {

            totalElement.textContent =
                money(total);
        }


        const finalDiscount =
            document.getElementById(
                "final-discount"
            );


        if (finalDiscount) {

            finalDiscount.textContent =
                `- S/ ${discount.toFixed(2)}`;
        }


        const finalTotal =
            document.getElementById(
                "final-total"
            );


        if (finalTotal) {

            finalTotal.textContent =
                money(total);
        }
    }


    function createCouponBox() {

        const subtotalElement =
            document.getElementById(
                "cart-subtotal"
            );


        if (!subtotalElement) return;


        if (
            document.getElementById(
                "coupon-box"
            )
        ) {
            return;
        }


        const subtotalRow =
            subtotalElement.parentElement;


        if (!subtotalRow) return;


        /*
         * FILA DESCUENTO
         */

        let discountRow =
            document.getElementById(
                "cart-discount-row"
            );


        if (!discountRow) {

            discountRow =
                document.createElement("div");

            discountRow.id =
                "cart-discount-row";

            discountRow.className =
                "flex justify-between text-[#17624f] mt-2";


            discountRow.innerHTML = `

                <span data-i18n="coupon.discount">
                    Descuento
                </span>

                <strong id="cart-discount">
                    - S/ 0.00
                </strong>
            `;


            subtotalRow.after(
                discountRow
            );
        }


        /*
         * CAJA DEL CUPÓN
         */

        const couponBox =
            document.createElement("div");

        couponBox.id =
            "coupon-box";

        couponBox.className =
            "cp-box";


        couponBox.innerHTML = `

            <label
                class="block text-sm font-semibold text-[#165449]"
                data-i18n="coupon.label"
            >
                ¿Tienes un cupón?
            </label>

            <div class="cp-row">

                <input
                    type="text"
                    id="coupon-input"
                    placeholder="Ej. SAIS10"
                    autocomplete="off"
                    data-i18n-placeholder="coupon.placeholder"
                >

                <button
                    type="button"
                    id="coupon-button"
                    data-i18n="coupon.apply"
                >
                    Aplicar
                </button>

            </div>

            <span
                id="coupon-message"
                class="cp-msg"
            ></span>
        `;


        const totalElement =
            document.getElementById(
                "cart-total"
            );


        if (totalElement?.parentElement) {

            totalElement
                .parentElement
                .before(couponBox);

        } else {

            subtotalRow.parentElement.append(
                couponBox
            );
        }


        const input =
            document.getElementById(
                "coupon-input"
            );

        const button =
            document.getElementById(
                "coupon-button"
            );

        const message =
            document.getElementById(
                "coupon-message"
            );


        function applyCoupon() {

            const code =
                input.value
                    .trim()
                    .toUpperCase();


            if (!code) {

                message.textContent =
                    "Escribe un código.";

                message.className =
                    "cp-msg cp-error";

                return;
            }


            if (
                Object.prototype.hasOwnProperty.call(
                    COUPONS,
                    code
                )
            ) {

                const rate =
                    COUPONS[code];


                localStorage.setItem(
                    "sais_coupon_code",
                    code
                );


                localStorage.setItem(
                    "sais_coupon_rate",
                    rate
                );


                message.textContent =
                    `Cupón ${code} aplicado. Descuento del ${rate * 100}%.`;

                message.className =
                    "cp-msg cp-success";


                updateCouponDiscount();


            } else {

                localStorage.removeItem(
                    "sais_coupon_code"
                );

                localStorage.removeItem(
                    "sais_coupon_rate"
                );


                message.textContent =
                    "El cupón no es válido.";

                message.className =
                    "cp-msg cp-error";


                updateCouponDiscount();
            }
        }


        button?.addEventListener(
            "click",
            applyCoupon
        );


        input?.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    applyCoupon();
                }
            }
        );


        const savedCode =
            localStorage.getItem(
                "sais_coupon_code"
            );


        if (savedCode && input) {

            input.value =
                savedCode;

            const rate =
                Number(
                    localStorage.getItem(
                        "sais_coupon_rate"
                    ) || 0
                );


            if (message) {

                message.textContent =
                    `Cupón ${savedCode} aplicado: ${rate * 100}% de descuento.`;

                message.className =
                    "cp-msg cp-success";
            }
        }


        if (typeof setLanguage === "function") {

            setLanguage(
                localStorage.getItem("sais_lang") || "es"
            );
        }
    }


    createCouponBox();
    updateCouponDiscount();


    /* ==========================================================
       BUSCADOR GLOBAL
       ========================================================== */

    const INDEX = [

        {
            t: "Inicio",
            d: "Juntos por un campo más fuerte",
            u: "/",
            k: "home portada cooperativa"
        },

        {
            t: "Nosotros",
            d: "Historia, misión, visión y valores",
            u: "/nosotros",
            k: "historia misión visión valores"
        },

        {
            t: "Conoce Matahuasi",
            d: "Lugares turísticos y cultura de Junín",
            u: "/conoce-matahuasi",
            k: "turismo junín lugares"
        },

        {
            t: "Productos",
            d: "Cuy y quinua de nuestros productores",
            u: "/productos",
            k: "productos tienda catálogo"
        },

        {
            t: "Cuy",
            d: "Producto destacado",
            u: "/productos#cuy",
            k: "cuy producto carne"
        },

        {
            t: "Quinua",
            d: "Producto agrícola",
            u: "/productos#quinua",
            k: "quinua producto agrícola"
        },

        {
            t: "Compra",
            d: "Carrito y pedido",
            u: "/compra",
            k: "carrito comprar pedido"
        },

        {
            t: "Contactos",
            d: "Comunícate con nosotros",
            u: "/contactos",
            k: "contacto correo teléfono"
        }
    ];


    function normalizeText(text) {

        return String(text)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }


    function createSearch() {

        if (
            document.getElementById(
                "site-search"
            )
        ) {
            return;
        }


        const overlay =
            document.createElement("div");

        overlay.id =
            "site-search";


        overlay.innerHTML = `

            <div
                class="
                    fixed
                    inset-0
                    z-[400]
                    bg-black/50
                    backdrop-blur-sm
                    flex
                    items-start
                    justify-center
                    pt-[100px]
                    px-4
                "
                id="search-bg"
            >

                <div
                    class="
                        bg-white
                        w-full
                        max-w-xl
                        rounded-2xl
                        shadow-2xl
                        overflow-hidden
                    "
                >

                    <div
                        class="
                            p-4
                            border-b
                            border-gray-200
                        "
                    >

                        <input
                            id="search-input"
                            type="text"
                            placeholder="Buscar..."
                            class="
                                w-full
                                outline-none
                                text-[#165449]
                                text-lg
                            "
                            autocomplete="off"
                        >

                    </div>

                    <div
                        id="search-results"
                        class="
                            max-h-[420px]
                            overflow-auto
                        "
                    ></div>

                </div>

            </div>
        `;


        document.body.appendChild(overlay);


        const input =
            document.getElementById(
                "search-input"
            );


        const results =
            document.getElementById(
                "search-results"
            );


        function renderResults(query) {

            const normalized =
                normalizeText(query);


            if (!normalized) {

                results.innerHTML = `
                    <p class="p-5 text-sm text-gray-500">
                        Escribe para buscar.
                    </p>
                `;

                return;
            }


            const found =
                INDEX.filter(item => {

                    const text =
                        normalizeText(
                            `${item.t} ${item.d} ${item.k}`
                        );

                    return text.includes(
                        normalized
                    );
                });


            if (!found.length) {

                results.innerHTML = `
                    <p class="p-5 text-sm text-gray-500">
                        No encontramos resultados.
                    </p>
                `;

                return;
            }


            results.innerHTML =
                found.map(item => `

                    <a
                        href="${item.u}"
                        class="
                            block
                            px-5
                            py-4
                            border-b
                            border-gray-100
                            hover:bg-[#e8f4ee]
                        "
                    >

                        <strong
                            class="
                                block
                                text-[#165449]
                            "
                        >
                            ${escapeHTML(item.t)}
                        </strong>

                        <small
                            class="text-[#6b7e78]"
                        >
                            ${escapeHTML(item.d)}
                        </small>

                    </a>

                `).join("");
        }


        input?.addEventListener(
            "input",
            () => renderResults(input.value)
        );


        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "search-bg"
                ) {
                    overlay.remove();
                }
            }
        );


        input?.focus();
    }


    const searchButton =
        document.getElementById(
            "search-button"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            createSearch
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                createSearch();

                return;
            }


            if (
                event.key === "/" &&
                !["INPUT", "TEXTAREA"].includes(
                    document.activeElement.tagName
                )
            ) {

                event.preventDefault();

                createSearch();
            }


            if (event.key === "Escape") {

                document
                    .getElementById("site-search")
                    ?.remove();

                closeMiniCart();
            }
        }
    );


    /* ==========================================================
       VALIDACIÓN DE FORMULARIOS
       ========================================================== */

const RULES = {
         "contact-name": value =>
            /^\p{L}[\p{L}\s'.-]{2,}$/u.test(value.trim())
                ? true
                : "Escribe tu nombre completo (solo letras).",

        "contact-email": value =>
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
                ? true
                : "Correo no válido.",

        "contact-phone": value =>
            value.trim() === "" || /^9\d{8}$/.test(value.replace(/\s/g, ""))
                ? true
                : "Celular de 9 dígitos que empiece con 9.",

        "buyer-name": value =>
            value.trim().length >= 3
                ? true
                : "Escribe tu nombre completo.",

        "buyer-email": value =>
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
                ? true
                : "Correo no válido.",
                
        "buyer-phone": value =>
            /^9\d{8}$/.test(
                value.replace(/\s/g, "")
            )
                ? true
                : "Celular peruano de 9 dígitos.",

        "buyer-address": value =>
            value.trim().length >= 6
                ? true
                : "Ingresa una dirección más completa.",

        "buyer-district": value =>
            value.trim().length >= 3
                ? true
                : "Ingresa el distrito.",

        "buyer-city": value =>
            value.trim().length >= 3
                ? true
                : "Ingresa la ciudad.",

        "contact-subject": value =>
            value.trim().length >= 4
                ? true
                : "El asunto es muy corto.",

        "contact-message": value =>
            value.trim().length >= 10
                ? true
                : "Cuéntanos un poco más."
    };


    function validateField(element) {

        const rule =
            RULES[element.id];

        if (!rule) return true;


        const result =
            rule(element.value);


        let error =
            element.parentElement?.querySelector(
                `.fv-error[data-for="${element.id}"]`
            );


        if (result === true) {

            element.classList.remove(
                "fv-invalid"
            );


            if (
                element.value.trim() !== ""
            ) {

                element.classList.add(
                    "fv-valid"
                );
            }


            error?.remove();

            return true;
        }


        element.classList.add(
            "fv-invalid"
        );

        element.classList.remove(
            "fv-valid"
        );


        if (!error) {

            error =
                document.createElement("p");

            error.className =
                "fv-error";

            error.dataset.for =
                element.id;

            element.after(error);
        }


        error.textContent =
            result;


        return false;
    }


    Object.keys(RULES).forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) return;


        element.addEventListener(
            "blur",
            () => validateField(element)
        );


        element.addEventListener(
            "input",
            () => {

                if (
                    element.classList.contains(
                        "fv-invalid"
                    )
                ) {
                    validateField(element);
                }
            }
        );
    });


    /* ==========================================================
       CONTADOR DE MENSAJE
       ========================================================== */

    const messageArea =
        document.getElementById(
            "contact-message"
        );


    if (messageArea) {

        const max = 500;

        messageArea.maxLength = max;


        const counter =
            document.createElement("div");

        counter.className =
            "fv-counter";

        counter.textContent =
            `0 / ${max}`;


        messageArea.after(counter);


        messageArea.addEventListener(
            "input",
            () => {

                counter.textContent =
                    `${messageArea.value.length} / ${max}`;
            }
        );
    }


    /* ==========================================================
       BLOQUEAR FORMULARIOS CON ERRORES
       ========================================================== */

    document.addEventListener(
        "submit",
        event => {

            const fields =
                [
                    ...event.target.querySelectorAll(
                        "input[id], textarea[id], select[id]"
                    )
                ].filter(
                    field => RULES[field.id]
                );


            const invalidFields =
                fields.filter(
                    field =>
                        !validateField(field)
                );


            if (invalidFields.length) {

                event.preventDefault();

                event.stopImmediatePropagation();

                invalidFields[0].focus();
            }
        },
        true
    );


    /* ==========================================================
       BARRA DE PROGRESO
       ========================================================== */

    const progress =
        document.createElement("div");

    progress.className =
        "scroll-progress";

    document.body.appendChild(progress);


    function updateProgress() {

        const scrollTop =
            window.scrollY;


        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        const percentage =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;


        progress.style.width =
            `${percentage}%`;
    }


    window.addEventListener(
        "scroll",
        updateProgress
    );


    updateProgress();


    /* ==========================================================
       BOTÓN VOLVER ARRIBA
       ========================================================== */

    const backTop =
        document.createElement("button");


    backTop.className =
        "back-top";

    backTop.innerHTML =
        "↑";

    backTop.setAttribute(
        "aria-label",
        "Volver arriba"
    );


    document.body.appendChild(
        backTop
    );


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {

                backTop.classList.add(
                    "show"
                );

            } else {

                backTop.classList.remove(
                    "show"
                );
            }
        }
    );


    backTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    /* ==========================================================
       ANIMACIONES AL HACER SCROLL
       ========================================================== */

    const revealElements =
        document.querySelectorAll(
            ".product-item, .cuy-experience, .cuy-gallery-item"
        );


    revealElements.forEach(
        element => {

            element.classList.add(
                "reveal-item"
            );
        }
    );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "revealed"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element =>
                observer.observe(element)
        );

    } else {

        revealElements.forEach(
            element =>
                element.classList.add(
                    "revealed"
                )
        );
    }


});