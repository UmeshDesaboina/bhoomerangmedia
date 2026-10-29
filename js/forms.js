/*!
 * Bhoomerang Media: shared lead-form handler
 *
 * HOW LEADS ARE DELIVERED
 *  1. If CONFIG.endpoint is set, the form is POSTed there (Formspree, Web3Forms, Getform,
 *     your own API, etc.). On failure the visitor gets a WhatsApp / email fallback link.
 *  2. If CONFIG.endpoint is empty (default), the visitor's message is handed to WhatsApp
 *     (or an email draft for job applications) so no enquiry is ever silently dropped.
 *
 * TO CONNECT A FORM SERVICE: paste its URL into endpoint below. For services that need an
 * access key (e.g. Web3Forms) add it to extraFields, e.g. { access_key: 'YOUR-KEY' }.
 *
 * ANALYTICS: a successful submit pushes { event: 'generate_lead', form_name, method } to
 * window.dataLayer, so create a GTM trigger on the custom event "generate_lead".
 */
(function () {
  'use strict';
  if (window.__bmFormsReady) return;
  window.__bmFormsReady = true;

  var CONFIG = {
    endpoint: '',                    // e.g. 'https://formspree.io/f/xxxxxxx'
    extraFields: {},                 // e.g. { access_key: '...' }
    whatsapp: '918096562345',
    email: 'hello@bhoomerangmedia.com'
  };

  var css = '.form-status{margin-top:14px;padding:12px 16px;border-radius:10px;font-size:.92rem;line-height:1.5;text-align:left}' +
    '.form-status.is-success{background:rgba(80,200,120,.12);border:1px solid rgba(80,200,120,.4)}' +
    '.form-status.is-error{background:rgba(255,106,0,.12);border:1px solid rgba(255,106,0,.45)}' +
    '.form-status a{color:var(--orange-accent,#ff6a00);font-weight:600}' +
    '.form-consent{font-size:.78rem;opacity:.75;margin:12px 0 0;line-height:1.5;text-align:center}' +
    '.form-consent a{color:var(--orange-accent,#ff6a00);text-decoration:underline}' +
    '.contact-form button[disabled]{opacity:.6;cursor:wait}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function statusEl(form) {
    var el = form.querySelector('.form-status');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-status'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
      var row = form.querySelector('.submit-row');
      (row && row.parentNode ? row.parentNode : form).appendChild(el);
    }
    return el;
  }
  function show(form, kind, html) {
    var el = statusEl(form); el.className = 'form-status is-' + kind; el.innerHTML = html;
  }
  function formName(form) { return form.getAttribute('name') || form.id || 'form'; }   // NB: form.name is clobbered by the <input name="name">
  function fieldMap(form) {
    var out = {}, fd = new FormData(form);
    fd.forEach(function (v, k) { if (typeof v === 'string' && k.charAt(0) !== '_') out[k] = v.trim(); });
    var sel = form.querySelector('select[name="service"]');
    if (sel && sel.selectedIndex > 0) out.service_label = sel.options[sel.selectedIndex].text;
    return out;
  }
  function messageText(form, f) {
    var career = formName(form) === 'career';
    var lines = [career ? 'Hi Bhoomerang Media! I would like to apply for a role.' : 'Hi Bhoomerang Media! I would like to talk about my business.'];
    if (f.name) lines.push('Name: ' + f.name);
    if (f.business) lines.push('Business: ' + f.business);
    if (f.role) lines.push('Role: ' + f.role);
    if (f.experience) lines.push('Experience: ' + f.experience);
    if (f.service_label) lines.push('Interested in: ' + f.service_label);
    if (f.phone) lines.push('Phone: ' + f.phone);
    if (f.email) lines.push('Email: ' + f.email);
    if (f.portfolio) lines.push('Portfolio: ' + f.portfolio);
    if (f.message) lines.push('', f.message);
    lines.push('', '(Sent from ' + location.href + ')');
    return lines.join('\n');
  }
  function waLink(form, f) { return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(messageText(form, f)); }
  function mailLink(form, f) {
    var subj = formName(form) === 'career' ? 'Job application: ' + (f.role || 'Bhoomerang Media') + (f.name ? ' (' + f.name + ')' : '') : 'Website enquiry' + (f.name ? ' from ' + f.name : '');
    return 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(messageText(form, f));
  }
  function track(form, method) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'generate_lead', form_name: formName(form), method: method, page_path: location.pathname });
  }
  function done(form) {
    form.dispatchEvent(new CustomEvent('bm:lead-success', { bubbles: true }));
    form.reset();
  }
  function fallback(form, f, btn, afterFailure) {
    var career = form.getAttribute('data-lead-fallback') === 'email' || formName(form) === 'career';
    var link = career ? mailLink(form, f) : waLink(form, f);
    var label = career ? 'email' : 'WhatsApp';
    if (afterFailure) {
      show(form, 'error', 'We could not send that automatically. <a href="' + link + '"' + (career ? '' : ' target="_blank" rel="noopener"') + '>Send it via ' + label + ' instead</a>, or write to <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>.');
    } else {
      track(form, career ? 'email' : 'whatsapp');
      if (career) { window.location.href = link; show(form, 'success', 'Your email app should open with your details filled in. <strong>Please attach your resume</strong> and press send. Didn\u2019t open? Email <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>.'); }
      else { window.open(link, '_blank', 'noopener'); show(form, 'success', 'Thanks! WhatsApp is opening so you can send your message to our team. Not opened? <a href="' + link + '" target="_blank" rel="noopener">Tap here</a>.'); }
      done(form);
    }
    if (btn) btn.disabled = false;
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.classList || !form.classList.contains('contact-form')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var hp = form.querySelector('[name="_gotcha"]');
    if (hp && hp.value) { form.reset(); return; }          // bot caught by honeypot
    var btn = form.querySelector('button[type="submit"]');
    var f = fieldMap(form);

    if (!CONFIG.endpoint) { fallback(form, f, btn, false); return; }

    if (btn) btn.disabled = true;
    show(form, 'success', 'Sending\u2026');
    var fd = new FormData(form);
    fd.delete('_gotcha');
    fd.append('page_url', location.href);
    fd.append('form_name', formName(form));
    Object.keys(CONFIG.extraFields).forEach(function (k) { fd.append(k, CONFIG.extraFields[k]); });
    fetch(CONFIG.endpoint, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        track(form, 'form');
        show(form, 'success', 'Thank you! We have received your message and will get back to you within 24 hours.');
        done(form); if (btn) btn.disabled = false;
      })
      .catch(function () { fallback(form, f, btn, true); });
  }, true);
})();
