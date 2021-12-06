"use strict";

//If the user tries to login
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#blurbMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val == '') {
    handleError("Oops! Seems like you didn\'t fill out everything.");
    return false;
  } //console.log($("input[name=_csrf]").val());
  //Try logging in


  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; //If the user tries to sign up, ensures that passwords match


var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#blurbMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Oops! Seems like you didn\'t fill out everything.");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Uh oh! Looks like the passwords don\'t match.");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
}; //If the user tries to change passwords


var handleChangePass = function handleChangePass(e) {
  e.preventDefault();
  $("#blurbMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Oops! Seems like you didn\'t fill out everything.");
    return false;
  }

  if ($("#pass").val() == $("#pass2").val()) {
    handleError("Uh oh! Looks like the passwords are the same.");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  return false;
}; //Create login window


var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "content-box"
  }, /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Log In"
  })), /*#__PURE__*/React.createElement("h3", null, "--OR--"), /*#__PURE__*/React.createElement("button", {
    id: "button1",
    value: "signup",
    href: "/signup"
  }, "Sign Up"), /*#__PURE__*/React.createElement("button", {
    id: "button2",
    value: "change",
    href: "/changePassword"
  }, "Change Password"));
}; //Create sign up window


var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "content-box"
  }, /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up"
  })), /*#__PURE__*/React.createElement("h3", null, "--OR--"), /*#__PURE__*/React.createElement("button", {
    id: "button1",
    value: "login",
    href: "/login"
  }, "Log In"), /*#__PURE__*/React.createElement("button", {
    id: "button2",
    value: "change",
    href: "/changePassword"
  }, "Change Password"));
}; //Create change password window


var ChangePassWindow = function ChangePassWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "content-box"
  }, /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handleChangePass,
    action: "/changePassword",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "changePassBtn",
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  })), /*#__PURE__*/React.createElement("h3", null, "--OR--"), /*#__PURE__*/React.createElement("button", {
    id: "button1",
    value: "login",
    href: "/login"
  }, "Log In"), /*#__PURE__*/React.createElement("button", {
    id: "button2",
    value: "signup",
    href: "/signup"
  }, "Sign Up"));
}; //render change password winow


var createChangePassWindow = function createChangePassWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassWindow, {
    csrf: csrf
  }), document.querySelector(".content")); //All the ifs shouldn't be necessary except on createloginwindow, but the buttons were acting finicky and this resolved it

  var button1 = document.querySelector("#button1");
  var button2 = document.querySelector("#button2");

  if (button1.value === "signup") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createSignupWindow(csrf);
      return false;
    });
  }

  if (button1.value === "login") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  }

  if (button1.value === "change") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createChangePassWindow(csrf);
      return false;
    });
  }

  if (button2.value === "signup") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createSignupWindow(csrf);
      return false;
    });
  }

  if (button2.value === "login") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  }

  if (button2.value === "change") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createChangePassWindow(csrf);
      return false;
    });
  }
}; //render login window, start with this and based on buttons change to proper window to render


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector(".content"));
  var button1 = document.querySelector("#button1");
  var button2 = document.querySelector("#button2");

  if (button1.value === "signup") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createSignupWindow(csrf);
      return false;
    });
  }

  if (button1.value === "login") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  }

  if (button1.value === "change") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createChangePassWindow(csrf);
      return false;
    });
  }

  if (button2.value === "signup") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createSignupWindow(csrf);
      return false;
    });
  }

  if (button2.value === "login") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  }

  if (button2.value === "change") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createChangePassWindow(csrf);
      return false;
    });
  }
}; //render signup window


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector(".content")); //All the ifs shouldn't be necessary except on createloginwindow, but the buttons were acting finicky and this resolved it

  var button1 = document.querySelector("#button1");
  var button2 = document.querySelector("#button2");

  if (button1.value === "signup") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createSignupWindow(csrf);
      return false;
    });
  }

  if (button1.value === "login") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  }

  if (button1.value === "change") {
    button1.addEventListener("click", function (e) {
      e.preventDefault();
      createChangePassWindow(csrf);
      return false;
    });
  }

  if (button2.value === "signup") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createSignupWindow(csrf);
      return false;
    });
  }

  if (button2.value === "login") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  }

  if (button2.value === "change") {
    button2.addEventListener("click", function (e) {
      e.preventDefault();
      createChangePassWindow(csrf);
      return false;
    });
  }
}; //Set up by trying to render login window


var setup = function setup(csrf) {
  createLoginWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

//If errors, show message
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#blurbMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#blurbMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
