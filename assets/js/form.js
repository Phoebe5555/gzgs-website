/*
 * Website enquiry form -> Lark Base (官网留言与合作登记 Website Enquiries)
 * Lark automation: 接收到 Webhook 时 -> 新增记录
 * To change where messages go, replace LARK_WEBHOOK_URL below.
 */
(function () {
  var LARK_WEBHOOK_URL = 'https://pjpp0b389m84.jp.larksuite.com/base/automation/webhook/event/BqKZaDhPwwbSIBhCQG6jRiYFpxc';

  document.querySelectorAll('form.lark-form').forEach(function (form) {
    var btn = form.querySelector('button[type=submit]');
    var ok = form.querySelector('.form-ok');
    var err = form.querySelector('.form-err');
    var label = btn.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = new FormData(form);
      var sel = form.querySelector('select[name=partner_type]');
      var opt = sel && sel.selectedOptions && sel.selectedOptions[0];
      var record = {
        name: f.get('name') || '', company: f.get('company') || '',
        email: f.get('email') || '', phone: f.get('phone') || '',
        partner_type: f.get('partner_type') || '',
        value_chain: opt ? (opt.getAttribute('data-chain') || '') : '',
        message: f.get('message') || '',
        language: form.getAttribute('data-lang') || '',
        submitted_at: new Date().toISOString(),
        page: form.getAttribute('data-page') || ''
      };
      ok.hidden = true; err.hidden = true;
      btn.disabled = true; btn.textContent = btn.getAttribute('data-sending') || label;
      // Sent as a CORS "simple" request so it works from any website: Lark reads the
      // JSON body and adds the record; the browser cannot read Lark's reply.
      fetch(LARK_WEBHOOK_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(record)
      }).then(function () {
        form.reset(); ok.hidden = false;
      }).catch(function () {
        err.hidden = false;
      }).then(function () {
        btn.disabled = false; btn.textContent = label;
      });
    });
  });
})();
