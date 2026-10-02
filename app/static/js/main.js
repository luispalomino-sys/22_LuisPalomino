/* ========================================================= */
/* MAIN.JS - LÓGICA COMPLETA DEL FRONTEND                    */
/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================= */
  /* 1. MENÚ MÓVIL Y NAVEGACIÓN PRINCIPAL                     */
  /* ========================================================= */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Menú desplegable de perfil / usuario
  const userMenuBtn = document.getElementById("user-menu-btn");
  const userDropdown = document.getElementById("user-dropdown");

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userDropdown.classList.add("hidden");
      }
    });
  }

  /* ========================================================= */
  /* 2. MODO CLARO / OSCURO (DARK MODE TOGGLE)               */
  /* ========================================================= */
  const themeToggleBtn = document.getElementById("theme-toggle");
  const darkIcon = document.getElementById("theme-toggle-dark-icon");
  const lightIcon = document.getElementById("theme-toggle-light-icon");

  if (themeToggleBtn) {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      if (lightIcon) lightIcon.classList.remove("hidden");
    } else {
      document.documentElement.classList.remove("dark");
      if (darkIcon) darkIcon.classList.remove("hidden");
    }

    themeToggleBtn.addEventListener("click", () => {
      if (darkIcon) darkIcon.classList.toggle("hidden");
      if (lightIcon) lightIcon.classList.toggle("hidden");

      if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        }
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        }
      }
    });
  }

  /* ========================================================= */
  /* 3. CATÁLOGO / TIENDA: FILTROS Y BÚSQUEDA                 */
  /* ========================================================= */
  const categoryFilters = document.querySelectorAll(".category-filter");
  const productItems = document.querySelectorAll(".product-item");
  const searchInput = document.getElementById("product-search");

  function filterProducts() {
    const activeCategoryBtn = document.querySelector(".category-filter.active");
    const activeCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute("data-category") : "all";
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

    productItems.forEach((product) => {
      const productCategory = product.getAttribute("data-category");
      const productName = product.querySelector(".product-title")?.textContent.toLowerCase() || "";
      const productDesc = product.querySelector(".product-description")?.textContent.toLowerCase() || "";

      const matchesCategory = activeCategory === "all" || productCategory === activeCategory;
      const matchesSearch = productName.includes(searchQuery) || productDesc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  }

  if (categoryFilters.length > 0) {
    categoryFilters.forEach((filter) => {
      filter.addEventListener("click", (e) => {
        e.preventDefault();
        categoryFilters.forEach((btn) => btn.classList.remove("active", "bg-sky-600", "text-white"));
        filter.classList.add("active", "bg-sky-600", "text-white");
        filterProducts();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }

  /* ========================================================= */
  /* 4. MODALES DE COMPRA Y DETALLES DE PRODUCTO               */
  /* ========================================================= */
  const productModals = document.querySelectorAll(".product-modal");
  const closeModalBtns = document.querySelectorAll(".close-modal-btn");
  const buyBtns = document.querySelectorAll(".buy-now-btn");

  buyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = btn.getAttribute("data-product-id");
      const targetModal = document.getElementById(`modal-product-${productId}`);
      if (targetModal) {
        targetModal.classList.remove("hidden");
      }
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      productModals.forEach((modal) => modal.classList.add("hidden"));
    });
  });

  window.addEventListener("click", (e) => {
    productModals.forEach((modal) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });

  /* ========================================================= */
  /* 5. FORMULARIO PASO A PASO (CONTACTO CLIENTE)             */
  /* ========================================================= */
  const contactStep1 = document.getElementById("contact-form-step-1");
  const contactStep2 = document.getElementById("contact-form-step-2");
  const contactSuccess = document.getElementById("contact-success");
  const btnNextStep = document.getElementById("btn-next-step");
  const btnBackStep = document.getElementById("btn-back-step");

  if (btnNextStep && contactStep1 && contactStep2) {
    btnNextStep.addEventListener("click", (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name")?.value.trim();
      const email = document.getElementById("contact-email")?.value.trim();

      if (!name || !email) {
        alert("Por favor, ingresa tu nombre y correo electrónico antes de continuar.");
        return;
      }

      contactStep1.classList.add("hidden");
      contactStep2.classList.remove("hidden");
    });
  }

  if (btnBackStep && contactStep1 && contactStep2) {
    btnBackStep.addEventListener("click", (e) => {
      e.preventDefault();
      contactStep2.classList.add("hidden");
      contactStep1.classList.remove("hidden");
    });
  }

  if (contactStep2) {
    contactStep2.addEventListener("submit", (e) => {
      e.preventDefault();
      contactStep2.classList.add("hidden");
      if (contactSuccess) {
        contactSuccess.classList.remove("hidden");
      }
    });
  }

  /* ========================================================= */
  /* 6. TOOLTIPS                                               */
  /* ========================================================= */
  const tooltipElements = document.querySelectorAll("[data-tooltip]");
  tooltipElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const tooltipText = el.getAttribute("data-tooltip");
      const tooltip = document.createElement("div");
      tooltip.className = "custom-tooltip absolute bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg z-50";
      tooltip.textContent = tooltipText;
      document.body.appendChild(tooltip);

      const rect = el.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 30 + window.scrollY}px`;
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    });

    el.addEventListener("mouseleave", () => {
      document.querySelectorAll(".custom-tooltip").forEach((t) => t.remove());
    });
  });
});