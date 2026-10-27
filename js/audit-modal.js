/* =====================================================================
   Free Audit modal — shared across every page.
   - On pages that already ship their own #audit-modal (e.g. index.html),
     this script leaves the markup/handlers alone and only adds the
     "auto-open on 50% scroll" behaviour.
   - On every other page it injects the modal markup + styles + handlers.
   Auto-opens once per page load when the visitor scrolls past the
   halfway point of the document.
   ===================================================================== */
(function () {
    if (window.__auditModalLoaded) return;
    window.__auditModalLoaded = true;

    var STYLE_ID = 'audit-modal-styles';

    var CSS = '\
.audit-modal{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .25s ease;}\
.audit-modal.is-visible{display:flex;}\
.audit-modal.is-open{opacity:1;}\
.audit-modal-backdrop{position:absolute;inset:0;background:rgba(5,5,5,.88);cursor:pointer;}\
.audit-modal-panel{position:relative;width:100%;max-width:720px;max-height:90vh;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;background:#0e0a06;border:1px solid rgba(255,138,0,.3);border-radius:22px;padding:36px 36px 30px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(255,138,0,.08);transform:translateY(12px) scale(.98);transition:transform .3s cubic-bezier(.22,1,.36,1);}\
.audit-modal.is-open .audit-modal-panel{transform:translateY(0) scale(1);}\
.audit-modal-close{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;background:rgba(255,138,0,.1);border:1px solid rgba(255,138,0,.3);color:var(--orange-accent,#ff8a00);font-size:1rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background .25s ease,transform .25s ease;}\
.audit-modal-close:hover{background:var(--orange-accent,#ff8a00);color:#000;transform:rotate(90deg);}\
.audit-modal-header{text-align:center;margin-bottom:22px;}\
.audit-modal-header .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(255,138,0,.12);border:1px solid rgba(255,138,0,.35);border-radius:50px;font-size:.85rem;color:var(--orange-accent,#ff8a00);font-weight:500;margin-bottom:14px;letter-spacing:.04em;text-transform:uppercase;}\
.audit-modal-header .hero-badge i{font-size:.55rem;}\
.audit-modal-header h3{font-size:1.85rem;font-weight:600;color:var(--text-white,#fff);margin-bottom:8px;line-height:1.2;}\
.audit-modal-header p{color:var(--text-muted,#e0e0e0);font-size:.95rem;line-height:1.55;max-width:520px;margin:0 auto;}\
body.audit-modal-open{overflow:hidden;}\
.audit-modal .contact-form{max-width:700px;margin:0 auto;display:grid;gap:16px;}\
.audit-modal .contact-form .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}\
.audit-modal .contact-form label{display:block;font-size:.88rem;font-weight:500;color:var(--text-muted,#e0e0e0);margin-bottom:6px;letter-spacing:.02em;}\
.audit-modal .contact-form input,.audit-modal .contact-form select,.audit-modal .contact-form textarea{width:100%;padding:12px 14px;background:var(--dark-card,rgba(255,255,255,.03));border:1px solid rgba(255,138,0,.2);border-radius:10px;color:var(--text-white,#fff);font-family:"Poppins",sans-serif;font-size:.95rem;transition:border-color .25s ease,box-shadow .25s ease,background .25s ease;}\
.audit-modal .contact-form input:focus,.audit-modal .contact-form select:focus,.audit-modal .contact-form textarea:focus{outline:none;border-color:var(--orange-accent,#ff8a00);background-color:rgba(255,138,0,.04);box-shadow:0 0 0 4px rgba(255,138,0,.12);}\
.audit-modal .contact-form input::placeholder,.audit-modal .contact-form textarea::placeholder{color:rgba(224,224,224,.4);}\
.audit-modal .contact-form select{appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ff8a00\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'/></svg>");background-repeat:no-repeat;background-position:right 16px center;background-size:14px 14px;padding-right:44px;cursor:pointer;}\
.audit-modal .contact-form select option{background-color:#1a0f08;color:var(--text-white,#fff);}\
.audit-modal .contact-form textarea{resize:vertical;min-height:110px;}\
.audit-modal .contact-form .submit-row{margin-top:6px;text-align:center;}\
.audit-modal .contact-form .btn{display:inline-flex;align-items:center;gap:10px;background-color:var(--orange-accent,#ff8a00);color:#000;font-weight:600;font-size:1.05rem;padding:14px 34px;border-radius:50px;border:none;cursor:pointer;font-family:"Poppins",sans-serif;box-shadow:0 4px 15px rgba(255,138,0,.3);transition:transform .3s ease,box-shadow .3s ease,background-color .3s ease;}\
.audit-modal .contact-form .btn:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(255,138,0,.5);background-color:#ff9b26;}\
@media (max-width:640px){.audit-modal .contact-form .form-row{grid-template-columns:1fr;}}\
@media (max-width:600px){.audit-modal{padding:12px;}.audit-modal-panel{padding:24px 20px 22px;max-height:92vh;border-radius:18px;}.audit-modal-header h3{font-size:1.4rem;}.audit-modal-header p{font-size:.85rem;}.audit-modal-close{width:32px;height:32px;top:10px;right:10px;}}';

    var MARKUP = '\
<div class="audit-modal-backdrop" data-close-audit></div>\
<div class="audit-modal-panel" role="document">\
  <button type="button" class="audit-modal-close" aria-label="Close" data-close-audit><i class="fa-solid fa-xmark"></i></button>\
  <div class="audit-modal-header">\
    <span class="hero-badge"><i class="fa-solid fa-circle"></i> Free Audit</span>\
    <h3 id="audit-modal-title">Claim Your Free Audit</h3>\
    <p>Tell us about your business &mdash; we\'ll review and come back with a tailored growth plan within 24 hours.</p>\
  </div>\
  <form class="contact-form" id="audit-form" action="#" method="POST" name="audit" aria-label="Free audit request form">\
    <div class="form-row">\
      <div><label for="audit-name">Your Name *</label><input type="text" id="audit-name" name="name" required placeholder="e.g. Ravi Kumar" /></div>\
      <div><label for="audit-email">Email *</label><input type="email" id="audit-email" name="email" required placeholder="you@business.com" /></div>\
    </div>\
    <div class="form-row">\
      <div><label for="audit-phone">Phone</label><input type="tel" id="audit-phone" name="phone" placeholder="+91 98765 43210" /></div>\
      <div><label for="audit-business">Business Name</label><input type="text" id="audit-business" name="business" placeholder="Your Business" /></div>\
    </div>\
    <div>\
      <label for="audit-service">Service You\'re Interested In</label>\
      <select id="audit-service" name="service">\
        <option value="">&mdash; Select a Service &mdash;</option>\
        <option value="social-media-management">Social Media Management</option>\
        <option value="branding-design">Branding &amp; Design</option>\
        <option value="seo-aeo-geo">SEO, AEO &amp; GEO</option>\
        <option value="performance-marketing">Performance Marketing (Meta &amp; Google Ads)</option>\
        <option value="video-production">Video Production &amp; Editing</option>\
        <option value="web-development">Web Development &amp; UI/UX</option>\
        <option value="all">Full-Service Digital Marketing</option>\
        <option value="not-sure">Not sure &mdash; help me decide</option>\
      </select>\
    </div>\
    <div>\
      <label for="audit-message">Tell Us About Your Business &amp; Goals *</label>\
      <textarea id="audit-message" name="message" required rows="4" placeholder="Briefly describe your business and what you\'d like to achieve..."></textarea>\
    </div>\
    <div class="submit-row"><button type="submit" class="btn">Send Message <i class="fa-solid fa-paper-plane"></i></button></div>\
  </form>\
</div>';

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('audit-modal-open');
        requestAnimationFrame(function () { modal.classList.add('is-open'); });
        var firstField = modal.querySelector('input, textarea');
        if (firstField) setTimeout(function () { firstField.focus(); }, 250);
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('audit-modal-open');
        setTimeout(function () { modal.classList.remove('is-visible'); }, 260);
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function injectModal() {
        var modal = document.createElement('div');
        modal.id = 'audit-modal';
        modal.className = 'audit-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'audit-modal-title');
        modal.innerHTML = MARKUP;
        document.body.appendChild(modal);
        return modal;
    }

    function wireOwnModal(modal) {
        // Close on backdrop / X
        modal.querySelectorAll('[data-close-audit]').forEach(function (el) {
            el.addEventListener('click', function () { closeModal(modal); });
        });
        // Close on Esc
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('is-visible')) closeModal(modal);
        });
        // Open from any CTA button on the page
        document.querySelectorAll('#open-audit-modal, [data-open-audit]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal(modal);
            });
        });
        // Form submit (endpoint not yet connected)
        var form = modal.querySelector('#audit-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                alert("Thanks — we'll get back to you within 24 hours. (Note: form endpoint not yet connected.)");
                form.reset();
                closeModal(modal);
            });
        }
    }

    function attachScrollTrigger(modal) {
        var triggered = false;
        // index.html scrolls horizontally inside .horizontal-scroll-container;
        // every other page scrolls the window vertically.
        var hContainer = document.querySelector('.horizontal-scroll-container');

        function progress() {
            if (hContainer) {
                var maxX = hContainer.scrollWidth - hContainer.clientWidth;
                return maxX > 0 ? hContainer.scrollLeft / maxX : -1;
            }
            var doc = document.documentElement;
            var scrollTop = window.pageYOffset || doc.scrollTop || 0;
            var maxY = (doc.scrollHeight || 0) - window.innerHeight;
            return maxY > 0 ? scrollTop / maxY : -1;
        }

        function check() {
            if (triggered) return;
            if (progress() >= 0.5) {
                triggered = true;
                detach();
                if (!modal.classList.contains('is-visible')) openModal(modal);
            }
        }

        function detach() {
            window.removeEventListener('scroll', check);
            if (hContainer) hContainer.removeEventListener('scroll', check);
        }

        window.addEventListener('scroll', check, { passive: true });
        if (hContainer) hContainer.addEventListener('scroll', check, { passive: true });
        check(); // in case the page loads already scrolled past the midpoint
    }

    function init() {
        var modal = document.getElementById('audit-modal');
        if (modal) {
            // Page ships its own modal markup + handlers (e.g. index.html).
            // Only add the scroll-to-open behaviour.
            attachScrollTrigger(modal);
            return;
        }
        injectStyles();
        modal = injectModal();
        wireOwnModal(modal);
        attachScrollTrigger(modal);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
