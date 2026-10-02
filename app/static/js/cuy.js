/* ==========================================================
 CUY.JS - Experiencia interactiva con Soporte Multidioma
 ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
 const factTitle = document.getElementById("cuy-fact-title");
 const factText = document.getElementById("cuy-fact-text");
 const factCategory = document.getElementById("cuy-fact-category");
 const factImage = document.getElementById("cuy-fact-image");
 const factCard = document.getElementById("cuy-fact-card");
 const randomButton = document.getElementById("cuy-random-button");
 const categoryButtons = document.querySelectorAll("[data-cuy-filter]");

 if (!factTitle || !factText || !factCategory || !factImage) {
 return;
 }

 // Mapeo de categorías para filtros y etiquetas
 const CATEGORY_NAMES = {
 es: { "Todos": "Todos", "Alimentación": "Alimentación", "Comportamiento": "Comportamiento", "Producción": "Producción" },
 en: { "Todos": "All", "Alimentación": "Feeding", "Comportamiento": "Behavior", "Producción": "Production" }
 };

 const facts = [
 {
 categoryKey: "Comportamiento",
 title: { es: "Son animales sociales", en: "They are social animals" },
 text: {
 es: "Los cuyes suelen sentirse más cómodos cuando tienen compañía y mantienen diferentes formas de comunicación entre ellos.",
 en: "Guinea pigs usually feel more comfortable with company and communicate with each other in various ways."
 },
 image: "/static/img/cuys.jpeg"
 },
 {
 categoryKey: "Comportamiento",
 title: { es: "También se comunican con sonidos", en: "They also communicate with sounds" },
 text: {
 es: "Los cuyes utilizan diferentes sonidos para expresar estados como emoción, alerta o incomodidad.",
 en: "Guinea pigs use different vocalizations to express emotions, alertness, or discomfort."
 },
 image: "/static/img/27.jpeg"
 },
 {
 categoryKey: "Alimentación",
 title: { es: "Necesitan vitamina C", en: "They need Vitamin C" },
 text: {
 es: "Al igual que los seres humanos, los cuyes necesitan obtener vitamina C a través de su alimentación.",
 en: "Just like humans, guinea pigs require vitamin C in their daily diet."
 },
 image: "/static/img/26.jpeg"
 },
 {
 categoryKey: "Alimentación",
 title: { es: "Son herbívoros", en: "They are herbivores" },
 text: {
 es: "Su alimentación está basada principalmente en vegetales, forraje y otros alimentos adecuados para su crianza.",
 en: "Their diet consists mainly of fresh vegetables, forage, and proper farm feed."
 },
 image: "/static/img/28.jpeg"
 },
 {
 categoryKey: "Producción",
 title: { es: "La alimentación es importante", en: "Proper feeding is crucial" },
 text: {
 es: "Una alimentación adecuada forma parte del cuidado necesario para mantener cuyes saludables durante su crianza.",
 en: "Balanced nutrition is essential for maintaining healthy guinea pigs throughout their breeding process."
 },
 image: "/static/img/26.jpeg"
 },
 {
 categoryKey: "Producción",
 title: { es: "El manejo influye en su crianza", en: "Care management affects breeding" },
 text: {
 es: "La limpieza, el espacio, la alimentación y el cuidado diario son aspectos importantes dentro de una crianza responsable.",
 en: "Cleanliness, space, diet, and daily care are key aspects of responsible livestock management."
 },
 image: "/static/img/28.jpeg"
 },
 {
 categoryKey: "Comportamiento",
 title: { es: "Sus dientes crecen continuamente", en: "Their teeth grow continuously" },
 text: {
 es: "Los dientes de los cuyes tienen crecimiento continuo, por lo que necesitan alimentos adecuados que les permitan desgastarlos.",
 en: "Guinea pigs' teeth grow continuously, requiring fibrous foods to naturally wear them down."
 },
 image: "/static/img/cuys.jpeg"
 },
 {
 categoryKey: "Producción",
 title: { es: "La crianza requiere cuidado constante", en: "Breeding requires constant care" },
 text: {
 es: "El trabajo diario permite mantener mejores condiciones para los animales y organizar adecuadamente el proceso de crianza.",
 en: "Daily attention ensures optimal living conditions and proper organization of the farm process."
 },
 image: "/static/img/29.jpeg"
 },
 {
 categoryKey: "Comportamiento",
 title: { es: "Pueden mostrar entusiasmo", en: "They express joy through 'popcorning'" },
 text: {
 es: "Cuando están emocionados, algunos cuyes realizan movimientos rápidos y pequeños saltos conocidos como 'popcorning'.",
 en: "When excited, guinea pigs make energetic rapid hops known as 'popcorning'."
 },
 image: "/static/img/cuys.jpeg"
 },
 {
 categoryKey: "Alimentación",
 title: { es: "El agua también es fundamental", en: "Fresh water is essential" },
 text: {
 es: "El acceso permanente a agua limpia es una parte básica del cuidado de los cuyes.",
 en: "Constant access to clean, fresh water is fundamental for guinea pig care."
 },
 image: "/static/img/26.jpeg"
 }
 ];

 let currentFilterKey = "Todos";
 let currentFact = null;

 function getLang() {
 return localStorage.getItem("sais_lang") || "es";
 }

 function getAvailableFacts() {
 if (currentFilterKey === "Todos") {
 return facts;
 }
 return facts.filter(fact => fact.categoryKey === currentFilterKey);
 }

 function getRandomFact() {
 const available = getAvailableFacts();
 if (!available.length) return null;
 const randomIndex = Math.floor(Math.random() * available.length);
 return available[randomIndex];
 }

 function showFact(fact) {
 if (!fact) return;
 currentFact = fact;
 const lang = getLang();

 factTitle.textContent = fact.title[lang] || fact.title.es;
 factText.textContent = fact.text[lang] || fact.text.es;
 factCategory.textContent = CATEGORY_NAMES[lang][fact.categoryKey] || fact.categoryKey;
 factImage.src = fact.image;
 factImage.alt = factTitle.textContent;

 if (factCard) {
 factCard.classList.remove("cuy-fact-change");
 void factCard.offsetWidth;
 factCard.classList.add("cuy-fact-change");
 }
 }

 function updateFilterButtonsText() {
 const lang = getLang();
 categoryButtons.forEach((btn) => {
 const filterKey = btn.dataset.cuyFilter || "Todos";
 if (CATEGORY_NAMES[lang] && CATEGORY_NAMES[lang][filterKey]) {
 btn.textContent = CATEGORY_NAMES[lang][filterKey];
 }
 });

 if (randomButton) {
 randomButton.textContent = lang === "en" ? "💡 Another fact" : "💡 Otro dato";
 }
 }

 function showRandomFact() {
 const fact = getRandomFact();
 showFact(fact);
 }

 // Eventos de los botones de filtro
 categoryButtons.forEach((button) => {
 button.addEventListener("click", () => {
 categoryButtons.forEach((item) => item.classList.remove("active"));
 button.classList.add("active");
 currentFilterKey = button.dataset.cuyFilter || "Todos";
 showRandomFact();
 });
 });

 if (randomButton) {
 randomButton.addEventListener("click", showRandomFact);
 }

 // Escuchar el cambio de idioma
 window.addEventListener("sais:lang-changed", () => {
 updateFilterButtonsText();
 if (currentFact) {
 showFact(currentFact);
 }
 });

 // Inicialización
 updateFilterButtonsText();
 showRandomFact();
});