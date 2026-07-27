// lightbox.js — gemeinsame Lightbox-Logik für Paintings, Sculptures und Cyanotype
// Die Kategorie-Bezeichnung (für die Betreffzeile im Kontaktformular) wird pro Seite
// über data-category="..." am #lbOverlay-Element festgelegt.
(function () {
    const overlay = document.getElementById('lbOverlay');
    if (!overlay) return;

    const img = document.getElementById('lbImg');
    const imgAltFallback = img.alt;
    const counter = document.getElementById('lbCounter');
    const infoEl = document.getElementById('lbInfo');
    const cta = document.getElementById('lbCta');
    const closeBtn = overlay.querySelector('.lb-close');
    const prevBtn = overlay.querySelector('.lb-arrow.lb-prev');
    const nextBtn = overlay.querySelector('.lb-arrow.lb-next');
    const wrappers = Array.from(document.querySelectorAll('.image-wrapper[data-lb]'));
    const category = overlay.dataset.category || '';
    let current = 0;

    // Bilder registrieren (Maus/Touch per Klick, Tastatur per Enter/Leertaste)
    wrappers.forEach(function (el, i) {
        el.addEventListener('click', function () { lbOpen(i); });
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault(); // verhindert Scrollen der Seite bei Leertaste
                lbOpen(i);
            }
        });
    });

    function lbOpen(i) {
        current = i;
        lbShow();
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function lbCloseNow() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function lbClose(e) {
        if (e.target.closest('.lb-close, .lb-arrow, .lb-cta')) return;
        if (e.target === overlay || e.target === img) {
            lbCloseNow();
            return;
        }
        const r = img.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right &&
            e.clientY >= r.top && e.clientY <= r.bottom) {
            lbCloseNow();
        }
    }
    overlay.addEventListener('click', lbClose, true);

    function lbNav(dir, e) {
        if (e) e.stopPropagation();
        current = (current + dir + wrappers.length) % wrappers.length;
        img.classList.add('fade');
        setTimeout(function () {
            lbShow();
            img.classList.remove('fade');
        }, 220);
    }

    function lbShow() {
        const el = wrappers[current];
        const image = el.querySelector('img');
        img.src = image.src;
        img.alt = image.alt || imgAltFallback;
        counter.textContent = (current + 1) + ' / ' + wrappers.length;

        // Werk-Info links unten befüllen
        const infoSrc = el.nextElementSibling && el.nextElementSibling.classList.contains('image-info')
            ? el.nextElementSibling
            : el.closest('.grid-item') && el.closest('.grid-item').querySelector('.image-info');
        if (infoEl && infoSrc) {
            infoEl.innerHTML = infoSrc.innerHTML;
        } else if (infoEl) {
            infoEl.innerHTML = '';
        }

        // Dynamische aria-labels für Screenreader
        const prevIdx = (current - 1 + wrappers.length) % wrappers.length;
        const nextIdx = (current + 1) % wrappers.length;
        const prevTitle = wrappers[prevIdx].querySelector('img').getAttribute('title') || 'Previous';
        const nextTitle = wrappers[nextIdx].querySelector('img').getAttribute('title') || 'Next';
        if (prevBtn) prevBtn.setAttribute('aria-label', 'Previous: ' + prevTitle.trim());
        if (nextBtn) nextBtn.setAttribute('aria-label', 'Next: ' + nextTitle.trim());

        // Bildtitel als URL-Parameter an contact.html übergeben
        const title = image.getAttribute('title') || '';
        if (cta && title) {
            const label = category ? category + ' - ' + title.trim() : title.trim();
            cta.href = 'contact.html?artwork=' + encodeURIComponent(label);
        }
    }

    // Buttons: Close / Prev / Next / CTA (ersetzt die frühere onclick-Bindung)
    if (closeBtn) closeBtn.addEventListener('click', lbCloseNow);
    if (prevBtn) prevBtn.addEventListener('click', function (e) { lbNav(-1, e); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { lbNav(1, e); });
    if (cta) cta.addEventListener('click', function (e) { e.stopPropagation(); });

    // Touch-Swipe
    (function () {
        let startX = 0;
        let startY = 0;
        overlay.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        overlay.addEventListener('touchend', function (e) {
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                lbNav(dx < 0 ? 1 : -1);
            }
        }, { passive: true });
    })();

    // Tastatur-Navigation
    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('is-open')) return;
        if (e.key === 'ArrowRight') lbNav(1);
        if (e.key === 'ArrowLeft') lbNav(-1);
        if (e.key === 'Escape') lbCloseNow();
    });
})();
