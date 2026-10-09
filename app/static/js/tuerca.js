document.addEventListener('DOMContentLoaded', () => {
    const btnTuerca = document.getElementById('btn-tuerca');
    const menuTuerca = document.getElementById('menu-tuerca');
    const btnAMenos = document.getElementById('btn-a-menos');
    const btnANormal = document.getElementById('btn-a-normal');
    const btnAMas = document.getElementById('btn-a-mas');
    const checkContraste = document.getElementById('check-contraste');

    if (btnTuerca && menuTuerca) {
        btnTuerca.addEventListener('click', (e) => {
            e.stopPropagation();
            menuTuerca.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!menuTuerca.contains(e.target) && !btnTuerca.contains(e.target)) {
                menuTuerca.classList.add('hidden');
            }
        });
    }

    let fontSize = parseFloat(localStorage.getItem('user-font-size')) || 16;
    document.documentElement.style.fontSize = `${fontSize}px`;

    if (btnAMenos) {
        btnAMenos.addEventListener('click', () => {
            if (fontSize > 12) fontSize -= 1.5;
            document.documentElement.style.fontSize = `${fontSize}px`;
            localStorage.setItem('user-font-size', fontSize);
        });
    }

    if (btnANormal) {
        btnANormal.addEventListener('click', () => {
            fontSize = 16;
            document.documentElement.style.fontSize = `${fontSize}px`;
            localStorage.setItem('user-font-size', fontSize);
        });
    }

    if (btnAMas) {
        btnAMas.addEventListener('click', () => {
            if (fontSize < 22) fontSize += 1.5;
            document.documentElement.style.fontSize = `${fontSize}px`;
            localStorage.setItem('user-font-size', fontSize);
        });
    }

    if (localStorage.getItem('modoContraste') === 'activado') {
        document.body.classList.add('alto-contraste');
        if (checkContraste) checkContraste.checked = true;
    }

    if (checkContraste) {
        checkContraste.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('alto-contraste');
                localStorage.setItem('modoContraste', 'activado');
            } else {
                document.body.classList.remove('alto-contraste');
                localStorage.setItem('modoContraste', 'desactivado');
            }
        });
    }
});