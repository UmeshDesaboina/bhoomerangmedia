(function () {
    const body = document.body;
    const base = body.dataset.base || '';
    const currentPage = body.dataset.page || '';
    const homeHref = body.dataset.home || (base === '' ? '/' : base);

    const placeholder = document.getElementById('site-header-root');
    if (!placeholder) return;

    fetch(base + 'header.html')
        .then(r => r.text())
        .then(html => {
            const rendered = html
                .replace(/\{\{base\}\}/g, base)
                .replace(/\{\{home\}\}/g, homeHref);
            placeholder.outerHTML = rendered;
            initHeader();
        })
        .catch(err => console.error('Failed to load site header:', err));

    function initHeader() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const offcanvas = document.getElementById('offcanvas');
        const offcanvasOverlay = document.getElementById('offcanvas-overlay');
        const offcanvasClose = document.getElementById('offcanvas-close');

        function open() {
            offcanvas.classList.add('active');
            offcanvasOverlay.classList.add('active');
        }
        function close() {
            offcanvas.classList.remove('active');
            offcanvasOverlay.classList.remove('active');
        }

        hamburgerBtn.addEventListener('click', open);
        offcanvasClose.addEventListener('click', close);
        offcanvasOverlay.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const parent = toggle.closest('.has-dropdown');
                const isOpen = parent.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });
        });

        if (currentPage) {
            const link = document.querySelector('.offcanvas-nav a[data-page="' + currentPage + '"]');
            if (link) {
                link.setAttribute('aria-current', 'page');
                const dropdownParent = link.closest('.has-dropdown');
                if (dropdownParent) {
                    dropdownParent.classList.add('open');
                    const toggle = dropdownParent.querySelector('.nav-dropdown-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'true');
                }
            } else if (currentPage === 'services') {
                const dropdown = document.querySelector('.offcanvas-nav .has-dropdown');
                if (dropdown) {
                    dropdown.classList.add('open');
                    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'true');
                }
            }
        }

        window.BhoomerangHeader = { open, close };
        document.dispatchEvent(new CustomEvent('site-header:ready'));
    }
})();
