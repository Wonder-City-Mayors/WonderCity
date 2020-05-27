let formmng;
import('/static/scripts/foundation/forms.js').then(obj => {
  formmng = obj;
});

$(document).ready(function() {
  function handleSwitcherClick() {
    if (attentionParagraph) {
      attentionParagraph.remove();
      attentionParagraph = false;
    }
    let i;
    for (i = 0; i < forms.length; i += 1) {
      if (forms[i].classList.contains('active')) {
        forms[i].classList.remove('active');
      } else if (forms[i].classList.contains(this.classList[0])) {
        forms[i].classList.add('active');
      }
    }
    for (i = 0; i < this.parentNode.children.length; i += 1) {
      let child = this.parentNode.children[i];
      if (child.classList.contains('active')) {
        child.classList.remove('active');
        child.classList.add('clickable');
        $(child).on('click', handleSwitcherClick);
        break;
      }
    }
    this.classList.add('active');
    $(this).off('click');
    this.classList.remove('clickable');
  }
  function trackerTransition() {
    let trackerId = this.value;
    this.removeEventListener('transitionend', trackerTransition);
    this.value = '';
    this.setAttribute('name', 'text');
    this.setAttribute('maxlength', '128');
    this.setAttribute('placeholder', 'Описание');
    this.classList.remove('closed');
    $(this.parentNode).off('submit').on('submit', function(event) {
      event.preventDefault();
      this.children[this.children.length - 1].style.display = 'none';
      $.ajax({
        method: 'POST',
        url: '/profile-management/add-tracker',
        data: 'title=desc&tracker-id=' + trackerId + '&' + $(this).serialize(),
        success: () => {
          this.children[0].innerHTML = '<li>Успешно!</li>';
        }
      });
    });
  }
  let forms = document.getElementsByTagName('form'),
    attentionParagraph = document.getElementById('content-wrapper').children[0];
  $('.clickable').on('click', handleSwitcherClick);
  $(forms[0]).on('submit', function(event) {
    event.preventDefault();
    let usernameField = this[1],
      submitButton = this.children[this.children.length - 1],
      username = usernameField.value,
      regex = /[^a-z0-9]/;
    if (regex.test(username)) {
      formmng.showError(usernameField, 'Логин должен содержать только маленькие латинские буквы и цифры. Пробелы недопустимы.');
    } else {
      submitButton.style.display = 'none';
      $.ajax({
        method: 'POST',
        url: '/profile-management/change-username',
        data: $(this).serialize(),
        success: (data) => {
          formmng.showSuccess(this, 'Успешная смена!');
          setTimeout(() => {
            window.location.href = '/profile/' + username;
          }, 1000);
        },
        error: (data) => {
          formmng.showError(usernameField, data.responseText);
          submitButton.style.display = '';
        }
      });
    }
  });
  $(forms[1]).on('submit', function(event) {
    event.preventDefault();
    let oldPasswordField = this[1],
      newPasswordField = this[2],
      oldPassword = oldPasswordField.value,
      newPassword = newPasswordField.value,
      submitButton = this.children[this.children.length - 1],
      regex = /[^ a-zA-Z0-9]/,
      valid = true;
    if (oldPassword === '') {
      formmng.showError(oldPasswordField, 'Введите старый пароль.');
      valid = false;
    } else if (oldPassword.length < 8) {
      formmng.showError(oldPasswordField, 'Старый пароль недостаточно длинный');
      valid = false;
    } else if (regex.test(oldPassword)) {
      formmng.showError(oldPasswordField, 'Старый пароль содержит некорректные символы.');
      valid = false;
    }
    if (newPassword === '') {
      formmng.showError(newPasswordField, 'Введите новый пароль.');
      valid = false;
    } else if (newPassword.length < 8) {
      formmng.showError(newPasswordField, 'Новый пароль недостаточно длинный');
      valid = false;
    } else if (regex.test(newPassword)) {
      formmng.showError(newPasswordField, 'Новый пароль содержит некорректные символы.');
    } else if (newPassword === oldPassword) {
      formmng.showError('Новый пароль должен отличаться от старого.');
    }
    if (valid) {
      submitButton.style.display = 'none';
      $.ajax({
        method: 'POST',
        url: '/profile-management/change-password',
        data: $(this).serialize(),
        success: (data) => {
          formmng.showSuccess(this, 'Успешная смена!');
        },
        error: (data) => {
          formmng.showError(oldPasswordField, data.responseText);
          submitButton.style.display = '';
        }
      });
    }
  });
  $(forms[2]).on('submit', function(event) {
    event.preventDefault();
    let form = this,
      trackerIdField = this[1],
      trackerId = trackerIdField.value,
      submitButton = this.children[this.children.length - 1],
      regex = /[^0-9]/;
    if (regex.test(trackerId)) {
      formmng.showError(trackerIdField, 'Идентификатор считывающего устройства должен содержать только цифры. Пробелы недопустимы.');
    } else {
      submitButton.style.display = 'none';
      $.ajax({
        method: 'POST',
        url: '/profile-management/add-tracker',
        data: 'title=register&' + $(form).serialize(),
        success: (data) => {
          formmng.showSuccess(form, 'Отлично! Добавьте описание к устройству (или оставьте его пустым):');
          trackerIdField.classList.add('closed');
          trackerIdField.addEventListener('transitionend', trackerTransition);
          submitButton.style.display = '';
        },
        error: (data) => {
          formmng.showError(trackerIdField, data.responseText);
          submitButton.style.display = '';
        }
      });
    }
  });
});