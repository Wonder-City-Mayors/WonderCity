let cookies, forms, validateEmail;
import('../foundation/cookies.js').then(obj => {
  cookies = obj;
  csrftoken = cookies.getCookie('csrftoken');
});

import('../foundation/forms.js').then(obj => {
  forms = obj;
  validateEmail = forms.validateEmail;
});

let isSignup = true, csrftoken;
if (window.location.search === '?type=signin') {
  isSignup = false;
}

$(document).ready(function() {
  function sw1tch() {
    let passiveSwitcher = $(this);
    let activeSwitcher = passiveSwitcher.siblings('div');
    if (signupForm.hasClass('slided-right')) {
      signinForm.addClass('slided-left');
      signupForm.removeClass('slided-right');
      document.title = 'Регистрация';
      history.replaceState(null, 'Регистрация', window.location.origin + window.location.pathname + '?type=signup');
    } else {
      signinForm.removeClass('slided-left');
      signupForm.addClass('slided-right');
      document.title = 'Вход';
      history.replaceState(null, 'Вход', window.location.origin + window.location.pathname + '?type=signin');
    }
    passiveSwitcher.addClass('active');
    activeSwitcher.removeClass('active');
    passiveSwitcher.off('click');
    activeSwitcher.on('click', sw1tch);
  };
  let passiveSwitcher,
    signinForm = $(document.getElementsByClassName('signin-form')[0]),
    signupForm = $(signinForm[0].nextElementSibling),
    header = document.getElementsByTagName('header')[0];
  if (isSignup) {
    passiveSwitcher = $(header.children[1]);
    $(header.children[2]).addClass('active');
    signupForm.removeClass('slided-right');
    document.title = 'Регистрация';
  } else {
    passiveSwitcher = $(header.children[2]);
    $(header.children[1]).addClass('active');
    signinForm.removeClass('slided-left');
    document.title = 'Вход';
  }
  passiveSwitcher.on('click', sw1tch);
  signinForm.on("submit", function(event) {
    event.preventDefault();
    let emailField = this[1],
      passwordField = this[2],
      valid = true,
      loginType = 'email';
    if (emailField.value === '') {
      forms.showError(emailField, 'Введите email или логин.');
      valid = false;
    } else if (emailField.value.includes('@')) {
      if (!validateEmail(emailField.value)) {
        forms.showError(emailField, 'Некорректный email.');
        valid = false;
      }
    } else {
      let regex = /[^a-zA-Z0-9]/;
      loginType = 'username';
      if (regex.test(emailField.value)) {
        forms.showError(emailField, 'Некорректный логин.');
        valid = false;
      }
    }
    if (passwordField.value === "") {
      forms.showError(passwordField, "Введите пароль.");
      valid = false;
    } else if (passwordField.value.length < 8) {
      forms.showError(passwordField, "Пароль недостаточно длинный.");
      valid = false;
    }
    if (valid) {
      let submitButton = this.children[this.children.length - 1];
      submitButton.style.display = "none";
      $.ajax({
        method: "POST",
        url: "",
        data: "title=logUserIn&type=" + loginType + '&' + $(this).serialize(),
        success: function(data) {
          window.location.href = "/";
        },
        error: function(data) {
          forms.showError(passwordField, data.responseText);
        },
        complete: () => {
          submitButton.style.display = "";
        }
      });
    }
  });
  signupForm.on('submit', function(event) {
    let registerEmail = this.nextElementSibling;
    if (registerEmail.children.length === 2) {
      registerEmail.children[0].innerHTML = 'Вы уже зарегистрировались. Проверьте почту.';
    } else {
      event.preventDefault();
      let nameField = this[0];
      let surnameField = this[1];
      let name = nameField.value;
      let surname = surnameField.value;
      let valid = true;
      let regex = /[^A-Za-zЁёА-я]/u;
      if (regex.test(name)) {
        forms.showError(nameField, 'Имя может состоять только из букв. Пробелы недопустимы.');
        valid = false;
      } else if (name === '') {
        forms.showError(nameField, 'Введите имя.');
        valid = false;
      }
      if (regex.test(surname)) {
        forms.showError(surnameField, 'Фамилия может состоять только из букв. Пробелы недопустимы.');
        valid = false;
      }
      if (valid) {
        let registerName = this,
          surnameBlank = surname === '';
        name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
        if (!surnameBlank) {
          surname = surname.charAt(0).toUpperCase() + surname.substring(1).toLowerCase();
        }
        registerName.classList.add('slided-left');
        registerEmail.classList.remove('slided-right');
        header.classList.add('slided-up');
        let bool = true,
          i = 0;
        while(bool) {
          if (registerEmail.children[i].nodeName === 'P') {
            bool = false;
            registerEmail.children[i].innerHTML = 'Здравствуйте, ' + name + (surnameBlank ? '!' : ' ' + surname + '!');
          } else {
            i += 1;
          }
        }
        $(registerEmail).on('submit', function(event) {
          event.preventDefault();
          let form = this,
            submitButton = form[form.length - 1],
            emailField = form[1],
            email = emailField.value.toLowerCase().trim();
          submitButton.style.display = 'none';
          if (validateEmail(email)) {
            let ajaxData = $(form).serialize() + '&title=signUserUp&name=' + name;
            if (!surnameBlank) {
              ajaxData += '&surname=' + surname;
            }
            $.ajax({
              url: window.location.href,
              method: 'POST',
              data: ajaxData,
              success: () => {
                while (form.children.length > 1) {
                  form.children[0].remove();
                }
                let paragraph = document.createElement('p');
                paragraph.classList.add('centered');
                paragraph.innerHTML = 'Вы успешно зарегистрировались! На email ' +
                  email + ', указанный при регистрации, отправлено письмо с паролем. Используйте его' + 
                  ' для входа в аккаунт.';
                $(form).prepend(paragraph);
              },
              error: (data) => {
                forms.showError(emailField, data.responseText);
              },
              complete: () => {
                submitButton.style.display = '';
              }
            })
          } else {
            forms.showError(emailField, 'Некорректный email.');
            submitButton.style.display = '';
          }
        });
        $(registerEmail.children[registerEmail.children.length - 1]).on('click', function() {
          $(registerEmail).off('submit');
          registerName.classList.remove('slided-left');
          registerEmail.classList.add('slided-right');
          header.classList.remove('slided-up');
          $(this).off('click');
        });
      }
    }
  });
});