// script.js — zentrale Navigations-Logik (Hamburger-Menü + Footer-Jahr)
// Wird auf allen Seiten per <script src="script.js" defer></script> eingebunden.
(function () {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('header nav');

    if (!hamburger || !nav) return;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('click', function (e) {
        if (nav.classList.contains('active') &&
            !hamburger.contains(e.target) &&
            !nav.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
})();
