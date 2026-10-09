/* ==========================================================
   i18n.js - Gestor de Traducciones Completo (Español / Inglés)
   ========================================================== */

const translations = {
  es: {
    // Navegación (Header & Footer)
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.matahuasi": "Conoce Matahuasi",
    "nav.contact": "Contactos",
    "nav.products": "Productos",
    "nav.buy": "Compra",
    "nav.menu": "Menú",
    "cart.view_products": "Ver productos",
    "cuyexp.tag": "🐹 Experiencia interactiva",
    "cuyexp.title": "Conoce nuestro Cuy",
    "cuyexp.desc": "Más que un producto, el cuy forma parte del trabajo y la producción de nuestros socios. Explora algunas características y descubre un dato diferente cada vez.",
    "footer.title": "Cooperativa Agraria\nProductores Agropecuarios\ndel Centro del Perú",

    // Hero / Inicio
    "hero.subtitle": "Cooperativas Sais",
    "hero.title_part1": "Juntos por un",
    "hero.title_part2": "Campo más fuerte",
    "hero.description": "Somos una cooperativa de productores agropecuarios del Centro del Perú comprometidos con la calidad, la sostenibilidad y el desarrollo de nuestras raíces.",
    "hero.btn_learn_more": "Conoce más",

    // Página: NOSOTROS
    "about.title": "Sobre nosotros",
    "about.breadcrumb_home": "Inicio",
    "about.breadcrumb_about": "Nosotros",
    "about.history_title": "Nuestra historia",
    "about.history_desc": "Somos una cooperativa agraria formada por productores del Centro del Perú, que nace con el objetivo de mejorar la producción, comercialización y calidad de nuestros productos, trabajando de manera organizada y sostenible.",
    "about.mission_title": "Misión",
    "about.mission_desc": "Impulsar el desarrollo de nuestros socios a través de una producción agropecuaria sostenible y de calidad, fortaleciendo el trabajo organizado y el crecimiento de nuestras comunidades.",
    "about.vision_title": "Visión",
    "about.vision_desc": "Ser una cooperativa reconocida por la calidad de nuestros productos y por el impacto positivo en nuestras comunidades.",
    "about.values_title": "Nuestros valores",
    "about.val_teamwork": "Trabajo en equipo",
    "about.val_commitment": "Compromiso",
    "about.val_sustainability": "Sostenibilidad",
    "about.val_quality": "Calidad",

    // Página: PRODUCTOS
    "prod.hero_tag": "Productos de nuestros productores",
    "prod.hero_title": "Nuestros productos",
    "prod.hero_desc": "Conoce algunos de los productos que forman parte del trabajo de nuestra cooperativa y descubre más sobre su origen.",
    "prod.section_tag": "Nuestra producción",
    "prod.section_title": "Productos que representan nuestro trabajo",
    "prod.section_desc": "Conoce nuestros principales productos y descubre el trabajo que existe detrás de cada uno de ellos.",
    "prod.cuy_tag": "Producto destacado",
    "prod.cuy_title": "Cuy",
    "prod.cuy_desc": "Criamos y comercializamos cuyes de alta calidad, cuidando cada etapa del proceso para ofrecer un producto saludable y nutritivo.",
    "prod.cuy_btn_know": "Conoce nuestro cuy ↓",
    "prod.cuy_btn_add": "Agregar al carrito",
    "prod.quinua_tag": "Producto agrícola",
    "prod.quinua_title": "Quinua",
    "prod.quinua_desc": "Cultivamos quinua, un producto tradicional de gran valor alimenticio que forma parte de la producción agrícola de nuestra región.",
    "prod.quinua_btn_know": "Conoce más ↗",
    "prod.feat_quality_title": "Calidad",
    "prod.feat_quality_desc": "Buscamos cuidar cada etapa de nuestros productos.",
    "prod.feat_resp_title": "Producción responsable",
    "prod.feat_resp_desc": "Valoramos el trabajo agrícola y el cuidado de nuestros procesos.",
    "prod.feat_partners_title": "Trabajo de nuestros socios",
    "prod.feat_partners_desc": "Cada producto representa el esfuerzo de nuestros productores.",

    // Página: CONOCE MATAHUASI
    "matahuasi.hero_title": "Matahuasi - Junín",
    "matahuasi.section_title": "MATAHUASI - JUNÍN",
    "matahuasi.description": "Matahuasi es uno de los quince distritos de la provincia de Concepción, ubicada en la región Junín, en el corazón del Valle del Mantaro. Destaca por su tradición agrícola, sus paisajes andinos y su riqueza cultural.",
    "matahuasi.places_title": "Conocer los mejores lugares turísticos de Matahuasi",
    "matahuasi.card_info": "Información turística",
    "matahuasi.card_maps": "Ver Matahuasi en Google Maps",
    "matahuasi.card_park": "Parque principal",

    // Página: CONTACTOS
    "contact.title": "Contacto",
    "contact.subtitle": "Estamos ubicados en Matahuasi, provincia de Concepción, Junín.",
    "contact.personal_data": "Datos personales",
    "contact.personal_desc": "Completa la información básica para poder comunicarnos contigo.",
    "contact.lbl_name": "Nombre completo *",
    "contact.ph_name": "Tu nombre completo",
    "contact.lbl_email": "Correo electrónico *",
    "contact.ph_email": "correo@ejemplo.com",
    "contact.lbl_phone": "Teléfono",
    "contact.ph_phone": "Tu número de teléfono",
    "contact.btn_next": "Siguiente",
    "contact.msg_title": "Mensaje",
    "contact.msg_desc": "Cuéntanos en qué podemos ayudarte.",
    "contact.lbl_subject": "Motivo de contacto *",
    "contact.ph_subject": "¿Por qué deseas contactarnos?",
    "contact.lbl_message": "Mensaje *",
    "contact.ph_message": "Escribe tu mensaje...",
    "contact.btn_back": "← Volver",
    "contact.btn_send": "Enviar mensaje",
    "contact.success_title": "¡Mensaje enviado!",
    "contact.success_desc": "Gracias por comunicarte con nosotros. Hemos recibido tu mensaje correctamente.",
    "contact.btn_home": "Volver al inicio",
    "contact.select_subject": "Selecciona una opción",
    "contact.option_buy_cuy": "Quiero comprar cuys",
    "contact.option_buy_quinua": "Quiero comprar quinua",
    "contact.option_products_info": "Quiero información sobre los productos",
    "contact.option_partner": "Quiero ser productor asociado",
    "contact.option_cooperative": "Quiero conocer más sobre la cooperativa",
    "contact.option_question": "Tengo una consulta",
    "contact.option_other": "Otro",

    // Página: COMPRA / CARRITO
    "buy.hero_title": "Compra",
    "buy.hero_desc": "Realiza tu pedido de manera sencilla.",
    "buy.step1": "Productos",
    "buy.step2": "Envío",
    "buy.step3": "Confirmar",
    "buy.th_product": "Producto",
    "buy.th_price": "Precio",
    "buy.th_quantity": "Cantidad",
    "buy.th_subtotal": "Subtotal",
    "buy.subtotal": "Subtotal",
    "buy.shipping": "Envío",
    "buy.total": "TOTAL",
    "buy.btn_add_more": "+ Agregar productos",
    "buy.btn_go_step2": "Continuar con el envío →",
    "buy.ship_title": "Información de envío",
    "buy.ship_subtitle": "Completa tus datos para preparar el pedido.",
    "buy.lbl_fullname": "Nombre completo *",
    "buy.ph_fullname": "Nombre completo",
    "buy.lbl_email": "Correo electrónico *",
    "buy.lbl_phone": "Teléfono *",
    "buy.lbl_address": "Dirección *",
    "buy.ph_address": "Dirección de entrega",
    "buy.lbl_district": "Distrito *",
    "buy.lbl_city": "Ciudad / Provincia *",
    "buy.lbl_region": "Departamento *",
    "buy.select_option": "Selecciona",
    "buy.lbl_delivery": "Método de entrega *",
    "buy.delivery_home": "Envío a domicilio",
    "buy.delivery_pickup": "Recojo",
    "buy.lbl_comment": "Comentario",
    "buy.ph_comment": "Información adicional...",
    "buy.btn_back_step1": "← Volver",
    "buy.btn_continue": "Continuar →",
    "buy.summary_title": "Resumen del pedido",
    "buy.payment_title": "Método de pago",
    "buy.pay_bank": "Transferencia bancaria",
    "buy.pay_yape": "Yape / Plin",
    "buy.pay_cod": "Pago contra entrega",
    "buy.btn_confirm": "Confirmar pedido",
    "buy.btn_back_step2": "← Volver a datos de envío",
    "buy.success_title": "¡Pedido confirmado!",
    "buy.btn_back_home": "Volver al inicio",

    // Buscador Global
    "search.placeholder": "Buscar páginas y productos...",
    "search.hint": "↑↓ para moverte | Enter para abrir | Esc para cerrar",
    "search.empty": "Sin resultados para",

    // Mini Carrito
    "cart.title": "Tu carrito",
    "cart.empty": "Tu carrito está vacío.",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Ir a comprar",
    "cart.remove": "Quitar",

    // Cupones
    "coupon.label": "¿Tienes un cupón?",
    "coupon.placeholder": "Ej. SAIS10",
    "coupon.apply": "Aplicar",
    "coupon.remove": "Quitar",
    "coupon.discount": "Descuento",
    "coupon.invalid": "Cupón no válido.",
    "coupon.removed": "Cupón eliminado.",
    "coupon.applied": "Cupón aplicado"
  },

  en: {
    // Navigation (Header & Footer)
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.matahuasi": "Discover Matahuasi",
    "nav.contact": "Contact Us",
    "nav.products": "Products",
    "nav.buy": "Cart",
    "nav.menu": "Menu",
        "cart.view_products": "View products",
        "cuyexp.tag": "🐹 Interactive experience",
    "cuyexp.title": "Get to know our Guinea Pig",
    "cuyexp.desc": "More than a product, the guinea pig is part of the work and production of our members. Explore some features and discover a different fact each time.",
    "footer.title": "Agricultural Cooperative\nAgricultural Producers\nof Central Peru",
    "footer.brand1": "Cooperativa Agraria",
    "footer.brand2": "Productores Agropecuarios",
    "footer.brand3": "del Centro del Perú",
    "footer.copyright": "© 2026 Cooperativa Agraria Productores Agropecuarios del Centro del Perú",

    // Hero / Home
    "hero.subtitle": "Cooperativas Sais",
    "hero.title_part1": "Together for a",
    "hero.title_part2": "Stronger Countryside",
    "hero.description": "We are an agricultural cooperative of producers from Central Peru committed to quality, sustainability, and the development of our roots.",
    "hero.btn_learn_more": "Learn More",

    // Page: ABOUT US
    "about.title": "About Us",
    "about.breadcrumb_home": "Home",
    "about.breadcrumb_about": "About Us",
    "about.history_title": "Our History",
    "about.history_desc": "We are an agricultural cooperative formed by producers from Central Peru, established with the objective of improving the production, marketing, and quality of our products through organized and sustainable work.",
    "about.mission_title": "Mission",
    "about.mission_desc": "To promote the development of our members through sustainable, high-quality agricultural production, strengthening organized teamwork and community growth.",
    "about.vision_title": "Vision",
    "about.vision_desc": "To be a cooperative recognized for the high quality of our products and the positive impact on our local communities.",
    "about.values_title": "Our Values",
    "about.val_teamwork": "Teamwork",
    "about.val_commitment": "Commitment",
    "about.val_sustainability": "Sustainability",
    "about.val_quality": "Quality",

    // Page: PRODUCTS
    "prod.hero_tag": "Products from Our Producers",
    "prod.hero_title": "Our Products",
    "prod.hero_desc": "Learn about the products that embody our cooperative's hard work and discover their origins.",
    "prod.section_tag": "Our Production",
    "prod.section_title": "Products Representing Our Work",
    "prod.section_desc": "Explore our main products and discover the dedication behind each one of them.",
    "prod.cuy_tag": "Featured Product",
    "prod.cuy_title": "Guinea Pig (Cuy)",
    "prod.cuy_desc": "We raise and market high-quality guinea pigs, caring for every stage of the process to offer a healthy and nutritious product.",
    "prod.cuy_btn_know": "Discover Our Cuy ↓",
    "prod.cuy_btn_add": "Add to Cart",
    "prod.quinua_tag": "Agricultural Product",
    "prod.quinua_title": "Quinoa",
    "prod.quinua_desc": "We cultivate quinoa, a traditional crop with high nutritional value that is a vital part of our region's agricultural heritage.",
    "prod.quinua_btn_know": "Learn More ↗",
    "prod.feat_quality_title": "Quality",
    "prod.feat_quality_desc": "We carefully oversee every stage of our production process.",
    "prod.feat_resp_title": "Responsible Production",
    "prod.feat_resp_desc": "We value agricultural work and take pride in sustainable farming practices.",
    "prod.feat_partners_title": "Work of Our Partners",
    "prod.feat_partners_desc": "Every product represents the dedication and effort of our local farmers.",

    // Page: DISCOVER MATAHUASI
    "matahuasi.hero_title": "Matahuasi - Junin",
    "matahuasi.section_title": "MATAHUASI - JUNIN",
    "matahuasi.description": "Matahuasi is one of the fifteen districts of the Concepción province, located in the Junin region, in the heart of the Mantaro Valley. It stands out for its agricultural tradition, Andean landscapes, and cultural richness.",
    "matahuasi.places_title": "Discover the best tourist attractions in Matahuasi",
    "matahuasi.card_info": "Tourist Information",
    "matahuasi.card_maps": "View Matahuasi on Google Maps",
    "matahuasi.card_park": "Main Park",

    // Page: CONTACT US
    "contact.title": "Contact Us",
    "contact.subtitle": "We are located in Matahuasi, Concepción province, Junin.",
    "contact.personal_data": "Personal Information",
    "contact.personal_desc": "Fill in the basic information so we can get in touch with you.",
    "contact.lbl_name": "Full Name *",
    "contact.ph_name": "Your full name",
    "contact.lbl_email": "Email Address *",
    "contact.ph_email": "email@example.com",
    "contact.lbl_phone": "Phone Number",
    "contact.ph_phone": "Your phone number",
    "contact.btn_next": "Next",
    "contact.msg_title": "Message",
    "contact.msg_desc": "Tell us how we can help you.",
    "contact.lbl_subject": "Subject *",
    "contact.ph_subject": "Why are you reaching out to us?",
    "contact.lbl_message": "Message *",
    "contact.ph_message": "Write your message...",
    "contact.btn_back": "← Back",
    "contact.btn_send": "Send Message",
    "contact.success_title": "Message Sent!",
    "contact.success_desc": "Thank you for contacting us. We have received your message successfully.",
    "contact.btn_home": "Back to Home",
    "contact.select_subject": "Select an option",
    "contact.option_buy_cuy": "I want to buy guinea pigs",
    "contact.option_buy_quinua": "I want to buy quinoa",
    "contact.option_products_info": "I want information about the products",
    "contact.option_partner": "I want to become an associated producer",
    "contact.option_cooperative": "I want to learn more about the cooperative",
    "contact.option_question": "I have a question",
    "contact.option_other": "Other",

    // Page: CART / CHECKOUT
    "buy.hero_title": "Checkout",
    "buy.hero_desc": "Place your order easily.",
    "buy.step1": "Products",
    "buy.step2": "Shipping",
    "buy.step3": "Confirm",
    "buy.th_product": "Product",
    "buy.th_price": "Price",
    "buy.th_quantity": "Quantity",
    "buy.th_subtotal": "Subtotal",
    "buy.subtotal": "Subtotal",
    "buy.shipping": "Shipping",
    "buy.total": "TOTAL",
    "buy.btn_add_more": "+ Add products",
    "buy.btn_go_step2": "Continue to shipping →",
    "buy.ship_title": "Shipping Information",
    "buy.ship_subtitle": "Fill in your details to prepare your order.",
    "buy.lbl_fullname": "Full Name *",
    "buy.ph_fullname": "Full Name",
    "buy.lbl_email": "Email Address *",
    "buy.lbl_phone": "Phone Number *",
    "buy.lbl_address": "Address *",
    "buy.ph_address": "Delivery Address",
    "buy.lbl_district": "District *",
    "buy.lbl_city": "City / Province *",
    "buy.lbl_region": "State / Region *",
    "buy.select_option": "Select",
    "buy.lbl_delivery": "Delivery Method *",
    "buy.delivery_home": "Home Delivery",
    "buy.delivery_pickup": "Store Pickup",
    "buy.lbl_comment": "Comments",
    "buy.ph_comment": "Additional information...",
    "buy.btn_back_step1": "← Back",
    "buy.btn_continue": "Continue →",
    "buy.summary_title": "Order Summary",
    "buy.payment_title": "Payment Method",
    "buy.pay_bank": "Bank Transfer",
    "buy.pay_yape": "Yape / Plin",
    "buy.pay_cod": "Cash on Delivery",
    "buy.btn_confirm": "Confirm Order",
    "buy.btn_back_step2": "← Back to shipping details",
    "buy.success_title": "Order Confirmed!",
    "buy.btn_back_home": "Back to Home",

    // Global Search
    "search.placeholder": "Search pages and products...",
    "search.hint": "↑↓ to navigate | Enter to open | Esc to close",
    "search.empty": "No results found for",

    // Mini Cart
    "cart.title": "Your Cart",
    "cart.empty": "🛒\nYour cart is empty.",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Checkout",
    "cart.remove": "Remove",

    // Coupons
    "coupon.label": "Do you have a coupon?",
    "coupon.placeholder": "Ex. SAIS10",
    "coupon.apply": "Apply",
    "coupon.remove": "Remove",
    "coupon.discount": "Discount",
    "coupon.invalid": "Invalid coupon.",
    "coupon.removed": "Coupon removed.",
    "coupon.applied": "Coupon applied"
  }
};


/* ==========================================================
   IDIOMA ACTUAL
   ========================================================== */

let currentLang = localStorage.getItem("sais_lang") || "es";


/* ==========================================================
   FUNCIÓN DE TRADUCCIÓN
   ========================================================== */

function t(key) {
  return translations[currentLang]?.[key] || key;
}


/* ==========================================================
   CAMBIAR IDIOMA
   ========================================================== */

function setLanguage(lang) {
  if (!translations[lang]) return;

  currentLang = lang;

  localStorage.setItem("sais_lang", lang);

  document.documentElement.lang = lang;


  /* --------------------------------------------------------
     Actualizar textos con data-i18n
     -------------------------------------------------------- */

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");

    if (translations[lang][key]) {
      if (translations[lang][key].includes("\n")) {
        el.innerText = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });


  /* --------------------------------------------------------
     Actualizar placeholders
     -------------------------------------------------------- */

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");

    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });


    /* Traducir aria-label y title */

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");

    if (translations[lang][key]) {
      el.setAttribute("aria-label", translations[lang][key]);
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");

    if (translations[lang][key]) {
      el.setAttribute("title", translations[lang][key]);
    }
  });
  /* --------------------------------------------------------
     Actualizar botón de idioma
     
     Soporta:
     - id="lang-toggle-btn"  ← botón original
     - id="lang-toggle"      ← por si tu HTML actual usa este
     -------------------------------------------------------- */

  const langBtn =
    document.getElementById("lang-toggle-btn") ||
    document.getElementById("lang-toggle");

  if (langBtn) {
    langBtn.textContent = currentLang === "es" ? "EN" : "ES";
  }


  /* --------------------------------------------------------
     Evento global para otros scripts
     -------------------------------------------------------- */

  window.dispatchEvent(
    new CustomEvent("sais:lang-changed", {
      detail: {
        lang: lang
      }
    })
  );
}


/* ==========================================================
   INICIAR BOTÓN DE IDIOMA
   ========================================================== */

/* ==========================================================
   INICIAR SISTEMA DE IDIOMA
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------------
     CREAR BOTÓN DE IDIOMA SI NO EXISTE
     -------------------------------------------------------- */

  let langToggleBtn = document.getElementById("lang-toggle-btn");

  if (!langToggleBtn) {

    langToggleBtn = document.createElement("button");

    langToggleBtn.type = "button";
    langToggleBtn.id = "lang-toggle-btn";

    langToggleBtn.className =
      "w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition font-semibold text-sm";

    langToggleBtn.setAttribute(
      "aria-label",
      "Cambiar idioma"
    );

    /*
      Buscamos el carrito del header.
      El botón de idioma se colocará inmediatamente
      antes del carrito.
    */

    const cartLink = document.querySelector(
      'a[aria-label="Carrito de compras"]'
    );

    if (cartLink && cartLink.parentNode) {

      cartLink.parentNode.insertBefore(
        langToggleBtn,
        cartLink
      );

    } else {

      /*
        Si por alguna razón no encontramos el carrito,
        buscamos el header como alternativa.
      */

      const header = document.querySelector("header");

      if (header) {
        header.appendChild(langToggleBtn);
      }

    }
  }


  /* --------------------------------------------------------
     APLICAR IDIOMA GUARDADO
     -------------------------------------------------------- */

  setLanguage(currentLang);


  /* --------------------------------------------------------
     ACTIVAR BOTÓN DE IDIOMA
     -------------------------------------------------------- */

  /*
    Volvemos a buscarlo porque puede haber sido creado
    dinámicamente arriba.
  */

  langToggleBtn = document.getElementById("lang-toggle-btn");

  if (langToggleBtn) {

    /*
      Evitamos registrar el evento dos veces
      si el script se carga nuevamente.
    */

    if (!langToggleBtn.dataset.i18nReady) {

      langToggleBtn.dataset.i18nReady = "true";

      langToggleBtn.addEventListener("click", () => {

        const newLang =
          currentLang === "es"
            ? "en"
            : "es";

        setLanguage(newLang);

      });

    }
  }

});