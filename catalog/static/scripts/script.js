let redirectPage = () => {
    window.location = linkLocation;
}

let goToTheTopOfThePage = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

const resizeMargins = () => {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  for (let span of document.getElementsByClassName('header-span')) {
  span.style.margin = `${0.05 * viewportHeight - 0.5 * span.clientHeight}px 0 0 ${0.096 * viewportWidth - 0.5 * span.clientWidth}px`;
  }
};

const pagelocation = window.location.href.split('/');
const hostname = pagelocation[0] + '//' + pagelocation[2];
const menuLinks = document.getElementsByClassName('header-link');

resizeMargins();

$(document).ready(function(){
  $('main').fadeIn(600);
  menuLinks[0].href = hostname + '/catalog/';  
  menuLinks[1].href = hostname + '/catalog/about/';
  menuLinks[2].href = hostname + '/catalog/faq/';
  menuLinks[3].href = hostname + '/catalog/profile/';
});

window.onresize = resizeMargins;
$('a.header-link').click(function(event){
  event.preventDefault();
  goToTheTopOfThePage();
  linkLocation = this.href;
  $('main').fadeOut(600, redirectPage);		
});

$('span.header-span').mouseover(function() {
  $(this).stop();
  $(this).animate({
	letterSpacing: '0.1em',
  }, 300);
});

$('span.header-span').mouseleave(function() {
  $(this).stop();
  $(this).animate({
	letterSpacing: '0',
  }, 300);
});

