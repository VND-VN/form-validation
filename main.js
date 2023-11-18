// Đối tượng Validator
function Validator(options) {
  function validate(inputElement, rule) {
    const errorMessageText =
      inputElement.parentElement.querySelector(".form-message");
    const errorMessage = rule.test(inputElement.value);
    if (errorMessage) {
      errorMessageText.innerText = "*" + rule.test(inputElement.value);
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorMessageText.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  }

  const formElement = document.querySelector(options.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();

      if (typeof options.onSubmit === "function") {
        const enableInputs = formElement.querySelectorAll(
          "[name]:not([disabled])"
        );
        const formValues = Array.from(enableInputs).reduce((values, input) => {
          values[input.name] = input.value;
          return values;
        }, {});

        options.onSubmit(formValues);
      }
    };
  }

  options.rules.forEach((rule) => {
    const inputElement = formElement.querySelector(rule.selector);
    if (inputElement) {
      // Xử lý khi blur ra ngoài
      inputElement.onblur = function () {
        validate(inputElement, rule);
      };
      // Xử lý khi người dùng nhập input
      inputElement.oninput = function () {
        const errorMessageText =
          inputElement.parentElement.querySelector(".form-message");
        errorMessageText.innerText = "";
        inputElement.parentElement.classList.remove("invalid");
      };
    }
  });
}
// Định nghĩa rules
Validator.isRequired = function (selector, message) {
  return {
    selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập họ và tên";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector,
    test: function (value) {
      const regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};

Validator.isPassword = function (selector, message) {
  return {
    selector,
    test: function (value) {
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      return regex.test(value)
        ? undefined
        : message ||
            "Mật khẩu 6-20 ký tự bao gồm chữ cái viết thường, chữ cái viết hoa và số ";
    },
  };
};

Validator.isConfirm = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị không chính xác";
    },
  };
};
