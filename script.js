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

// E-Mail-Adresse erst zur Laufzeit zusammensetzen - kein Klartext im Quelltext.
// Deckt beide auf der Seite vorkommenden IDs ab (contact.html: 'email-link',
// new-updates.html: 'reg-mail'); Seiten ohne passendes Element werden übersprungen.
(function () {
    ['email-link', 'reg-mail'].forEach(function (id) {
        var a = document.getElementById(id);
        if (!a) return;
        var addr = 'matildecanepagonzalez' + '@' + 'gmail.com';
        a.href = 'mailto:' + addr;
        a.textContent = addr;
    });
})();
