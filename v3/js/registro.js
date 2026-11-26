/* ===== registro.js — pre-registro y pase digital ===== */
(function () {
  'use strict';
  var form = document.getElementById('registration-form'); if (!form) return;
  var modal = document.getElementById('ticket-modal'), closeBtn = document.getElementById('close-modal-btn');
  var last = null;
  var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var set = function (id, t) { var el = document.getElementById(id); if (el) el.textContent = t; };

  function openModal() {
    last = document.activeElement;
    modal.classList.remove('hidden'); modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; document.body.classList.add('modal-open'); closeBtn.focus();
  }
  function closeModal() {
    modal.classList.add('hidden'); modal.classList.remove('flex');
    document.body.style.overflow = ''; document.body.classList.remove('modal-open'); if (last && last.focus) last.focus();
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var pagos = window.SITE && window.SITE.pagosActivos, plan = document.getElementById('reg-plan');
    var code = 'EV-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
    set('ticket-attendee-name', val('reg-name'));
    set('ticket-attendee-doc', 'C.I./RIF ' + val('reg-doc'));
    set('ticket-attendee-state', val('reg-state'));
    set('ticket-attendee-email', val('reg-email'));
    set('ticket-attendee-company', val('reg-company') || 'Emprendedor / Particular');
    set('ticket-ref', val('reg-ref') ? 'Ref: ' + val('reg-ref') : 'Ref: Pendiente');
    set('ticket-pass-type', pagos && plan ? plan.options[plan.selectedIndex].text.split(' (')[0] : 'Cupo gratuito');
    set('ticket-code', code);
    openModal();
  });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('flex')) closeModal(); });
  var pr = document.getElementById('print-ticket-btn'); if (pr) pr.addEventListener('click', function () { window.print(); });

  [].forEach.call(document.querySelectorAll('.select-plan-btn'), function (b) {
    b.addEventListener('click', function () {
      var plan = document.getElementById('reg-plan'); if (plan && b.dataset.plan) plan.value = b.dataset.plan;
      var t = document.getElementById('registro'); if (t) t.scrollIntoView();
    });
  });
})();
