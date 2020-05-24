export let validateEmail = (email) => {
  let emailparts = email.split('@');
  if (emailparts.length != 2) {
    return false;
  } 
  emailparts = emailparts[1].split('.');
  if (emailparts.length < 2) {
    return false;
  }
  if (emailparts[emailparts.length - 1].length < 2) {
    return false;
  }
  return true;
}

export let showError = (input, description) => {
  let checkChildrenForInners = (element, inner) => {
    for (let i = 0; i < element.childNodes.length; i += 1) {
      if (element.childNodes[i].innerHTML === inner) {
        return true;
      }
    }
    return false;
  };
  let parentForm = input.parentNode;
  if (parentForm.childNodes[0].nodeName === "UL") {
    let errorUl = parentForm.childNodes[0];
    if (!checkChildrenForInners(errorUl, description)) {
      let error = document.createElement("li");
      error.innerHTML = description;
      errorUl.append(error);
      $(error).on("click", function() {
        console.log('Hello!');
        input.focus();
      });
      $(input).on("input", function() {
        error.remove();
        $(input).off("input");
      });
    }
  } else {
    let errorUl = document.createElement("ul");
    parentForm.prepend(errorUl);
    errorUl.classList.add("form-error-block");
    let error = document.createElement("li");
    error.innerHTML = description;
    errorUl.append(error);
    $(error).on("click", function() {
      input.focus();
    });
    $(input).on("input", function() {
      error.remove();
      $(input).off("input");
    });
  }
};

export let showSuccess = (form, message) => {
  let successUl = document.createElement("ul");
  $(form).prepend(successUl);
  successUl.classList.add("form-success-block");
  let success = document.createElement("li");
  success.innerHTML = message;
  successUl.append(success);
};