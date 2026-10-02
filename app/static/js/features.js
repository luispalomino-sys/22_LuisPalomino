/* ==========================================================
   FEATURES.JS
   Cooperativas Sais Capital Social

   Funciones:
   1. Buscador global
   2. Mini-carrito lateral
   3. Cupones
   4. Validación de formularios
   5. Barra de progreso
   6. Botón volver arriba
   7. Animaciones al hacer scroll
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const CART_KEY = "sais_cart";


    /* ==========================================================
       UTILIDADES
       ========================================================== */

    function readCart() {

        try {

            const stored =
                localStorage.getItem(
                    CART_KEY
                );

            if (!stored) {
                return [];
            }

            const cart =
                JSON.parse(stored);

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            return [];
        }
    }


    function money(number) {

        return (
            "S/ " +
            Number(number).toFixed(2)
        );
    }


    function escapeHTML(value) {

        return String(value)
            .replace(
                /[&<>"']/g,
                (character) => {

                    const entities = {

                        "&": "&amp;",

                        "<": "&lt;",

                        ">": "&gt;",

                        '"': "&quot;",

                        "'": "&#39;"

                    };

                    return entities[
                        character
                    ];
                }
            );
    }


    /* ==========================================================
       ESTILOS DEL MINI CARRITO
       ========================================================== */

    function createMiniCartStyles() {

        if (
            document.getElementById(
                "mini-cart-styles"
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                "style"
            );

        style.id =
            "mini-cart-styles";


        style.textContent = `

            .mc-overlay {

                position: fixed;

                inset: 0;

                z-index: 150;

                background:
                    rgba(0,0,0,.45);

                opacity: 0;

                pointer-events: none;

                transition: .25s;
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

                width:
                    min(390px, 92vw);

                z-index: 160;

                background: #fff;

                box-shadow:
                    -10px 0 40px
                    rgba(0,0,0,.25);

                transform:
                    translateX(100%);

                transition:
                    transform .3s ease;

                display: flex;

                flex-direction: column;
            }


            .mc-panel.open {

                transform:
                    translateX(0);
            }


            .mc-head {

                display: flex;

                justify-content:
                    space-between;

                align-items: center;

                padding:
                    18px 20px;

                background:
                    #063f35;

                color: #fff;

                font-weight: 700;
            }


            .mc-head button {

                background: none;

                border: 0;

                color: #fff;

                font-size: 1.6rem;

                cursor: pointer;

                line-height: 1;
            }


            .mc-body {

                flex: 1;

                overflow: auto;

                padding:
                    14px 20px;
            }


            .mc-row {

                display: flex;

                gap: 12px;

                align-items: center;

                padding:
                    10px 0;

                border-bottom:
                    1px solid #eef3f1;
            }


            .mc-row img {

                width: 54px;

                height: 54px;

                border-radius: 10px;

                object-fit: cover;
            }


            .mc-row-info {

                flex: 1;

                font-size: .9rem;

                color: #165449;
            }


            .mc-row small {

                color: #6b7e78;
            }


            .mc-row button {

                background: none;

                border: 0;

                color: #d33;

                cursor: pointer;

                font-size: .75rem;
            }


            .mc-foot {

                padding:
                    16px 20px;

                border-top:
                    1px solid #e3ebe8;
            }


            .mc-total {

                display: flex;

                justify-content:
                    space-between;

                font-weight: 700;

                margin-bottom: 12px;

                color: #165449;
            }


            .mc-go {

                display: block;

                text-align: center;

                background:
                    #17624f;

                color: #fff;

                padding: 12px;

                border-radius:
                    999px;

                font-weight: 700;

                text-decoration: none;
            }


            .mc-empty {

                text-align: center;

                color: #6b7e78;

                padding: 40px 0;
            }


            .cp-box {

                margin-top: 20px;

                padding: 16px;

                border:
                    1px solid #dce8e3;

                border-radius:
                    14px;

                background:
                    #f8faf8;
            }


            .cp-row {

                display: flex;

                gap: 8px;
            }


            .cp-row input {

                flex: 1;

                min-width: 0;

                padding:
                    10px 12px;

                border:
                    1px solid #dce8e3;

                border-radius:
                    8px;

                outline: none;
            }


            .cp-row input:focus {

                border-color:
                    #397d6c;
            }


            .cp-row button {

                padding:
                    10px 14px;

                border: 0;

                border-radius:
                    8px;

                background:
                    #17624f;

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

                color:
                    #17624f;
            }


            .cp-error {

                color:
                    #c0392b;
            }


            .fv-error {

                color:
                    #c0392b;

                font-size:
                    .78rem;

                margin-top:
                    5px;
            }


            .fv-invalid {

                border-color:
                    #c0392b !important;
            }


            .fv-valid {

                border-color:
                    #397d6c !important;
            }


            .fv-counter {

                text-align:
                    right;

                color:
                    #6b7e78;

                font-size:
                    .75rem;

                margin-top:
                    4px;
            }


            .scroll-progress {

                position: fixed;

                top: 0;

                left: 0;

                height: 3px;

                width: 0;

                z-index: 500;

                background:
                    #a9e6a1;
            }


            .back-top {

                position: fixed;

                right: 22px;

                bottom: 22px;

                width: 42px;

                height: 42px;

                border: 0;

                border-radius: 50%;

                background:
                    #063f35;

                color: #fff;

                cursor: pointer;

                z-index: 120;

                opacity: 0;

                pointer-events: none;

                transform:
                    translateY(10px);

                transition:
                    .25s;
            }


            .back-top.show {

                opacity: 1;

                pointer-events: auto;

                transform:
                    translateY(0);
            }


            .reveal-item {

                opacity: 0;

                transform:
                    translateY(20px);

                transition:
                    opacity .6s ease,
                    transform .6s ease;
            }


            .reveal-item.revealed {

                opacity: 1;

                transform:
                    translateY(0);
            }

        `;


        document.head.appendChild(
            style
        );
    }


    createMiniCartStyles();


    /* ==========================================================
       MINI CARRITO
       ========================================================== */

    const miniOverlay =
        document.createElement(
            "div"
        );

    miniOverlay.className =
        "mc-overlay";


    const miniPanel =
        document.createElement(
            "aside"
        );

    miniPanel.className =
        "mc-panel";


    miniPanel.innerHTML = `

        <div class="mc-head">

            <span>
                🛒 Mi carrito
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

                <span>
                    Total
                </span>

                <span id="mc-total">
                    S/ 0.00
                </span>

            </div>

            <a
                href="/compra"
                class="mc-go"
            >
                Ir a comprar
            </a>

        </div>

    `;


    document.body.append(
        miniOverlay,
        miniPanel
    );


    function renderMiniCart() {

        const cart =
            readCart();


        const body =
            miniPanel.querySelector(
                "#mc-body"
            );


        if (!body) {
            return;
        }


        if (cart.length === 0) {

            body.innerHTML = `

                <div class="mc-empty">

                    <div
                        style="
                            font-size:2.5rem;
                            margin-bottom:10px;
                        "
                    >
                        🛒
                    </div>

                    <p>
                        Tu carrito está vacío.
                    </p>

                </div>

            `;

        } else {

            body.innerHTML =
                cart.map(
                    (item) => {

                        return `

                            <div
                                class="mc-row"
                            >

                                <img
                                    src="${escapeHTML(item.image)}"
                                    alt="${escapeHTML(item.name)}"
                                >

                                <div
                                    class="mc-row-info"
                                >

                                    <strong>
                                        ${escapeHTML(item.name)}
                                    </strong>

                                    <br>

                                    <small>
                                        ${item.quantity}
                                        ×
                                        ${money(item.price)}
                                    </small>

                                </div>

                                <button
                                    type="button"
                                    data-mc-remove="${escapeHTML(item.id)}"
                                >
                                    Quitar
                                </button>

                            </div>

                        `;

                    }
                ).join("");
        }


        const total =
            cart.reduce(
                (sum, item) => {

                    return sum +
                        Number(item.price) *
                        Number(item.quantity);

                },
                0
            );


        const totalElement =
            miniPanel.querySelector(
                "#mc-total"
            );


        if (totalElement) {

            totalElement.textContent =
                money(total);
        }
    }


    function openMiniCart() {

        renderMiniCart();

        miniOverlay.classList.add(
            "open"
        );

        miniPanel.classList.add(
            "open"
        );

        document.body.classList.add(
            "overflow-hidden"
        );
    }


    function closeMiniCart() {

        miniOverlay.classList.remove(
            "open"
        );

        miniPanel.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "overflow-hidden"
        );
    }


    miniOverlay.addEventListener(
        "click",
        closeMiniCart
    );


    const miniClose =
        miniPanel.querySelector(
            "#mc-close"
        );


    if (miniClose) {

        miniClose.addEventListener(
            "click",
            closeMiniCart
        );
    }


    miniPanel.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-mc-remove]"
                );


            if (!button) {
                return;
            }


            const id =
                button.dataset.mcRemove;


            const newCart =
                readCart().filter(
                    item =>
                        item.id !== id
                );


            localStorage.setItem(
                CART_KEY,
                JSON.stringify(newCart)
            );


            window.dispatchEvent(
                new Event(
                    "sais:cart-changed"
                )
            );


            renderMiniCart();
        }
    );


    /* ==========================================================
       ABRIR MINI CARRITO DESDE EL ICONO
       ========================================================== */

    const cartLink =
        document.querySelector(
            'a[aria-label="Carrito de compras"]'
        );


    const isPurchasePage =
        !!document.getElementById(
            "purchase-step-1"
        );


    if (
        cartLink &&
        !isPurchasePage
    ) {

        cartLink.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openMiniCart();

            }
        );
    }


    /* ==========================================================
       ABRIR MINI CARRITO AL AGREGAR
       ========================================================== */

    window.addEventListener(
        "sais:cart-added",
        () => {

            setTimeout(
                () => {

                    openMiniCart();

                },
                150
            );

        }
    );


    /* ==========================================================
       ACTUALIZAR MINI CARRITO
       ========================================================== */

    window.addEventListener(
        "sais:cart-changed",
        () => {

            renderMiniCart();

        }
    );


    /* ==========================================================
       CUPONES
       ========================================================== */

    const COUPONS = {

        SAIS10: 0.10,

        CUY15: 0.15,

        QUINUA5: 0.05

    };


    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );


    if (subtotalElement) {

        const subtotalRow =
            subtotalElement.parentElement;


        /* ------------------------------------------------------
           FILA DEL DESCUENTO
           ------------------------------------------------------ */

        let discountRow =
            document.getElementById(
                "cart-discount-row"
            );


        if (!discountRow) {

            discountRow =
                document.createElement(
                    "div"
                );

            discountRow.id =
                "cart-discount-row";

            discountRow.className =
                "flex justify-between text-[#17624f]";


            discountRow.innerHTML = `

                <span>
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


        /* ------------------------------------------------------
           CAJA DEL CUPÓN
           ------------------------------------------------------ */

        const couponBox =
            document.createElement(
                "div"
            );


        couponBox.className =
            "cp-box";


        couponBox.innerHTML = `

            <label
                style="
                    font-size:.85rem;
                    font-weight:600;
                "
            >
                ¿Tienes un cupón?
            </label>


            <div class="cp-row">

                <input
                    type="text"
                    id="coupon-input"
                    placeholder="Ej. SAIS10"
                    autocomplete="off"
                >


                <button
                    type="button"
                    id="coupon-button"
                >
                    Aplicar
                </button>

            </div>


            <span
                id="coupon-message"
                class="cp-msg"
            ></span>

        `;


        const totalRow =
            document.getElementById(
                "cart-total"
            )?.parentElement;


        if (totalRow) {

            totalRow.before(
                couponBox
            );

        } else {

            subtotalRow.parentElement.append(
                couponBox
            );
        }


        /* ------------------------------------------------------
           APLICAR CUPÓN
           ------------------------------------------------------ */

        const couponInput =
            document.getElementById(
                "coupon-input"
            );


        const couponButton =
            document.getElementById(
                "coupon-button"
            );


        const couponMessage =
            document.getElementById(
                "coupon-message"
            );


        function applyCoupon() {

            if (
                !couponInput ||
                !couponMessage
            ) {
                return;
            }


            const code =
                couponInput.value
                    .trim()
                    .toUpperCase();


            if (!code) {

                couponMessage.textContent =
                    "Escribe un código.";

                couponMessage.className =
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
                    "sais_coupon_rate",
                    rate
                );


                localStorage.setItem(
                    "sais_coupon_code",
                    code
                );


                couponMessage.textContent =
                    `Cupón ${code} aplicado correctamente. Descuento del ${rate * 100}%.`;


                couponMessage.className =
                    "cp-msg cp-success";


                window.dispatchEvent(
                    new Event(
                        "sais:cart-changed"
                    )
                );


                /* Actualizar la vista */

                updateCouponDiscount();

            } else {

                localStorage.removeItem(
                    "sais_coupon_rate"
                );

                localStorage.removeItem(
                    "sais_coupon_code"
                );


                couponMessage.textContent =
                    "El cupón no es válido.";


                couponMessage.className =
                    "cp-msg cp-error";


                window.dispatchEvent(
                    new Event(
                        "sais:cart-changed"
                    )
                );
            }
        }


        if (couponButton) {

            couponButton.addEventListener(
                "click",
                applyCoupon
            );
        }


        if (couponInput) {

            couponInput.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        applyCoupon();
                    }

                }
            );
        }


        /* ------------------------------------------------------
           MOSTRAR CUPÓN GUARDADO
           ------------------------------------------------------ */

        const savedCode =
            localStorage.getItem(
                "sais_coupon_code"
            );


        if (
            savedCode &&
            couponInput
        ) {

            couponInput.value =
                savedCode;

            if (couponMessage) {

                const rate =
                    Number(
                        localStorage.getItem(
                            "sais_coupon_rate"
                        ) || 0
                    );


                couponMessage.textContent =
                    `Cupón ${savedCode} aplicado: ${rate * 100}% de descuento.`;

                couponMessage.className =
                    "cp-msg cp-success";
            }
        }
    }


    /* ==========================================================
       ACTUALIZAR DESCUENTO VISUAL
       ========================================================== */

    function updateCouponDiscount() {

        const cart =
            readCart();


        const subtotal =
            cart.reduce(
                (sum, item) => {

                    return sum +
                        Number(item.price) *
                        Number(item.quantity);

                },
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


        const totalElement =
            document.getElementById(
                "cart-total"
            );


        if (totalElement) {

            const shipping =
                subtotal > 0
                    ? 10
                    : 0;


            const total =
                Math.max(
                    0,
                    subtotal +
                    shipping -
                    discount
                );


            totalElement.textContent =
                `S/ ${total.toFixed(2)}`;
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

            const shipping =
                subtotal > 0
                    ? 10
                    : 0;


            const total =
                Math.max(
                    0,
                    subtotal +
                    shipping -
                    discount
                );


            finalTotal.textContent =
                `S/ ${total.toFixed(2)}`;
        }
    }


    window.addEventListener(
        "sais:cart-changed",
        updateCouponDiscount
    );


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
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );
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
            document.createElement(
                "div"
            );


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
                    >

                        <p
                            class="
                                p-5
                                text-sm
                                text-gray-500
                            "
                        >
                            Escribe para buscar.
                        </p>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        const input =
            document.getElementById(
                "search-input"
            );


        const results =
            document.getElementById(
                "search-results"
            );


        function renderResults(
            query
        ) {

            const normalized =
                normalizeText(query);


            if (!normalized) {

                results.innerHTML = `

                    <p
                        class="
                            p-5
                            text-sm
                            text-gray-500
                        "
                    >
                        Escribe para buscar.
                    </p>

                `;

                return;
            }


            const found =
                INDEX.filter(
                    item => {

                        const text =
                            normalizeText(
                                `${item.t} ${item.d} ${item.k}`
                            );

                        return text.includes(
                            normalized
                        );
                    }
                );


            if (!found.length) {

                results.innerHTML = `

                    <p
                        class="
                            p-5
                            text-sm
                            text-gray-500
                        "
                    >
                        No encontramos resultados.
                    </p>

                `;

                return;
            }


            results.innerHTML =
                found.map(
                    item => `

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
                                ${item.t}
                            </strong>

                            <small
                                class="
                                    text-[#6b7e78]
                                "
                            >
                                ${item.d}
                            </small>

                        </a>

                    `
                ).join("");
        }


        input.addEventListener(
            "input",
            () => {

                renderResults(
                    input.value
                );

            }
        );


        overlay.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.id ===
                    "search-bg"
                ) {

                    overlay.remove();
                }
            }
        );


        input.focus();
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
        (event) => {

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() ===
                    "k"
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


            if (
                event.key === "Escape"
            ) {

                const search =
                    document.getElementById(
                        "site-search"
                    );

                if (search) {

                    search.remove();
                }

                closeMiniCart();
            }

        }
    );


    /* ==========================================================
       VALIDACIÓN DE FORMULARIOS
       ========================================================== */

    const RULES = {

        "buyer-name": (value) => {

            return value.trim().length >= 3
                ? true
                : "Escribe tu nombre completo.";
        },


        "buyer-email": (value) => {

            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
                .test(value)
                ? true
                : "Correo no válido.";
        },


        "buyer-phone": (value) => {

            return /^9\d{8}$/
                .test(
                    value.replace(
                        /\s/g,
                        ""
                    )
                )
                ? true
                : "Celular peruano de 9 dígitos.";
        },


        "buyer-address": (value) => {

            return value.trim().length >= 6
                ? true
                : "Ingresa una dirección más completa.";
        },


        "buyer-district": (value) => {

            return value.trim().length >= 3
                ? true
                : "Ingresa el distrito.";
        },


        "buyer-city": (value) => {

            return value.trim().length >= 3
                ? true
                : "Ingresa la ciudad.";
        },


        "contact-subject": (value) => {

            return value.trim().length >= 4
                ? true
                : "El asunto es muy corto.";
        },


        "contact-message": (value) => {

            return value.trim().length >= 10
                ? true
                : "Cuéntanos un poco más.";
        }

    };


    function validateField(
        element
    ) {

        const rule =
            RULES[element.id];


        if (!rule) {
            return true;
        }


        const result =
            rule(element.value);


        let error =
            element.parentElement
                ?.querySelector(
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


            if (error) {

                error.remove();
            }


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
                document.createElement(
                    "p"
                );

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


    Object.keys(
        RULES
    ).forEach(
        (id) => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {
                return;
            }


            element.addEventListener(
                "blur",
                () => {

                    validateField(
                        element
                    );

                }
            );


            element.addEventListener(
                "input",
                () => {

                    if (
                        element.classList.contains(
                            "fv-invalid"
                        )
                    ) {

                        validateField(
                            element
                        );
                    }

                }
            );

        }
    );


    /* ==========================================================
       CONTADOR DE MENSAJE
       ========================================================== */

    const messageArea =
        document.getElementById(
            "contact-message"
        );


    if (messageArea) {

        const max = 500;


        messageArea.maxLength =
            max;


        const counter =
            document.createElement(
                "div"
            );


        counter.className =
            "fv-counter";


        counter.textContent =
            `0 / ${max}`;


        messageArea.after(
            counter
        );


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
        (event) => {

            const fields =
                [
                    ...event.target.querySelectorAll(
                        "input[id], textarea[id]"
                    )
                ].filter(
                    field =>
                        RULES[field.id]
                );


            const invalidFields =
                fields.filter(
                    field =>
                        !validateField(
                            field
                        )
                );


            if (
                invalidFields.length
            ) {

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
        document.createElement(
            "div"
        );


    progress.className =
        "scroll-progress";


    document.body.appendChild(
        progress
    );


    function updateProgress() {

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement
                .scrollHeight -
            window.innerHeight;


        const percentage =
            documentHeight > 0
                ? (
                    scrollTop /
                    documentHeight
                ) * 100
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
        document.createElement(
            "button"
        );


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

            if (
                window.scrollY > 500
            ) {

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


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                (entries) => {

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
                observer.observe(
                    element
                )
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