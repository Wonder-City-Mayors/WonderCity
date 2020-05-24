$(document).ready(function() {
  let shevronIcon = $('.fa-chevron-down');
  $('#smallwidth-nav-toggler').on('click', () => {
    $('#nav-flex').toggleClass('opened');
  });
  $('#fullwidth-profile-toggler').on('click', () => {
    if (shevronIcon.hasClass('fa-chevron-down')) {
      $('#fullwidth-profile-content').addClass('opened');
      shevronIcon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
    } else {
      $('#fullwidth-profile-content').removeClass('opened');
      shevronIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
    }
  });
});


