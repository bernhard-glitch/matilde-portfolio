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

    // aria-expanded teilt Screenreadern mit, ob das Menü gerade offen ist.
    // Bewusst hier gesetzt statt in elf HTML-Dateien einzeln.
    hamburger.setAttribute('aria-expanded', 'false');

    function setExpanded(isOpen) {
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function toggleMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        setExpanded(nav.classList.contains('active'));
    }

    hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('click', function (e) {
        if (nav.classList.contains('active') &&
            !hamburger.contains(e.target) &&
            !nav.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            setExpanded(false);
        }
    });
})();

// E-Mail-Adresse erst zur Laufzeit zusammensetzen - kein Klartext im Quelltext.
// Deckt beide vorkommenden IDs ab (contact.html: 'email-link',
// studio-journal.html: 'reg-mail'); Seiten ohne passendes Element werden übersprungen.
(function () {
    ['email-link', 'reg-mail'].forEach(function (id) {
        var a = document.getElementById(id);
        if (!a) return;
        var addr = 'matildecanepagonzalez' + '@' + 'gmail.com';
        a.href = 'mailto:' + addr;
        a.textContent = addr;
    });
})();
