// Мобильное меню
var burger = document.getElementById('burger');
var nav = document.getElementById('nav');
burger.addEventListener('click', function () {
  var open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () { nav.classList.remove('is-open'); });
});

// Кнопки «Выбрать» в пакетах подставляют тариф в форму
var tariffSelect = document.getElementById('tariffSelect');
document.querySelectorAll('[data-tariff]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    tariffSelect.value = btn.getAttribute('data-tariff');
  });
});

// Форма заявки
// Если в action указан реальный адрес обработчика (Formspree, PHP-скрипт и т.п.),
// данные отправляются на него. Если action="#", форма только показывает «Спасибо».
var form = document.getElementById('leadForm');
var thanks = document.getElementById('thanks');
var errorBox = document.getElementById('formError');
var submitBtn = document.getElementById('submitBtn');

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
}

function validate() {
  var ok = true;
  var firstBad = null;
  form.querySelectorAll('[required]').forEach(function (el) {
    var bad = false;
    if (el.type === 'radio') {
      bad = !form.querySelector('input[name="' + el.name + '"]:checked');
    } else if (el.type === 'checkbox') {
      bad = !el.checked;
    } else {
      bad = !el.value.trim();
    }
    el.classList.toggle('invalid', bad && el.type !== 'radio' && el.type !== 'checkbox');
    if (bad) { ok = false; if (!firstBad) firstBad = el; }
  });
  var phone = form.elements.phone.value.replace(/\D/g, '');
  if (form.elements.phone.value && phone.length < 10) {
    form.elements.phone.classList.add('invalid');
    ok = false;
    if (!firstBad) firstBad = form.elements.phone;
  }
  return { ok: ok, el: firstBad };
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorBox.hidden = true;
  var v = validate();
  if (!v.ok) {
    showError('Пожалуйста, заполните все обязательные поля и поставьте обе галочки.');
    if (v.el && v.el.focus) v.el.focus();
    return;
  }
  var done = function () {
    form.hidden = true;
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  var action = form.getAttribute('action');
  if (action && action !== '#') {
    submitBtn.disabled = true;
    fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (r.ok) { done(); } else { throw new Error(); } })
      .catch(function () { showError('Не удалось отправить заявку. Напишите мне в Telegram: t.me/turkinaa'); })
      .then(function () { submitBtn.disabled = false; });
  } else {
    done();
  }
});

// Снимаем красную рамку при вводе
form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });
