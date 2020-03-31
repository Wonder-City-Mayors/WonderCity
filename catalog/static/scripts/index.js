const goToTheTopOfThePage = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

let redirectTo = (url) => {
  window.location.replace(url);
}

const resizeMargins = () => {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  for (let span of document.getElementsByClassName('header-span')) {
  span.style.margin = `${0.05 * viewportHeight - 0.5 * span.clientHeight}px 0 0 ${0.096 * viewportWidth - 0.5 * span.clientWidth}px`;
  }
};

const makeLinksInHeader = (index) => {
  const span = document.getElementsByClassName('header-span')[index];
  if (index == 0) {
    $(span).click(goToTheTopOfThePage);
  }
  else if (index == 1) {
    $(span).click(function() {
      redirectTo('/about.html');
    });
  }
  else if (index == 2) {
    $(span).click(function() {
      redirectTo('/faq.html');
    });
  }
  else if (index == 3) {
    
  }
  $(span).hover(function() {
    $(this).css('cursor', 'pointer');
  });
};

resizeMargins();
for (let i = 0; i < document.getElementsByClassName('header-span').length; i += 1) {
  makeLinksInHeader(i);
}


