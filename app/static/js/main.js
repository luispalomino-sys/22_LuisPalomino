document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       MENÚ RESPONSIVE
    ====================================================== */

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {

        toggle.addEventListener("click", () => {

            nav.classList.toggle("nav-open");

        });

    }


    /* =====================================================
       SLIDER DEL HERO
    ====================================================== */

    const slides = document.querySelectorAll(".hero-slider .slide");
    const dots = document.querySelectorAll(".slider-dot");

    if (slides.length > 0) {

        let currentSlide = 0;
        let sliderInterval;


        /* -----------------------------------------------
           CAMBIAR DE IMAGEN
        ------------------------------------------------ */

        function showSlide(index) {

            slides.forEach((slide) => {
                slide.classList.remove("active");
            });

            dots.forEach((dot) => {
                dot.classList.remove("active");
            });


            slides[index].classList.add("active");

            if (dots[index]) {
                dots[index].classList.add("active");
            }

            currentSlide = index;
        }


        /* -----------------------------------------------
           SIGUIENTE IMAGEN
        ------------------------------------------------ */

        function nextSlide() {

            let next = currentSlide + 1;

            if (next >= slides.length) {
                next = 0;
            }

            showSlide(next);
        }


        /* -----------------------------------------------
           CAMBIO AUTOMÁTICO
        ------------------------------------------------ */

        function startSlider() {

            sliderInterval = setInterval(() => {

                nextSlide();

            }, 5000);

        }


        /* -----------------------------------------------
           BOTONES / PUNTOS
        ------------------------------------------------ */

        dots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                showSlide(index);

                clearInterval(sliderInterval);

                startSlider();

            });

        });


        /* -----------------------------------------------
           INICIAR SLIDER
        ------------------------------------------------ */

        showSlide(0);

        startSlider();

    }

});