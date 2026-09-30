/* ==========================================================
   CUY.JS
   Experiencia interactiva del Cuy
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

    const facts = [
        {
            category: "Comportamiento",
            title: "Son animales sociales",
            text: "Los cuyes suelen sentirse más cómodos cuando tienen compañía y mantienen diferentes formas de comunicación entre ellos.",
            image: "/static/img/cuys.jpeg"
        },
        {
            category: "Comportamiento",
            title: "También se comunican con sonidos",
            text: "Los cuyes utilizan diferentes sonidos para expresar estados como emoción, alerta o incomodidad.",
            image: "/static/img/27.jpeg"
        },
        {
            category: "Alimentación",
            title: "Necesitan vitamina C",
            text: "Al igual que los seres humanos, los cuyes necesitan obtener vitamina C a través de su alimentación.",
            image: "/static/img/26.jpeg"
        },
        {
            category: "Alimentación",
            title: "Son herbívoros",
            text: "Su alimentación está basada principalmente en vegetales, forraje y otros alimentos adecuados para su crianza.",
            image: "/static/img/28.jpeg"
        },
        {
            category: "Producción",
            title: "La alimentación es importante",
            text: "Una alimentación adecuada forma parte del cuidado necesario para mantener cuyes saludables durante su crianza.",
            image: "/static/img/26.jpeg"
        },
        {
            category: "Producción",
            title: "El manejo influye en su crianza",
            text: "La limpieza, el espacio, la alimentación y el cuidado diario son aspectos importantes dentro de una crianza responsable.",
            image: "/static/img/28.jpeg"
        },
        {
            category: "Comportamiento",
            title: "Sus dientes crecen continuamente",
            text: "Los dientes de los cuyes tienen crecimiento continuo, por lo que necesitan alimentos adecuados que les permitan desgastarlos.",
            image: "/static/img/cuys.jpeg"
        },
        {
            category: "Producción",
            title: "La crianza requiere cuidado constante",
            text: "El trabajo diario permite mantener mejores condiciones para los animales y organizar adecuadamente el proceso de crianza.",
            image: "/static/img/29.jpeg"
        },
        {
            category: "Comportamiento",
            title: "Pueden mostrar entusiasmo",
            text: "Cuando están emocionados, algunos cuyes realizan movimientos rápidos y pequeños saltos conocidos como 'popcorning'.",
            image: "/static/img/cuys.jpeg"
        },
        {
            category: "Alimentación",
            title: "El agua también es fundamental",
            text: "El acceso permanente a agua limpia es una parte básica del cuidado de los cuyes.",
            image: "/static/img/26.jpeg"
        }
    ];

    let currentFilter = "Todos";
    let lastIndex = -1;

    function getAvailableFacts() {

        if (currentFilter === "Todos") {
            return facts;
        }

        return facts.filter(
            fact => fact.category === currentFilter
        );
    }

    function getRandomFact() {

        const availableFacts = getAvailableFacts();

        if (!availableFacts.length) {
            return;
        }

        let randomIndex;

        if (availableFacts.length === 1) {
            randomIndex = 0;
        } else {
            do {
                randomIndex = Math.floor(
                    Math.random() * availableFacts.length
                );
            } while (
                availableFacts[randomIndex] === lastIndex
            );
        }

        lastIndex = availableFacts[randomIndex];

        return availableFacts[randomIndex];
    }

    function showFact(fact) {

        if (!fact) {
            return;
        }

        factTitle.textContent = fact.title;
        factText.textContent = fact.text;
        factCategory.textContent = fact.category;
        factImage.src = fact.image;

        factImage.alt = fact.title;

        if (factCard) {

            factCard.classList.remove("cuy-fact-change");

            void factCard.offsetWidth;

            factCard.classList.add("cuy-fact-change");
        }
    }

    function showRandomFact() {

        const fact = getRandomFact();

        showFact(fact);
    }

    categoryButtons.forEach((button) => {

        button.addEventListener("click", () => {

            categoryButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.cuyFilter || "Todos";

            lastIndex = -1;

            showRandomFact();
        });

    });

    if (randomButton) {

        randomButton.addEventListener(
            "click",
            showRandomFact
        );

    }

    /*
     * Primer dato al cargar la página.
     */

    showRandomFact();

});