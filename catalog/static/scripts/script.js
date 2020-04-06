let redirectPage = () => {
    window.location = linkLocation;
};

let goToTheTopOfThePage = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

let makeDropdownMenu = (auth) => {
  if (auth) {
	menuLinks[3].href = hostname + '/profile/' + menuLinks[3].innerHTML;
	menuLinks[4].href = hostname + '/authorization/logout/';
  }
  else {
	console.log('User is not found');
	$('#login').click(function() {
		$('.authorization-container').fadeIn(600);
		$('.login-container').fadeIn(600);
	});
	$('#signup').click(function() {
		$('.authorization-container').fadeIn(600);
		$('.signup-container').fadeIn(600);
	});
	$('.authorization-container').click(function(event) {
		$('.authorization-container').fadeOut(300);
		$('.signup-container, .login-container').fadeOut(300);
	});
	$('#login, #signup').hover(
		function() {
			$(this).css('cursor', 'pointer');
		},
		function() {
			$(this).css('cursor', 'default');
		}
	);
  } 
};

let resizeMargins = () => {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  for (let span of document.getElementsByClassName('header-span')) {
  $(span).css('margin', `${0.035 * viewportHeight - 0.5 * span.clientHeight}px 0 0 ${0.096 * viewportWidth - 0.5 * span.clientWidth}px`);
  }
};

const pagelocation = window.location.href.split('/');
const hostname = pagelocation[0] + '//' + pagelocation[2];
const menuLinks = document.getElementsByClassName('header-link');
let isUserAuthenticated;
let animationInterval;

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

