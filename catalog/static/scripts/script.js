let redirectPage = () => {
    window.location = linkLocation;
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

$(document).ready(function(){
  $('main').fadeIn(600);
  resizeMargins();
  menuLinks[0].href = hostname + '/catalog/';  
  menuLinks[1].href = hostname + '/catalog/about/';
  menuLinks[2].href = hostname + '/catalog/faq/';
});

window.onresize = resizeMargins;
$('a.header-link').click(function(event){
  event.preventDefault();
  linkLocation = this.href;
  $('main').fadeOut(600, redirectPage);		
});

