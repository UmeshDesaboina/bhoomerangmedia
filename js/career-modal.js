/* =====================================================================
   Careers / "Apply Now" modal — opened from any [data-open-career] or
   #open-career-modal CTA on the page. Self-contained: injects its own
   markup, styles and handlers. Does NOT auto-open on scroll.
   ===================================================================== */
(function () {
    if (window.__careerModalLoaded) return;
    window.__careerModalLoaded = true;

    var STYLE_ID = 'career-modal-styles';

    var CSS = '\
.career-modal{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .25s ease;}\
.career-modal.is-visible{display:flex;}\
.career-modal.is-open{opacity:1;}\
.career-modal-backdrop{position:absolute;inset:0;background:rgba(5,5,5,.88);cursor:pointer;}\
.career-modal-panel{position:relative;width:100%;max-width:720px;max-height:90vh;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;background:#0e0a06;border:1px solid rgba(255,138,0,.3);border-radius:22px;padding:36px 36px 30px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(255,138,0,.08);transform:translateY(12px) scale(.98);transition:transform .3s cubic-bezier(.22,1,.36,1);}\
.career-modal.is-open .career-modal-panel{transform:translateY(0) scale(1);}\
.career-modal-close{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;background:rgba(255,138,0,.1);border:1px solid rgba(255,138,0,.3);color:var(--orange-accent,#ff8a00);font-size:1rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background .25s ease,transform .25s ease;}\
.career-modal-close:hover{background:var(--orange-accent,#ff8a00);color:#000;transform:rotate(90deg);}\
.career-modal-header{text-align:center;margin-bottom:22px;}\
.career-modal-header .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(255,138,0,.12);border:1px solid rgba(255,138,0,.35);border-radius:50px;font-size:.85rem;color:var(--orange-accent,#ff8a00);font-weight:500;margin-bottom:14px;letter-spacing:.04em;text-transform:uppercase;}\
.career-modal-header .hero-badge i{font-size:.55rem;}\
.career-modal-header h3{font-size:1.85rem;font-weight:600;color:var(--text-white,#fff);margin-bottom:8px;line-height:1.2;}\
.career-modal-header p{color:var(--text-muted,#e0e0e0);font-size:.95rem;line-height:1.55;max-width:520px;margin:0 auto;}\
body.career-modal-open{overflow:hidden;}\
.career-modal .contact-form{max-width:700px;margin:0 auto;display:grid;gap:16px;}\
.career-modal .contact-form .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}\
.career-modal .contact-form label{display:block;font-size:.88rem;font-weight:500;color:var(--text-muted,#e0e0e0);margin-bottom:6px;letter-spacing:.02em;}\
.career-modal .contact-form input,.career-modal .contact-form select,.career-modal .contact-form textarea{width:100%;padding:12px 14px;background:var(--dark-card,rgba(255,255,255,.03));border:1px solid rgba(255,138,0,.2);border-radius:10px;color:var(--text-white,#fff);font-family:"Poppins",sans-serif;font-size:.95rem;transition:border-color .25s ease,box-shadow .25s ease,background .25s ease;}\
.career-modal .contact-form input:focus,.career-modal .contact-form select:focus,.career-modal .contact-form textarea:focus{outline:none;border-color:var(--orange-accent,#ff8a00);background-color:rgba(255,138,0,.04);box-shadow:0 0 0 4px rgba(255,138,0,.12);}\
.career-modal .contact-form input::placeholder,.career-modal .contact-form textarea::placeholder{color:rgba(224,224,224,.4);}\
.career-modal .contact-form input[type=file]{padding:10px 14px;cursor:pointer;}\
.career-modal .contact-form input[type=file]::file-selector-button{margin-right:12px;padding:7px 14px;background:rgba(255,138,0,.12);border:1px solid rgba(255,138,0,.35);border-radius:8px;color:var(--orange-accent,#ff8a00);font-family:"Poppins",sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;}\
.career-modal .contact-form select{appearance:none;-webkit-appearance:none;-moz-appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ff8a00\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'/></svg>");background-repeat:no-repeat;background-position:right 16px center;background-size:14px 14px;padding-right:44px;cursor:pointer;}\
.career-modal .contact-form select option{background-color:#1a0f08;color:var(--text-white,#fff);}\
.career-modal .contact-form textarea{resize:vertical;min-height:110px;}\
.career-modal .contact-form .submit-row{margin-top:6px;text-align:center;}\
.career-modal .contact-form .btn{display:inline-flex;align-items:center;gap:10px;background-color:var(--orange-accent,#ff8a00);color:#000;font-weight:600;font-size:1.05rem;padding:14px 34px;border-radius:50px;border:none;cursor:pointer;font-family:"Poppins",sans-serif;box-shadow:0 4px 15px rgba(255,138,0,.3);transition:transform .3s ease,box-shadow .3s ease,background-color .3s ease;}\
.career-modal .contact-form .btn:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(255,138,0,.5);background-color:#ff9b26;}\
@media (max-width:640px){.career-modal .contact-form .form-row{grid-template-columns:1fr;}}\
@media (max-width:600px){.career-modal{padding:12px;}.career-modal-panel{padding:24px 20px 22px;max-height:92vh;border-radius:18px;}.career-modal-header h3{font-size:1.4rem;}.career-modal-header p{font-size:.85rem;}.career-modal-close{width:32px;height:32px;top:10px;right:10px;}}';

    var MARKUP = '\
<div class="career-modal-backdrop" data-close-career></div>\
<div class="career-modal-panel" role="document">\
  <button type="button" class="career-modal-close" aria-label="Close" data-close-career><i class="fa-solid fa-xmark"></i></button>\
  <div class="career-modal-header">\
    <span class="hero-badge"><i class="fa-solid fa-circle"></i> Careers</span>\
    <h3 id="career-modal-title">Apply to Join Bhoomerang Media</h3>\
    <p>Tell us about yourself and the role you\'re after &mdash; if there\'s a fit, our team will reach out for a conversation.</p>\
  </div>\
  <form class="contact-form" id="career-form" action="#" method="POST" name="career" aria-label="Career application form">\
    <div class="form-row">\
      <div><label for="career-name">Your Name *</label><input type="text" id="career-name" name="name" required placeholder="e.g. Ravi Kumar" /></div>\
      <div><label for="career-email">Email *</label><input type="email" id="career-email" name="email" required placeholder="you@email.com" /></div>\
    </div>\
    <div class="form-row">\
      <div><label for="career-phone">Phone *</label><input type="tel" id="career-phone" name="phone" required placeholder="+91 98765 43210" /></div>\
      <div><label for="career-experience">Years of Experience</label><input type="text" id="career-experience" name="experience" placeholder="e.g. 3 years / Fresher" /></div>\
    </div>\
    <div>\
      <label for="career-role">Role You\'re Applying For *</label>\
      <select id="career-role" name="role" required>\
        <option value="">&mdash; Select a Role &mdash;</option>\
        <option value="creative-design">Creative &amp; Design</option>\
        <option value="social-media">Social Media Manager</option>\
        <option value="seo">SEO Specialist</option>\
        <option value="web-app-development">Web &amp; App Development</option>\
        <option value="video-editing">Video Editing</option>\
        <option value="internship">Internship</option>\
        <option value="other">Other</option>\
      </select>\
    </div>\
    <div>\
      <label for="career-portfolio">Portfolio / LinkedIn URL</label>\
      <input type="url" id="career-portfolio" name="portfolio" placeholder="https://" />\
    </div>\
    <div>\
      <label for="career-resume">Resume / CV (PDF or DOC)</label>\
      <input type="file" id="career-resume" name="resume" accept=".pdf,.doc,.docx" />\
    </div>\
    <div>\
      <label for="career-message">Why do you want to join us? *</label>\
      <textarea id="career-message" name="message" required rows="4" placeholder="A few lines about yourself and what you\'d bring to the team..."></textarea>\
    </div>\
    <div class="submit-row"><button type="submit" class="btn">Submit Application <i class="fa-solid fa-paper-plane"></i></button></div>\
  </form>\
</div>';

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('career-modal-open');
        requestAnimationFrame(function () { modal.classList.add('is-open'); });
        var firstField = modal.querySelector('input, textarea');
        if (firstField) setTimeout(function () { firstField.focus(); }, 250);
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('career-modal-open');
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
        modal.id = 'career-modal';
        modal.className = 'career-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'career-modal-title');
        modal.innerHTML = MARKUP;
        document.body.appendChild(modal);
        return modal;
    }

    function wireModal(modal) {
        // Close on backdrop / X
        modal.querySelectorAll('[data-close-career]').forEach(function (el) {
            el.addEventListener('click', function () { closeModal(modal); });
        });
        // Close on Esc
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('is-visible')) closeModal(modal);
        });
        // Open from any CTA button on the page
        document.querySelectorAll('#open-career-modal, [data-open-career]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal(modal);
            });
        });
        // Form submit (endpoint not yet connected)
        var form = modal.querySelector('#career-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                alert("Thanks for applying — we'll review your application and get back to you soon. (Note: form endpoint not yet connected.)");
                form.reset();
                closeModal(modal);
            });
        }
    }

    function init() {
        injectStyles();
        var modal = injectModal();
        wireModal(modal);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
