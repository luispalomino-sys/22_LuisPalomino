
/* =========================================================
   CUY-DETALLE.JS
   Presentación animada del cuy en la página Productos
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Solo se activa si estamos en la página que contiene el cuy.
    const cuyArticle = document.querySelector("#cuy.product-item");
    const experienceSection = document.getElementById("cuy-experience");

    if (!cuyArticle || !experienceSection) return;

    const knowButton = cuyArticle.querySelector('a[href="#cuy-experience"]');
    const productImage = cuyArticle.querySelector(".product-image img");

    if (!knowButton || !productImage) return;

    let previousFocus = null;

    // Crear la presentación sin alterar el HTML de otras páginas.
    const overlay = document.createElement("div");
    overlay.className = "cuy-detail-overlay";
    overlay.setAttribute("aria-hidden", "true");

    overlay.innerHTML = `
        <article
            class="cuy-detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cuy-detail-title"
        >
            <button
                type="button"
                class="cuy-detail-close"
                aria-label="Cerrar presentación"
            >×</button>

            <div class="cuy-detail-visual">
                <img src="${productImage.getAttribute("src")}"
                     alt="Cuy de la cooperativa">
                <span class="cuy-detail-visual-label">
                    Tradición · Campo · Calidad
                </span>
            </div>

            <div class="cuy-detail-content">
                <span class="cuy-detail-eyebrow">
                    🐹 Conoce nuestro producto
                </span>

                <h2 class="cuy-detail-title" id="cuy-detail-title">
                    El cuy
                </h2>

                <p class="cuy-detail-description">
                    Más que un producto, el cuy representa el esfuerzo
                    de nuestros productores y una tradición importante
                    de la alimentación andina. Conoce un poco más sobre
                    su crianza y el trabajo de nuestra cooperativa.
                </p>

                <div class="cuy-detail-features">
                    <div class="cuy-detail-feature">
                        <span class="cuy-detail-feature-icon">🌱</span>
                        <div>
                            <strong>Crianza responsable</strong>
                            <p>El cuidado de los animales es parte
                            importante del proceso productivo.</p>
                        </div>
                    </div>

                    <div class="cuy-detail-feature">
                        <span class="cuy-detail-feature-icon">🏡</span>
                        <div>
                            <strong>Tradición de nuestra región</strong>
                            <p>El cuy forma parte de la cultura y
                            gastronomía de los Andes peruanos.</p>
                        </div>
                    </div>

                    <div class="cuy-detail-feature">
                        <span class="cuy-detail-feature-icon">🤝</span>
                        <div>
                            <strong>Trabajo de nuestros productores</strong>
                            <p>Cada producto refleja el compromiso
                            de las personas que lo hacen posible.</p>
                        </div>
                    </div>
                </div>

                <div class="cuy-detail-actions">
                    <button
                        type="button"
                        class="cuy-detail-button cuy-detail-button-primary"
                        data-cuy-detail-explore
                    >
                        Explorar datos curiosos <span aria-hidden="true">→</span>
                    </button>

                    <button
                        type="button"
                        class="cuy-detail-button cuy-detail-button-secondary"
                        data-cuy-detail-close
                    >
                        Volver a productos
                    </button>
                </div>
            </div>
        </article>
    `;

    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector(".cuy-detail-close");
    const exploreButton = overlay.querySelector("[data-cuy-detail-explore]");
    const backButton = overlay.querySelector("[data-cuy-detail-close]");

    function openPresentation(event) {
        if (event) event.preventDefault();

        previousFocus = document.activeElement;
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Dar tiempo a que se aplique la transición antes del foco.
        window.requestAnimationFrame(() => closeButton.focus());
    }

    function closePresentation() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    knowButton.addEventListener("click", openPresentation);
    closeButton.addEventListener("click", closePresentation);
    backButton.addEventListener("click", closePresentation);

    // Cerrar al pulsar fuera del panel.
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closePresentation();
        }
    });

    // Cerrar con Escape.
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            overlay.classList.contains("is-open")
        ) {
            closePresentation();
        }
    });

    // Llevar al usuario a la experiencia interactiva ya existente.
    exploreButton.addEventListener("click", () => {
        closePresentation();

        window.setTimeout(() => {
            experienceSection.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        }, 100);
    });
});
