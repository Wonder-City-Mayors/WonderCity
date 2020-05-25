let formmng;
import('/static/scripts/foundation/forms.js').then(obj => {
  formmng = obj;
});

$(document).ready(function() {
  function handleSubjectClick() {
    this.nextElementSibling.classList.add('opened');
    this.children[1].classList.add('rotated');
    $(this).off('click').on('click', function() {
      this.nextElementSibling.classList.remove('opened');
      this.children[1].classList.remove('rotated');
      $(this).off('click').on('click', handleSubjectClick);
    });
  }
  
  function handleQuestionButtonClick() {
    form.classList.add('opened');
    this.style.display = 'none';
    $(form).on('submit', function(event) {
      event.preventDefault();
      let subjectField = this[1],
        descField = this[2],
        subject = subjectField.value,
        desc = descField.value,
        submitButton = this.children[this.children.length - 1];
      if (subject === '') {
        formmng.showError(subjectField, 'Введите тему вопроса.');
      } else {
        submitButton.style.display = 'none';
        $.ajax({
          url: '/faq/add-question',
          method: 'POST',
          data: $(this).serialize(),
          success: () => {
            formmng.showSuccess(this, 'Ваш вопрос принят на рассмотрение!');
          }
        });
      }
    });
  }

  let form = document.getElementsByTagName('form')[0];
  $('.question-subject').on('click', handleSubjectClick);
  $('#question-me').on('click', handleQuestionButtonClick);
});