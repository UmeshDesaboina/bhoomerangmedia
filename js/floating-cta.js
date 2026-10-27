(function () {
    const callHref = 'tel:+918096562345';
    const whatsappHref = 'https://wa.me/8096562345?text=Hi%20Bhoomerang%20Media!%20I%E2%80%99m%20interested%20in%20growing%20my%20brand.%20Can%20we%20chat%20about%20a%20free%20consultation%20for%20my%20business?';

    // Office locations.
    // embed     -> map shown inside the site (works on laptop + mobile)
    // url       -> full Google Maps URL for the "Open in Google Maps" button
    //              (full URLs work everywhere; short links like maps.app.goo.gl can error on desktop)
    // shortUrl  -> your short share link, kept for reference / fallback only
    const locations = [
        {
            key: 'hyderabad',
            name: 'Hyderabad (ESI)',
            address: 'Pillar No 987, Bhanu Enclave, Flat No 312, 3rd Floor, beside ESI Hospital Metro Station, Erragadda, Hyderabad 500038',
            url: 'https://www.google.com/maps/search/?api=1&query=BHOOMerang+Media+Digital+Marketing+Agency+Erragadda+Hyderabad',
            shortUrl: 'https://share.google/SWxeFyVSp04drmFPW',
            embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4123.403841495322!2d78.4328835824239!3d17.449232440771752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910db67dd679%3A0x461f4496542952b!2sBHOOMerang%20Media%20-%20Digital%20Marketing%20Agency!5e1!3m2!1sen!2sin!4v1793128915890!5m2!1sen!2sin'
        },
        {
            key: 'vizag',
            name: 'Vizag (Visakhapatnam)',
            address: 'Flat 202, KDP Pvt Ltd, Plot 91, Road Number 3A, Daspalla Hills, Pandurangapuram, Visakhapatnam 530002',
            url: 'https://www.google.com/maps/search/?api=1&query=BHOOMerang+Media+Digital+Marketing+and+Advertising+Agency+Visakhapatnam',
            shortUrl: 'https://maps.app.goo.gl/bZa8c3xZWJexDsXN6',
            embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4117.324677373457!2d83.31217407550967!3d17.715997383228327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943fe87cdbd6f%3A0xa8b1f1eb9ca00190!2sBHOOMerang%20Media%20-%20Digital%20Marketing%20and%20Advertising%20Agency!5e1!3m2!1sen!2sin!4v1793128393855!5m2!1sen!2sin'
        }
    ];

    function injectStyles() {
        if (document.getElementById('loc-chooser-styles')) return;
        const style = document.createElement('style');
        style.id = 'loc-chooser-styles';
        style.textContent = `
            .loc-chooser { position: fixed; inset: 0; z-index: 10000; display: none; align-items: center; justify-content: center; padding: 20px; }
            .loc-chooser.open { display: flex; }
            .loc-chooser-backdrop { position: absolute; inset: 0; background: rgba(5,5,5,0.85); cursor: pointer; }
            .loc-chooser-panel {
                position: relative; width: 100%; max-width: 380px; text-align: center;
                background: #0e0a06; border: 1px solid rgba(255,138,0,0.3); border-radius: 20px;
                padding: 30px 26px 26px; box-shadow: 0 30px 80px rgba(0,0,0,0.6);
                font-family: 'Poppins', sans-serif; max-height: 92vh; overflow-y: auto;
            }
            .loc-chooser-panel.is-map { max-width: 760px; }
            .loc-chooser-panel h3 { color: #fff; font-size: 1.3rem; font-weight: 600; margin: 0 0 6px; }
            .loc-chooser-panel p { color: rgba(224,224,224,0.75); font-size: 0.9rem; margin: 0 0 20px; }
            .loc-chooser-panel .loc-option {
                display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%;
                padding: 13px 16px; margin-bottom: 12px; border-radius: 50px; text-decoration: none;
                background: rgba(255,138,0,0.1); border: 1px solid rgba(255,138,0,0.35);
                color: #fff; font-weight: 500; font-family: inherit; font-size: 1rem; cursor: pointer;
                transition: background 0.25s ease, color 0.25s ease;
            }
            .loc-chooser-panel .loc-option:last-child { margin-bottom: 0; }
            .loc-chooser-panel .loc-option i { color: #ff8a00; transition: color 0.25s ease; }
            .loc-chooser-panel .loc-option:hover { background: #ff8a00; color: #000; }
            .loc-chooser-panel .loc-option:hover i { color: #000; }
            .loc-chooser-close {
                position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; border-radius: 50%;
                background: rgba(255,138,0,0.1); border: 1px solid rgba(255,138,0,0.3);
                color: #ff8a00; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; z-index: 2;
            }
            .loc-chooser-close:hover { background: #ff8a00; color: #000; }

            .loc-view-list, .loc-view-map { display: none; }
            .loc-chooser-panel:not(.is-map) .loc-view-list { display: block; }
            .loc-chooser-panel.is-map .loc-view-map { display: block; }

            .loc-map-frame {
                width: 100%; height: 420px; border: 0; border-radius: 14px;
                background: #1a1209; margin-bottom: 16px;
            }
            .loc-map-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
            .loc-map-actions .loc-option { width: auto; margin: 0; padding: 11px 22px; font-size: 0.92rem; }
            .loc-map-address { margin: 0 0 14px !important; }
            @media (max-width: 600px) {
                .loc-map-frame { height: 300px; }
                .loc-chooser-panel { padding: 26px 16px 20px; }
            }
        `;
        document.head.appendChild(style);
    }

    function buildChooser() {
        const chooser = document.createElement('div');
        chooser.className = 'loc-chooser';
        chooser.setAttribute('role', 'dialog');
        chooser.setAttribute('aria-modal', 'true');
        chooser.setAttribute('aria-label', 'Choose office location');
        chooser.setAttribute('aria-hidden', 'true');
        chooser.innerHTML =
            '<div class="loc-chooser-backdrop"></div>' +
            '<div class="loc-chooser-panel">' +
                '<button type="button" class="loc-chooser-close" aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +

                // View 1: list of offices
                '<div class="loc-view-list">' +
                    '<h3>Choose Your Location</h3>' +
                    '<p>Select an office to view it on the map.</p>' +
                    locations.map(function (l) {
                        return '<button type="button" class="loc-option" data-key="' + l.key + '">' +
                               '<i class="fa-solid fa-location-dot" aria-hidden="true"></i> ' + l.name + '</button>';
                    }).join('') +
                '</div>' +

                // View 2: embedded map
                '<div class="loc-view-map">' +
                    '<h3 class="loc-map-title"></h3>' +
                    '<p class="loc-map-address"></p>' +
                    '<iframe class="loc-map-frame" title="Office location map" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
                    '<div class="loc-map-actions">' +
                        '<button type="button" class="loc-option loc-back"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> All Offices</button>' +
                        '<a class="loc-option loc-open-maps" href="#" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-diamond-turn-right" aria-hidden="true"></i> Open in Google Maps</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
        document.body.appendChild(chooser);

        const panel   = chooser.querySelector('.loc-chooser-panel');
        const frame   = chooser.querySelector('.loc-map-frame');
        const title   = chooser.querySelector('.loc-map-title');
        const addr    = chooser.querySelector('.loc-map-address');
        const openBtn = chooser.querySelector('.loc-open-maps');

        function showList() {
            panel.classList.remove('is-map');
            frame.src = 'about:blank';
        }

        function showMap(key) {
            const loc = locations.find(function (l) { return l.key === key; });
            if (!loc) return;
            title.textContent = loc.name + ' Office';
            addr.textContent = loc.address;
            frame.src = loc.embed;
            openBtn.href = loc.url;
            panel.classList.add('is-map');
        }

        function open(key) {
            if (key) showMap(key); else showList();
            chooser.classList.add('open');
            chooser.setAttribute('aria-hidden', 'false');
            document.body.classList.add('logo-modal-open'); // blocks slide-wheel navigation on home page
        }

        function close() {
            chooser.classList.remove('open');
            chooser.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('logo-modal-open');
            frame.src = 'about:blank';
        }

        chooser.querySelector('.loc-chooser-backdrop').addEventListener('click', close);
        chooser.querySelector('.loc-chooser-close').addEventListener('click', close);
        chooser.querySelector('.loc-back').addEventListener('click', showList);
        chooser.querySelectorAll('.loc-view-list .loc-option').forEach(function (b) {
            b.addEventListener('click', function () { showMap(b.getAttribute('data-key')); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && chooser.classList.contains('open')) close();
        });

        return { open: open, close: close };
    }

    function inject() {
        if (document.querySelector('.call-float') || document.querySelector('.whatsapp-float')) return;

        injectStyles();
        const chooser = buildChooser();

        // Expose so other parts of the site can open a map directly:
        // BhoomerangMap.open('vizag') or BhoomerangMap.open('hyderabad')
        window.BhoomerangMap = { open: chooser.open, close: chooser.close };

        // Any link with data-map-key="vizag" / "hyderabad" opens the in-page map.
        // Ctrl/Cmd/Shift/middle-click still opens the normal href in a new tab.
        document.addEventListener('click', function (e) {
            const link = e.target.closest('[data-map-key]');
            if (!link) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
            e.preventDefault();
            chooser.open(link.getAttribute('data-map-key'));
        });

        const mapLink = document.createElement('a');
        mapLink.href = locations[0].url; // fallback only
        mapLink.className = 'location-float';
        mapLink.target = '_blank';
        mapLink.rel = 'noopener noreferrer';
        mapLink.setAttribute('aria-label', 'Choose Bhoomerang Media office location (Hyderabad or Vizag)');
        mapLink.setAttribute('aria-haspopup', 'dialog');
        mapLink.title = 'View Location';
        mapLink.innerHTML = '<i class="fa-solid fa-location-dot" aria-hidden="true"></i>';
        mapLink.addEventListener('click', function (e) {
            e.preventDefault();
            chooser.open();
        });

        const callLink = document.createElement('a');
        callLink.href = callHref;
        callLink.className = 'call-float';
        callLink.setAttribute('aria-label', 'Call Bhoomerang Media');
        callLink.title = 'Call Now';
        callLink.innerHTML = '<i class="fa-solid fa-phone" aria-hidden="true"></i>';

        const waLink = document.createElement('a');
        waLink.href = whatsappHref;
        waLink.className = 'whatsapp-float';
        waLink.target = '_blank';
        waLink.rel = 'noopener noreferrer';
        waLink.setAttribute('aria-label', 'Chat with Bhoomerang Media on WhatsApp');
        waLink.title = 'Chat on WhatsApp';
        waLink.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';

        document.body.appendChild(mapLink);
        document.body.appendChild(callLink);
        document.body.appendChild(waLink);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
