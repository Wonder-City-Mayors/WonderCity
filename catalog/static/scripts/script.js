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

let redirectPage = () => {
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

jQuery.fn.makeRedPlaceholders = function(type = 'focus', placeholder = 'Заполните это поле!') {
	let elements = this;
	for (let element of elements) {
		element = $(element);
		element.stop();
		const previousPlaceholder = element.attr('placeholder');
		element.addClass('red-placeholder');
		element.attr('placeholder', placeholder);
		element.animate({
			borderColor: '#f00',
			color: '#f00',
		}, 300);
		element.on(type, function() {
			$(elements).stop();
			$(elements).attr('placeholder', previousPlaceholder);
			$(elements).removeClass('red-placeholder');
			$(elements).animate({
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
	let elements = this;
	$(elements[0]).on('blur', function() {
		const password1 = $(this).val();
		const password2 = $(elements[1]).val();
		if (password1.length < 8) {
			$(this).makeRedPlaceholders('input');
			areSignUpFieldsCorrect[4] = false;
		}
		else if (password1 == password2) {
			$(elements).makeGreenPlaceholders();
			areSignUpFieldsCorrect[4] = true;
		}
		else {
			$(elements).makeRedPlaceholders('input', 'Пароли не совпадают!');
			areSignUpFieldsCorrect[4] = false;
		}
	});
	$(elements[1]).on('blur', function() {
		const password1 = $(elements[0]).val();
		const password2 = $(this).val();
		if (password2.length < 8) {
			$(this).makeRedPlaceholders('input');
			areSignUpFieldsCorrect[4] = false;
		}
		else if (password1 == password2) {
			$(elements).makeGreenPlaceholders();
			areSignUpFieldsCorrect[4] = true;
		}
		else {
			$(elements).makeRedPlaceholders('input', 'Пароли не совпадают!');
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
			if (index > 1) {
				$.post(window.location.href,
				`title=${titleName}&${dataName}=${value}&csrfmiddlewaretoken=${csrfToken}`,
				function(data) {
					dataArray = processHttpResponse(data);
					if (dataArray[0]) {
						areSignUpFieldsCorrect[index] = true;
						element.makeGreenPlaceholders();
					}
					else {
						console.log(`Ответ сервера: "${dataArray[1]}";\nОписание ответа: "${dataArray[2]}".`);
						areSignUpFieldsCorrect[index] = false;
						element.makeRedPlaceholders('input');
					}
				});
			}
			else {
				element.makeGreenPlaceholders();
				areSignUpFieldsCorrect[index] = true;
			}
		}
	});
	return this;
};

let makeDropdownMenu = (auth) => {
	let checkSignUpFields = () => {
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
				}
				else {
				}
			});
		}
	});
	// КОНЕЦ ФОРМЫ РЕГИСТРАЦИИ
	
	// ОБЩИЕ ЭЛЕМЕНТЫ У ФОРМ
	$('.submit').hover(
		function() {
			$(this).stop();
			$(this).css('cursor', 'pointer');
			$(this).animate({
				backgroundColor: '#787878',
				color: 'rgb(244, 244, 244)',
			});
		},
		function() {
			$(this).stop();
			$(this).css('cursor', 'default');
			$(this).animate({
				backgroundColor: 'rgb(244, 244, 244)',
				color: '#787878',
			});
		}
	);
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

let resizeMargins = () => {
	// ФУНКЦИЯ ЦЕНТРИРОВАНИЯ НАДПИСЕЙ В ГЛАВНОМ МЕНЮ
	const viewportWidth = document.documentElement.clientWidth;
	const viewportHeight = document.documentElement.clientHeight;
	for (let span of document.getElementsByClassName('header-span')) {
		$(span).css('margin', `${0.035 * viewportHeight - 0.5 * span.clientHeight}px 0 0 ${0.096 * viewportWidth - 0.5 * span.clientWidth}px`);
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
	resizeMargins();
	$('ul.dropdown').css('display', 'none');
	$('main').slideDown(600);
	$('footer').slideDown(600);
	$('a.header-link').click(function(event){
		event.preventDefault();
		goToTheTopOfThePage();
		linkLocation = this.href;
		$('footer').slideUp(600);
		$('main').slideUp(600, redirectPage);	
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

window.onresize = resizeMargins;

