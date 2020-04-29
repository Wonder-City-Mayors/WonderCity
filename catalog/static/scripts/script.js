let processHttpResponse = (response) => {
	lineBreak = response.search('\n');
	if (lineBreak == -1) {
		return [
			true,
			response
		]
	}
	return [
		false,
		response.slice(0, lineBreak),
		response.slice(lineBreak + 1)
	]
}

let getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

let redirectPage = (linkLocation) => {
	// ФУНКЦИЯ ССЫЛКИ НА ДРУГУЮ СТРАНИЦУ
    window.location = linkLocation;
};

let goToTheTopOfThePage = () => {
	// ФУНКЦИЯ ПЛАВНОЙ ПЕРЕМОТКИ СТРАНИЦЫ КВЕРХУ
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth'
	});
};

let makeDescriptionParagraphAfterElement = (description) => {
	let paragraph = document.createElement('p');
	$(paragraph).addClass('centered red-text unvisible');
	$(paragraph).html(description);
	return paragraph;
}

jQuery.fn.makeRedPlaceholders = function(type = 'focus', placeholder = 'Заполните это поле!') {
	element = $(this[0]);
	element.stop();
	if (element.val() == 0) {
		const previousPlaceholder = element.attr('placeholder');
		element.addClass('red-placeholder');
		element.attr('placeholder', placeholder);
		element.animate({
			borderColor: '#f00',
			color: '#f00',
		}, 300);
		element.on(type, function() {
			element.stop();
			element.attr('placeholder', previousPlaceholder);
			element.removeClass('red-placeholder');
			element.animate({
				borderColor: '#787878',
				color: 'black',
			}, 300);
			element.off(type);
		});
	}
	else {
		let paragraph = makeDescriptionParagraphAfterElement(placeholder);
		element.parent().append(paragraph);
		$(paragraph).slideDown(300);
		element.animate({
			borderColor: '#f00',
			color: '#f00',
		}, 300);
		element.on(type, function() {
			$(paragraph).stop();
			$(paragraph).slideUp(300, function() {
				paragraph.parentNode.removeChild(paragraph);
			});
			element.stop();
			element.animate({
				borderColor: '#787878',
				color: 'black',
			}, 300);
			element.off(type);
		});
	}
	return this;
};

jQuery.fn.makeGreenPlaceholders = function() {
	let elements = this;
	for (let element of elements) {
		element = $(element);
		element.animate({
			borderColor: '#01aa20',
			color: '#01aa20',
		}, 300);
		element.on('input', function() {
			$(elements).stop();
			$(elements).animate({
				borderColor: '#787878',
				color: 'black',
			}, 300);
			element.off('input');
		});
	}
	return this;
}

jQuery.fn.makeEventOnPasswordInput = function() {
	$(this).on('blur', function() {
		const password = $(this).val();
		if (password.length == 0) {
			$(this).makeRedPlaceholders();
			areSignUpFieldsCorrect[4] = false;
		}
		else if (password.length < 8) {
			$(this).makeRedPlaceholders('focus', 'Ваш пароль короче 8 символов!');
			areSignUpFieldsCorrect[4] = false;
		}
	});
}

jQuery.fn.makeCursorPointerOnHover = function() {
	for (let element of this) {
		$(element).hover(
			function() {
				$(this).css('cursor', 'pointer');
			},
			function() {
				$(this).css('cursor', 'default');
			}
		);
	}
	return this;
};

jQuery.fn.makeResponsiveInput = function(titleName, dataName, index) {
	let element = $(this[0]);
	element.on('blur', function() {
		const value = $(this).val();
		if (value == '') {
			$(this).makeRedPlaceholders();
		}
		else {
			if (titleName == null) {
				element.makeGreenPlaceholders();
				areSignUpFieldsCorrect[index] = true;
			}
			else if (titleName == 'signUpEmail') {
				let incorrectEmailError = () => {
					element.makeRedPlaceholders('focus', 'Некорректный адрес');
				}
				const atPosition = value.search('@')
				if (atPosition <= 0
				|| atPosition != value.lastIndexOf('@')) {
					incorrectEmailError();
				}
				else {
					const dotPosition = value.indexOf('.', atPosition);
					if (dotPosition == -1 
					|| dotPosition == atPosition + 1 
					|| dotPosition == value.length
					|| dotPosition != value.lastIndexOf('.')) {
						incorrectEmailError();
					}
					else {
						element.makeGreenPlaceholders();
						areSignUpFieldsCorrect[index] = true;
					}
				}
			}
			else {
				$.post(window.location.href,
				`title=${titleName}&${dataName}=${value}&csrfmiddlewaretoken=${csrfToken}`,
				function(data) {
					dataArray = processHttpResponse(data);
					if (dataArray[0]) {
						areSignUpFieldsCorrect[index] = true;
						element.makeGreenPlaceholders();
					}
					else {
						areSignUpFieldsCorrect[index] = false;
						element.makeRedPlaceholders('input', dataArray[2]);
					}
				});
			}
		}
	});
	return this;
};

let makeDropdownMenu = (auth) => {
	let passwordConfirmationError = () => {
		let passwordField = $('#id_signup_password');
		passwordField.focus();
		let paragraph = makeDescriptionParagraphAfterElement('Пароли не совпадают');
		$('#id_password_confirmation').parent().append(paragraph);
		$(paragraph).slideDown(300);
		passwordField.on('blur.sqbit', function() {
			$(paragraph).slideUp(300, function() {
				paragraph.parentNode.removeChild(paragraph);
			});
			$(this).off('blur.sqbit');
		});
	}
	let checkSignUpFields = () => {
		const password1 = $('#id_signup_password').val();
		const password2 = $('#id_password_confirmation').val();
		if (password1 != password2) {
			passwordConfirmationError();
			areSignUpFieldsCorrect[4] = false;
			return false;
		}
		else {
			areSignUpFieldsCorrect[4] = true;
		}
		$('#id_firstname, #id_lastname, #id_email, #id_signup_username, #id_signup_password, #id_password_confirmation').trigger('blur');
		for (let i = 0; i < areSignUpFieldsCorrect.length; i += 1) {
			if (!areSignUpFieldsCorrect[i]) {
				console.log('One or more fields is invalid');
				return areSignUpFieldsCorrect[i];
			}
		}
		return true;
	};
	if (auth) {
		// ССЫЛКИ В ГЛАВНОМ МЕНЮ, ЕСЛИ ПОЛЬЗОВАТЕЛЬ АВТОРИЗОВАН
		menuLinks[3].href = hostname + '/profile/' + menuLinks[3].innerHTML;
		menuLinks[4].href = hostname + '/authorization/logout/';
	}
	else {
		// ССЫЛКИ В ГЛАВНОМ МЕНЮ, ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ АВТОРИЗОВАН
		// ФОРМА ВХОДА
		$('#signin').click(function() {
			$('.authorization-container').fadeIn(600);
			$('.login-container').fadeIn(600);
		});
		$('#signin, #signup').makeCursorPointerOnHover();
		$('.signin-form').submit(function(event) {
			event.preventDefault();
			$.post(window.location.href,
			'title=signIn&' + $(this).serialize(),
			function(data) {
				if (data == 'success') {
					location.reload(true);
				}
				else {
					$('#id_signin_username, #id_signin_password').animate({
						borderColor: '#f00',
						color: '#f00',
					}, 300);
					$('#message').slideDown(300);
					$('#id_signin_username, #id_signin_password').on('input', function() {
						$('#message').slideUp(600);
						$('#id_signin_username, #id_signin_password').animate({
							borderColor: '#787878',
							color: 'black',
						}, 300);
						$('#id_signin_username, #id_signin_password').off();
					});
				}
			});
		});
		// КОНЕЦ ФОРМЫ ВХОДА
	
	// ФОРМА РЕГИСТРАЦИИ
	$('#signup').click(function() {
		$('.authorization-container').fadeIn(600);
		$('.signup-container').fadeIn(600);
	});
	$('#id_firstname').makeResponsiveInput(null, null, 0);
	$('#id_lastname').makeResponsiveInput(null, null, 1);
	$('#id_email').makeResponsiveInput('signUpEmail', 'email', 2);
	$('#id_signup_username').makeResponsiveInput('signUpUsername', 'username', 3);
	$('#id_signup_password, #id_password_confirmation').makeEventOnPasswordInput();
	$('.signup-form').submit(function(event) {
		event.preventDefault();
		if (checkSignUpFields()) {
			$.post(window.location.href,
				   'title=signUp&' + $(this).serialize(),
				   function(data) {
				console.log(data);
				if (data == 'success') {
					location.reload(true);
				}
				else {
					alert('SOMETHING WENT WRONG!..\nI haven\'t predicted that... or have I?');
				}
			});
		}
	});
	// КОНЕЦ ФОРМЫ РЕГИСТРАЦИИ
	
	// ОБЩИЕ ЭЛЕМЕНТЫ У ФОРМ
	$('#id_signin_username, #id_signin_password, #id_firstname, #id_lastname').on('blur', function() {
		if ($(this).val() == '') {
			$(this).makeRedPlaceholders();
		}
	});
	$('.authorization-container').click(function() {
		$('.authorization-container').fadeOut(300);
		$('.signup-container, .login-container').fadeOut(300);
	});
	// КОНЕЦ ОБЩИХ ЭЛЕМЕНТОВ У ФОРМ
  } 
};

const csrfToken = getCookie('csrftoken');
const pagelocation = window.location.href.split('/');
const hostname = pagelocation[0] + '//' + pagelocation[2];
const menuLinks = document.getElementsByClassName('header-link');
let isUserAuthenticated;
let animationInterval;
let areSignUpFieldsCorrect = [
	false, // ИМЯ
	false, // ФАМИЛИЯ
	false, // ЭЛЕКТРОННАЯ ПОЧТА
	false, // ЛОГИН
	false, // ПАРОЛИ СОВПАДАЮТ
]

$(document).ready(function(){
	$('main').css('animation', 'appear 1s ease forwards');
	$('a.header-link').click(function(event){
		goToTheTopOfThePage();
		event.preventDefault();
		$('main').css('animation', 'disappear 1s ease');
		setTimeout(() => {
			redirectPage(this.href);
		}, 600);
	});
	$('span.header-span').hover(
		function() {
			$(this).stop();
			$(this).animate({
				opacity: '.5',
			}, 300);
		},
		function() {
			$(this).stop();
			$(this).animate({
				opacity: '1',
			}, 300);
		}
	);
	$('ul.dropdown-container').hover(
		function() {
			$('ul.dropdown').stop();
			$('#last-up').stop();
			$('#last-up').animate({
					borderBottomRightRadius: '0',
				}, 200);
			animationInterval = setTimeout(function() {
				$('ul.dropdown').slideDown(400)
			}, 200);
		},
		function() {
			$('ul.dropdown').stop();
			$('#last-up').stop();
			clearTimeout(animationInterval);
			$('ul.dropdown').slideUp(600, function() {
				$('#last-up').animate({
					borderBottomRightRadius: '1vw',
				}, 200);
			});
		}
	);
	menuLinks[0].href = hostname + '';  
	menuLinks[1].href = hostname + '/about/';
	menuLinks[2].href = hostname + '/faq/';
	if (menuLinks[3] == undefined) {
		isUserAuthenticated = false;
	}
	else {
		isUserAuthenticated = true;
	}
	makeDropdownMenu(isUserAuthenticated);
});


