/* ==========================================================
   MAIN.JS
   Cooperativas Sais Capital Social

   Funciones:
   1. Menú móvil
   2. Slider de inicio
   3. Carrito
   4. Agregar productos
   5. Cantidades
   6. Página de compra
   7. Resumen final
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================
       CONFIGURACIÓN
       ========================================================== */

    const CART_KEY = "sais_cart";

    const PRODUCTS = {
        cuy: {
            id: "cuy",
            name: "Cuy",
            price: 35.00,
            image: "/static/img/17.jpg"
        },

        quinua: {
            id: "quinua",
            name: "Quinua",
            price: 18.00,
            image: "/static/img/18.jpg"
        }
    };


    /* ==========================================================
       UTILIDADES DEL CARRITO
       ========================================================== */

    function getCart() {

        try {

            const stored = localStorage.getItem(CART_KEY);

            if (!stored) {
                return [];
            }

            const cart = JSON.parse(stored);

            return Array.isArray(cart) ? cart : [];

        } catch (error) {

            console.error("Error leyendo el carrito:", error);

            return [];
        }
    }


    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

        updateCartCount();

        window.dispatchEvent(
            new Event("sais:cart-changed")
        );
    }


    /* ==========================================================
       CONTADOR DEL CARRITO
       ========================================================== */

    function updateCartCount() {

        const cart = getCart();

        const totalQuantity = cart.reduce(
            (total, item) => {
                return total + Number(item.quantity || 0);
            },
            0
        );

        /* ID principal del header */

        const mainCounter =
            document.getElementById("cart-count");

        if (mainCounter) {

            mainCounter.textContent =
                totalQuantity;

            if (totalQuantity === 0) {

                mainCounter.classList.add("hidden");

            } else {

                mainCounter.classList.remove("hidden");
            }
        }


        /* Por si posteriormente usamos
           otros contadores */

        document
            .querySelectorAll("[data-cart-count]")
            .forEach((element) => {

                element.textContent =
                    totalQuantity;

                if (totalQuantity === 0) {

                    element.classList.add("hidden");

                } else {

                    element.classList.remove("hidden");
                }

            });
    }


    /* ==========================================================
       TOAST
       ========================================================== */

    function showToast(message) {

        let toast =
            document.getElementById("sais-toast");

        if (!toast) {

            toast =
                document.createElement("div");

            toast.id = "sais-toast";

            toast.className = `
                fixed
                bottom-6
                right-6
                z-[300]
                bg-[#063f35]
                text-white
                px-5
                py-3
                rounded-xl
                shadow-2xl
                font-semibold
                text-sm
                transition
                duration-300
                opacity-0
                translate-y-3
            `;

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        toast.classList.remove(
            "opacity-0",
            "translate-y-3"
        );

        toast.classList.add(
            "opacity-100",
            "translate-y-0"
        );

        clearTimeout(toast._timer);

        toast._timer =
            setTimeout(() => {

                toast.classList.add(
                    "opacity-0",
                    "translate-y-3"
                );

                toast.classList.remove(
                    "opacity-100",
                    "translate-y-0"
                );

            }, 2200);
    }


    /* ==========================================================
       AGREGAR PRODUCTO
       ========================================================== */

    function addToCart(productId) {

        const product =
            PRODUCTS[productId];

        if (!product) {

            console.error(
                "Producto no encontrado:",
                productId
            );

            return;
        }

        const cart = getCart();

        const existing =
            cart.find(
                item => item.id === productId
            );


        if (existing) {

            existing.quantity =
                Number(existing.quantity) + 1;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: Number(product.price),

                image: product.image,

                quantity: 1

            });
        }


        saveCart(cart);

        showToast(
            `${product.name} agregado al carrito`
        );


        /* Avisamos específicamente
           que se agregó un producto */

        window.dispatchEvent(
            new CustomEvent(
                "sais:cart-added",
                {
                    detail: {
                        product: product
                    }
                }
            )
        );
    }


    /* ==========================================================
       BOTONES "AGREGAR AL CARRITO"
       ========================================================== */

    document
        .querySelectorAll("[data-add-product]")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        button.dataset.addProduct;

                    addToCart(productId);
                }
            );

        });


    /* ==========================================================
       MENÚ MOBILE
       ========================================================== */

    const menuButton =
        document.getElementById(
            "mobile-menu-button"
        );

    const sidebar =
        document.getElementById(
            "mobile-sidebar"
        );

    const overlay =
        document.getElementById(
            "mobile-overlay"
        );

    const openIcon =
        document.getElementById(
            "menu-open-icon"
        );

    const closeIcon =
        document.getElementById(
            "menu-close-icon"
        );


    function openMobileMenu() {

        if (!sidebar || !overlay) {
            return;
        }

        sidebar.classList.remove(
            "translate-x-full"
        );

        overlay.classList.remove(
            "hidden"
        );


        if (openIcon) {

            openIcon.classList.add(
                "hidden"
            );
        }


        if (closeIcon) {

            closeIcon.classList.remove(
                "hidden"
            );
        }


        document.body.classList.add(
            "overflow-hidden"
        );
    }


    function closeMobileMenu() {

        if (!sidebar || !overlay) {
            return;
        }

        sidebar.classList.add(
            "translate-x-full"
        );

        overlay.classList.add(
            "hidden"
        );


        if (openIcon) {

            openIcon.classList.remove(
                "hidden"
            );
        }


        if (closeIcon) {

            closeIcon.classList.add(
                "hidden"
            );
        }


        document.body.classList.remove(
            "overflow-hidden"
        );
    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            () => {

                if (
                    sidebar &&
                    sidebar.classList.contains(
                        "translate-x-full"
                    )
                ) {

                    openMobileMenu();

                } else {

                    closeMobileMenu();
                }

            }
        );
    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMobileMenu
        );
    }


    document
        .querySelectorAll(".mobile-link")
        .forEach((link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });


    /* ==========================================================
       SLIDER DE INICIO
       ========================================================== */

    const slides =
        document.querySelectorAll(
            ".hero-slide"
        );

    const dots =
        document.querySelectorAll(
            ".slider-dot"
        );

    let currentSlide = 0;

    let sliderTimer = null;


    function showSlide(index) {

        if (!slides.length) {
            return;
        }


        if (index >= slides.length) {

            index = 0;
        }


        if (index < 0) {

            index =
                slides.length - 1;
        }


        slides.forEach(
            (slide, i) => {

                slide.classList.toggle(
                    "opacity-100",
                    i === index
                );

                slide.classList.toggle(
                    "opacity-0",
                    i !== index
                );

            }
        );


        dots.forEach(
            (dot, i) => {

                dot.classList.toggle(
                    "bg-white",
                    i === index
                );

                dot.classList.toggle(
                    "bg-white/40",
                    i !== index
                );

            }
        );


        currentSlide = index;
    }


    function startSlider() {

        if (!slides.length) {
            return;
        }

        clearInterval(
            sliderTimer
        );

        sliderTimer =
            setInterval(
                () => {

                    showSlide(
                        currentSlide + 1
                    );

                },
                5000
            );
    }


    dots.forEach(
        (dot) => {

            dot.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            dot.dataset.slide
                        );

                    showSlide(index);

                    startSlider();
                }
            );

        }
    );


    if (slides.length) {

        showSlide(0);

        startSlider();
    }


    /* ==========================================================
       ELEMENTOS DE LA PÁGINA COMPRA
       ========================================================== */

    const purchaseStep1 =
        document.getElementById(
            "purchase-step-1"
        );

    const purchaseStep2 =
        document.getElementById(
            "purchase-step-2"
        );

    const purchaseStep3 =
        document.getElementById(
            "purchase-step-3"
        );

    const purchaseSuccess =
        document.getElementById(
            "purchase-success"
        );


    /* ==========================================================
       RENDERIZAR CARRITO PRINCIPAL
       ========================================================== */

    function renderCart() {

        const container =
            document.getElementById(
                "cart-products"
            );

        if (!container) {
            return;
        }


        const cart = getCart();


        if (cart.length === 0) {

            container.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="px-6 py-12 text-center"
                    >

                        <div class="text-4xl mb-4">
                            🛒
                        </div>

                        <p
                            class="text-[#49665f] mb-5"
                        >
                            Tu carrito está vacío.
                        </p>

                        <a
                            href="/productos"
                            class="
                                inline-flex
                                bg-[#17624f]
                                text-white
                                px-5
                                py-2
                                rounded-full
                                font-semibold
                            "
                        >
                            Ver productos
                        </a>

                    </td>

                </tr>

            `;

            updateTotals();

            return;
        }


        container.innerHTML =
            cart.map(
                (item) => {

                    const price =
                        Number(item.price);

                    const quantity =
                        Number(item.quantity);

                    const subtotal =
                        price * quantity;


                    return `

                        <tr>

                            <td
                                class="
                                    px-5
                                    py-5
                                "
                            >

                                <div
                                    class="
                                        flex
                                        items-center
                                        gap-4
                                    "
                                >

                                    <img
                                        src="${item.image}"
                                        alt="${item.name}"
                                        class="
                                            w-16
                                            h-16
                                            rounded-xl
                                            object-cover
                                        "
                                    >

                                    <div>

                                        <p
                                            class="
                                                font-semibold
                                                text-[#165449]
                                            "
                                        >
                                            ${item.name}
                                        </p>

                                        <button
                                            type="button"
                                            data-remove-product="${item.id}"
                                            class="
                                                text-xs
                                                text-red-500
                                                mt-1
                                            "
                                        >
                                            Eliminar
                                        </button>

                                    </div>

                                </div>

                            </td>


                            <td
                                class="
                                    px-5
                                    py-5
                                    text-center
                                "
                            >
                                S/ ${price.toFixed(2)}
                            </td>


                            <td
                                class="px-5 py-5"
                            >

                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >

                                    <button
                                        type="button"
                                        data-minus-product="${item.id}"
                                        class="
                                            w-8
                                            h-8
                                            rounded-full
                                            border
                                            border-[#397d6c]
                                            text-[#397d6c]
                                        "
                                    >
                                        −
                                    </button>


                                    <span
                                        class="
                                            min-w-8
                                            text-center
                                            font-semibold
                                        "
                                    >
                                        ${quantity}
                                    </span>


                                    <button
                                        type="button"
                                        data-plus-product="${item.id}"
                                        class="
                                            w-8
                                            h-8
                                            rounded-full
                                            bg-[#17624f]
                                            text-white
                                        "
                                    >
                                        +
                                    </button>

                                </div>

                            </td>


                            <td
                                class="
                                    px-5
                                    py-5
                                    text-right
                                    font-semibold
                                "
                            >
                                S/ ${subtotal.toFixed(2)}
                            </td>

                        </tr>

                    `;

                }
            ).join("");


        attachCartButtons();

        updateTotals();
    }


    /* ==========================================================
       BOTONES DEL CARRITO
       ========================================================== */

    function attachCartButtons() {


        document
            .querySelectorAll(
                "[data-plus-product]"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            changeQuantity(
                                button.dataset.plusProduct,
                                1
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-minus-product]"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            changeQuantity(
                                button.dataset.minusProduct,
                                -1
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-remove-product]"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            removeFromCart(
                                button.dataset.removeProduct
                            );

                        }
                    );

                }
            );
    }


    function changeQuantity(
        productId,
        amount
    ) {

        const cart =
            getCart();

        const item =
            cart.find(
                product =>
                    product.id === productId
            );


        if (!item) {
            return;
        }


        item.quantity =
            Number(item.quantity) +
            amount;


        if (item.quantity <= 0) {

            const index =
                cart.findIndex(
                    product =>
                        product.id === productId
                );

            cart.splice(
                index,
                1
            );
        }


        saveCart(cart);

        renderCart();
    }


    function removeFromCart(
        productId
    ) {

        const cart =
            getCart().filter(
                item =>
                    item.id !== productId
            );


        saveCart(cart);

        renderCart();
    }


    /* ==========================================================
       TOTALES
       ========================================================== */

    function calculateTotals() {

        const cart =
            getCart();


        const subtotal =
            cart.reduce(
                (sum, item) => {

                    return sum +
                        Number(item.price) *
                        Number(item.quantity);

                },
                0
            );


        const shipping =
            subtotal > 0
                ? 10
                : 0;


        const couponRate =
            Number(
                localStorage.getItem(
                    "sais_coupon_rate"
                ) || 0
            );


        const validCouponRate =
            Math.min(
                Math.max(
                    couponRate,
                    0
                ),
                1
            );


        const discount =
            subtotal *
            validCouponRate;


        const total =
            Math.max(
                0,
                subtotal +
                shipping -
                discount
            );


        return {

            subtotal,

            shipping,

            discount,

            couponRate:
                validCouponRate,

            total
        };
    }


    function updateTotals() {

        const totals =
            calculateTotals();


        const subtotal =
            document.getElementById(
                "cart-subtotal"
            );

        const shipping =
            document.getElementById(
                "cart-shipping"
            );

        const discount =
            document.getElementById(
                "cart-discount"
            );

        const total =
            document.getElementById(
                "cart-total"
            );


        if (subtotal) {

            subtotal.textContent =
                `S/ ${totals.subtotal.toFixed(2)}`;
        }


        if (shipping) {

            shipping.textContent =
                `S/ ${totals.shipping.toFixed(2)}`;
        }


        if (discount) {

            discount.textContent =
                `- S/ ${totals.discount.toFixed(2)}`;
        }


        if (total) {

            total.textContent =
                `S/ ${totals.total.toFixed(2)}`;
        }
    }


    /* ==========================================================
       ACTUALIZAR CUANDO CAMBIA EL CARRITO
       ========================================================== */

    window.addEventListener(
        "sais:cart-changed",
        () => {

            updateCartCount();

            renderCart();

        }
    );


    /* ==========================================================
       NAVEGACIÓN DE COMPRA
       ========================================================== */

    function setupPurchaseNavigation() {

        const goStep2 =
            document.getElementById(
                "go-step-2"
            );

        const backStep1 =
            document.getElementById(
                "back-step-1"
            );

        const shippingForm =
            document.getElementById(
                "shipping-form"
            );

        const backStep2 =
            document.getElementById(
                "back-step-2"
            );

        const confirmOrder =
            document.getElementById(
                "confirm-order"
            );


        if (goStep2) {

            goStep2.addEventListener(
                "click",
                () => {

                    const cart =
                        getCart();


                    if (cart.length === 0) {

                        showToast(
                            "Agrega al menos un producto"
                        );

                        return;
                    }


                    showPurchaseStep(2);

                }
            );
        }


        if (backStep1) {

            backStep1.addEventListener(
                "click",
                () => {

                    showPurchaseStep(1);

                }
            );
        }


        if (shippingForm) {

            shippingForm.addEventListener(
                "submit",
                (event) => {

                    event.preventDefault();

                    renderFinalSummary();

                    showPurchaseStep(3);

                }
            );
        }


        if (backStep2) {

            backStep2.addEventListener(
                "click",
                () => {

                    showPurchaseStep(2);

                }
            );
        }


        if (confirmOrder) {

            confirmOrder.addEventListener(
                "click",
                confirmPurchase
            );
        }
    }


    /* ==========================================================
       MOSTRAR PASO DE COMPRA
       ========================================================== */

    function showPurchaseStep(step) {

        [
            purchaseStep1,
            purchaseStep2,
            purchaseStep3,
            purchaseSuccess

        ].forEach(
            (section) => {

                if (section) {

                    section.classList.add(
                        "hidden"
                    );
                }

            }
        );


        const selectedSection = {

            1: purchaseStep1,

            2: purchaseStep2,

            3: purchaseStep3

        }[step];


        if (selectedSection) {

            selectedSection.classList.remove(
                "hidden"
            );
        }


        updatePurchaseIndicators(
            step
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });
    }


    /* ==========================================================
       INDICADORES DE COMPRA
       ========================================================== */

    function updatePurchaseIndicators(
        step
    ) {

        document
            .querySelectorAll(
                ".purchase-step-indicator"
            )
            .forEach(
                (indicator) => {

                    const indicatorStep =
                        Number(
                            indicator.dataset.step
                        );

                    const circle =
                        indicator.querySelector(
                            "span"
                        );


                    if (
                        indicatorStep <= step
                    ) {

                        indicator.classList.add(
                            "active"
                        );


                        if (circle) {

                            circle.classList.remove(
                                "bg-[#dce8e3]",
                                "text-[#49665f]"
                            );

                            circle.classList.add(
                                "bg-[#17624f]",
                                "text-white"
                            );
                        }

                    } else {

                        indicator.classList.remove(
                            "active"
                        );


                        if (circle) {

                            circle.classList.remove(
                                "bg-[#17624f]",
                                "text-white"
                            );

                            circle.classList.add(
                                "bg-[#dce8e3]",
                                "text-[#49665f]"
                            );
                        }
                    }

                }
            );
    }


    /* ==========================================================
       RESUMEN FINAL
       ========================================================== */

    function renderFinalSummary() {

        const container =
            document.getElementById(
                "final-products"
            );


        if (!container) {
            return;
        }


        const cart =
            getCart();


        container.innerHTML =
            cart.map(
                (item) => {

                    const subtotal =
                        Number(item.price) *
                        Number(item.quantity);


                    return `

                        <div
                            class="
                                py-4
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <div
                                class="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                    class="
                                        w-14
                                        h-14
                                        rounded-lg
                                        object-cover
                                    "
                                >

                                <div>

                                    <p
                                        class="
                                            font-semibold
                                            text-[#165449]
                                        "
                                    >
                                        ${item.name}
                                    </p>

                                    <p
                                        class="
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        ${item.quantity}
                                        unidad(es)
                                    </p>

                                </div>

                            </div>


                            <strong>
                                S/
                                ${subtotal.toFixed(2)}
                            </strong>

                        </div>

                    `;

                }
            ).join("");


        const totals =
            calculateTotals();


        const finalSubtotal =
            document.getElementById(
                "final-subtotal"
            );

        const finalShipping =
            document.getElementById(
                "final-shipping"
            );

        const finalDiscount =
            document.getElementById(
                "final-discount"
            );

        const finalTotal =
            document.getElementById(
                "final-total"
            );


        if (finalSubtotal) {

            finalSubtotal.textContent =
                `S/ ${totals.subtotal.toFixed(2)}`;
        }


        if (finalShipping) {

            finalShipping.textContent =
                `S/ ${totals.shipping.toFixed(2)}`;
        }


        if (finalDiscount) {

            finalDiscount.textContent =
                `- S/ ${totals.discount.toFixed(2)}`;
        }


        if (finalTotal) {

            finalTotal.textContent =
                `S/ ${totals.total.toFixed(2)}`;
        }
    }


    /* ==========================================================
       CONFIRMAR PEDIDO
       ========================================================== */

    function confirmPurchase() {

        const name =
            document.getElementById(
                "buyer-name"
            )?.value ||
            "cliente";


        const email =
            document.getElementById(
                "buyer-email"
            )?.value ||
            "";


        const totals =
            calculateTotals();


        const orderNumber =
            "SAIS-" +
            Date.now()
                .toString()
                .slice(-6);


        const message =
            document.getElementById(
                "order-message"
            );


        if (message) {

            message.innerHTML = `

                Gracias,
                <strong>${name}</strong>.

                Tu pedido
                <strong>${orderNumber}</strong>
                ha sido registrado correctamente
                en esta demostración.

                <br><br>

                Se mostraría la información de
                confirmación al correo
                <strong>${email}</strong>.

                <br><br>

                Total del pedido:
                <strong>
                    S/ ${totals.total.toFixed(2)}
                </strong>

            `;
        }


        localStorage.removeItem(
            CART_KEY
        );

        localStorage.removeItem(
            "sais_coupon_rate"
        );


        updateCartCount();


        showPurchaseStep(4);


        if (purchaseSuccess) {

            purchaseSuccess.classList.remove(
                "hidden"
            );
        }
    }


    /* ==========================================================
       INICIALIZACIÓN
       ========================================================== */

    updateCartCount();


    if (purchaseStep1) {

        renderCart();

        setupPurchaseNavigation();

    }

});