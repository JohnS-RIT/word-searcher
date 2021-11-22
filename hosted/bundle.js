"use strict";

var Game = function Game(props) {
  var word = RiTa.randomWord();
  var blanks = "";

  for (var i = 0; i < word.length; i++) {
    blanks += "_";

    if (i != word.length - 1) {
      blanks += " ";
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    id: "game"
  }, /*#__PURE__*/React.createElement("div", {
    id: "game-board"
  }, /*#__PURE__*/React.createElement("h4", {
    id: "definition"
  }, "Random word: ", word, " (placeholder for definition hint which I will pull from wordnik api (words themselves are from RiTa.js, might make words and definitions from wordnik but it's been finicky in the past)"), /*#__PURE__*/React.createElement("h1", {
    id: "blanks"
  }, blanks), /*#__PURE__*/React.createElement("h4", {
    id: "scrabble"
  }, "Scrabble Score: ???"), /*#__PURE__*/React.createElement("h4", {
    id: "rhyme"
  }, "Rhymes With: ???")), /*#__PURE__*/React.createElement("div", {
    id: "game-controls"
  }, /*#__PURE__*/React.createElement("form", {
    id: "guessForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "guess",
    name: "guess",
    placeholder: "Enter Guess Here"
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Submit"
  })), /*#__PURE__*/React.createElement("button", {
    id: "hintBtn"
  }, "Hint"), /*#__PURE__*/React.createElement("button", {
    id: "instructionBtn"
  }, "Instructions"), /*#__PURE__*/React.createElement("h4", {
    id: "score"
  }, "Score: 0"), /*#__PURE__*/React.createElement("h4", {
    id: "best"
  }, "Best: 0")), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/logout"
  }, "Log out"))));
};

var LeftAd = function LeftAd(props) {
  return /*#__PURE__*/React.createElement("img", {
    className: "ad",
    src: "/assets/ad.jpg",
    alt: "advertisement placeholder"
  });
};

var RightAd = function RightAd(props) {
  return /*#__PURE__*/React.createElement("img", {
    className: "ad",
    src: "/assets/ad.jpg",
    alt: "advertisement placeholder"
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Game, {
    csrf: csrf
  }), document.querySelector("#center"));
  ReactDOM.render( /*#__PURE__*/React.createElement(LeftAd, null), document.querySelector("#left"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RightAd, null), document.querySelector("#right"));
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
