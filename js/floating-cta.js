(function () {
    const callHref = 'tel:+918096562345';
    const whatsappHref = 'https://wa.me/8096562345?text=Hi%20Bhoomerang%20Media!%20I%E2%80%99m%20interested%20in%20growing%20my%20brand.%20Can%20we%20chat%20about%20a%20free%20consultation%20for%20my%20business?';

    // Office locations shown when the red location button is clicked
    const locations = [
        { name: 'Hyderabad', url: 'https://share.google/QcoJh7stgOiKzgDYP' },
        { name: 'Vizag (Visakhapatnam)', url: 'https://maps.app.goo.gl/gieJBo4sW1S1uY9j7' }
    ];
    const locationHref = locations[0].url; // fallback only

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
                font-family: 'Poppins', sans-serif;
            }
            .loc-chooser-panel h3 { color: #fff; font-size: 1.3rem; font-weight: 600; margin: 0 0 6px; }
            .loc-chooser-panel p { color: rgba(224,224,224,0.75); font-size: 0.9rem; margin: 0 0 20px; }
            .loc-chooser-panel a.loc-option {
                display: flex; align-items: center; justify-content: center; gap: 10px;
                padding: 13px 16px; margin-bottom: 12px; border-radius: 50px; text-decoration: none;
                background: rgba(255,138,0,0.1); border: 1px solid rgba(255,138,0,0.35);
                color: #fff; font-weight: 500; transition: background 0.25s ease, color 0.25s ease;
            }
            .loc-chooser-panel a.loc-option:last-child { margin-bottom: 0; }
            .loc-chooser-panel a.loc-option i { color: #ff8a00; transition: color 0.25s ease; }
            .loc-chooser-panel a.loc-option:hover { background: #ff8a00; color: #000; }
            .loc-chooser-panel a.loc-option:hover i { color: #000; }
            .loc-chooser-close {
                position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; border-radius: 50%;
                background: rgba(255,138,0,0.1); border: 1px solid rgba(255,138,0,0.3);
                color: #ff8a00; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
            }
            .loc-chooser-close:hover { background: #ff8a00; color: #000; }
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
                '<h3>Choose Your Location</h3>' +
                '<p>Select an office to open it in Google Maps.</p>' +
                locations.map(function (l) {
                    return '<a class="loc-option" href="' + l.url + '" target="_blank" rel="noopener">' +
                           '<i class="fa-solid fa-location-dot" aria-hidden="true"></i> ' + l.name + '</a>';
                }).join('') +
            '</div>';
        document.body.appendChild(chooser);

        const open = function () { chooser.classList.add('open'); chooser.setAttribute('aria-hidden', 'false'); };
        const close = function () { chooser.classList.remove('open'); chooser.setAttribute('aria-hidden', 'true'); };

        chooser.querySelector('.loc-chooser-backdrop').addEventListener('click', close);
        chooser.querySelector('.loc-chooser-close').addEventListener('click', close);
        chooser.querySelectorAll('.loc-option').forEach(function (a) { a.addEventListener('click', close); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && chooser.classList.contains('open')) close();
        });

        return { open: open, close: close };
    }

    function inject() {
        if (document.querySelector('.call-float') || document.querySelector('.whatsapp-float')) return;

        injectStyles();
        const chooser = buildChooser();

        const mapLink = document.createElement('a');
        mapLink.href = locationHref;
        mapLink.className = 'location-float';
        mapLink.target = '_blank';
        mapLink.rel = 'noopener';
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
        waLink.rel = 'noopener';
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