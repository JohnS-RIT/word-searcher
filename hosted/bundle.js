"use strict";

var word, definition, csrfGlobal;
var rhyme, scrabbleScore;
var rhymeCheck = false;
var scrabbleCheck = false;
var guess = '';
var guessesMade = 0;
var currentScore = 0;
var fireworksCheck = false;
var storedScore = 0; //Reset game vars and recall setup

var resetGame = function resetGame() {
  rhymeCheck = false;
  scrabbleCheck = false;
  guess = '';
  document.querySelector('#guess').value = '';
  guessesMade = 0;
  setup(csrfGlobal);
}; //Give hints, first scrabble score, then rhyme (which sometimes makes it reaaally easy so it's always second)


var giveHint = function giveHint() {
  if (!scrabbleCheck) {
    document.querySelector('#scrabble').innerHTML = "Scrabble Score: " + getScrabbleScore();
    scrabbleCheck = true;
  } else if (!rhymeCheck) {
    document.querySelector('#rhyme').innerHTML = "Rhymes with: " + rhyme;
    rhymeCheck = true;
  } else alert("Sorry! No more hints for this word :(");
}; //Get scrabble score for hint and to assign point award


var getScrabbleScore = function getScrabbleScore() {
  var wordArray = word.split('');
  scrabbleScore = 0;

  for (var i = 0; i < wordArray.length; i++) {
    var ltr = wordArray[i];
    if (ltr == 'a' || ltr == 'e' || ltr == 'i' || ltr == 'o' || ltr == 'u' || ltr == 'l' || ltr == 'n' || ltr == 's' || ltr == 't' || ltr == 'r') scrabbleScore++;else if (ltr == 'd' || ltr == 'g') scrabbleScore += 2;else if (ltr == 'b' || ltr == 'c' || ltr == 'm' || ltr == 'p') scrabbleScore += 3;else if (ltr == 'k') scrabbleScore += 5;else if (ltr == 'j' || ltr == 'x') scrabbleScore += 8;else if (ltr == 'q' || ltr == 'z') scrabbleScore += 10;else scrabbleScore += 4;
  }

  return scrabbleScore;
}; //Show scrabble tool tip


var showTooltip = function showTooltip() {
  document.querySelector('.tooltip').style.visibility = 'visible';
}; //Hide scrabble tool tip


var hideTooltip = function hideTooltip() {
  document.querySelector('.tooltip').style.visibility = 'hidden';
}; //Send new best score to be save on user's account


var postScore = function postScore() {
  var csrf = document.querySelector("#gameCsrf").value;
  sendAjax('POST', "/game", "score=".concat(storedScore, "&_csrf=").concat(csrf));
}; //Super important function to let things kind of 'animate' and work in proper order


var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}; //Reveal answer, way it's done depends on whether they were right or not


var revealAnswer = function revealAnswer(correct) {
  var wordArray = word.split('');
  var blanks = document.querySelector('#blanks');
  var spacedWord = '';

  for (var i = 0; i < wordArray.length; i++) {
    spacedWord += wordArray[i];

    if (i != word.length - 1) {
      spacedWord += " ";
    }
  }

  if (!correct) blanks.style.color = "#8B0000";else blanks.style.color = "#008B00";
  blanks.innerHTML = spacedWord; //Begin resetting

  sleep(100).then(function () {
    document.querySelector('#definition').innerText = "Loading next word...";
  });
  sleep(2250).then(function () {
    resetGame();
  });
  sleep(2255).then(function () {
    blanks.style.color = "#000";
    document.querySelector('#definition').innerText = "Random word: ".concat(word, ", definition: ").concat(definition);
    document.querySelector('#scrabble').innerText = "Scrabble Score: ???";
    document.querySelector('#rhyme').innerText = "Rhymes with: ???";
  });
}; //Render fireworks gif


var Fireworks = function Fireworks(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "filler",
    onClick: function onClick() {
      document.querySelector("#filler").style.display = "none";
    }
  }, /*#__PURE__*/React.createElement("img", {
    id: "fireworksImg",
    src: "/assets/fireworks.gif"
  }));
}; //Adjust score after a correct guess


var setScoreboard = function setScoreboard() {
  currentScore += getScrabbleScore(); //get scrabble score to use as word's score

  if (currentScore > storedScore) {
    //change best score if lower than current
    storedScore = currentScore;
    postScore();
  } //Update the scoreboard


  document.querySelector("#score").innerHTML = "Score: ".concat(currentScore);
  document.querySelector("#best").innerHTML = "Best: ".concat(storedScore); //Give the user some celebratory fireworks if they get over 50 points (current score total) and haven't had any this session

  if (currentScore > 50 && !fireworksCheck) {
    fireworksCheck = true;
    ReactDOM.render( /*#__PURE__*/React.createElement(Fireworks, null), document.querySelector("#gifPlaceholder"));
    document.querySelector("#filler").style.display = "flex";
  }
}; //Check guess, compare to answer and act accordingly


var checkGuess = function checkGuess() {
  guess = document.querySelector('#guess').value;
  guess.toLowerCase(); //If not guess (blank) is amde

  if (guess == '') {
    alert("Please enter a valid guess");
  } //If guess is wrong
  else if (guess !== word) {
    guessesMade++; //If this is first or second wrong guess

    if (guessesMade < 3) {
      document.querySelector('#guess').value = '';
      var blanks = document.querySelector("#blanks");
      var blanksText = blanks.innerText; //'';

      var blanksX = '';

      for (var i = 0; i < word.length; i++) {
        blanksX += "x";

        if (i != word.length - 1) {
          blanksX += " ";
        }
      } //Blink word blanks to show answer was wrong visually


      blanks.style.color = "#8B0000";
      blanks.innerHTML = blanksX;
      sleep(200).then(function () {
        blanks.style.color = "#000";
        blanks.innerHTML = blanksText;
      });
      sleep(400).then(function () {
        blanks.style.color = "#8B0000";
        blanks.innerHTML = blanksX;
      });
      sleep(600).then(function () {
        blanks.style.color = "#000";
        blanks.innerHTML = blanksText;
      });
    }
  } else {
    //If guess is right
    setScoreboard(); //Add points

    revealAnswer(true);
  }

  if (guessesMade >= 3) {
    //If 3 failed guesses are made, move on
    revealAnswer(false);
  }
}; //create instructions modal


var Modal = function Modal(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "instructions",
    onClick: function onClick() {
      document.querySelector("#instructions").style.display = "none";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: function onClick() {
      document.querySelector("#instructions").style.display = "none";
    }
  }, "\xD7"), /*#__PURE__*/React.createElement("h3", null, "Welcome!"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Look at the definition and try to guess the word."), /*#__PURE__*/React.createElement("li", null, "You get three guesses per word, so make them count!"), /*#__PURE__*/React.createElement("li", null, "If you need help, try asking for a hint or two!"), /*#__PURE__*/React.createElement("li", null, "Points are awarded based on the word's scrabble score"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", null, "Tip:"), " Hover over the scrabble score to find out what each letter is worth."), /*#__PURE__*/React.createElement("li", null, "Most importantly, have fun :)"))));
}; //Create music element


var Music = function Music(props) {
  return /*#__PURE__*/React.createElement("audio", {
    id: "audio"
  }, /*#__PURE__*/React.createElement("source", {
    src: "/assets/bensound-littleidea.mp3",
    type: "audio/mpeg"
  }));
}; //Set up render of instructions modal


var openInstructions = function openInstructions() {
  ReactDOM.render( /*#__PURE__*/React.createElement(Modal, null), document.querySelector("#instructPlaceholder"));
  document.querySelector("#instructions").style.display = "block";
}; //Set up render of music component


var changeMusic = function changeMusic() {
  var checked = document.querySelector("#musicCheckbox").checked;

  if (checked) {
    ReactDOM.render( /*#__PURE__*/React.createElement(Music, null), document.querySelector("#audioPlaceholder"));
    document.querySelector("audio").play();
  } else document.querySelector("audio").pause();
}; //Set up game board, manage number of blanks based on word length


var Game = function Game(props) {
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
  }, /*#__PURE__*/React.createElement("h3", {
    id: "definition"
  }, definition), /*#__PURE__*/React.createElement("h1", {
    id: "blanks"
  }, blanks), /*#__PURE__*/React.createElement("h4", {
    id: "scrabble",
    onMouseOver: showTooltip,
    onMouseLeave: hideTooltip
  }, "Scrabble Score: ???"), /*#__PURE__*/React.createElement("span", {
    className: "tooltip"
  }, /*#__PURE__*/React.createElement("img", {
    id: "scrabblePoints",
    src: "/assets/Scrabble-Letters.jpg",
    alt: "Scrabble letters with points"
  })), /*#__PURE__*/React.createElement("h4", {
    id: "rhyme"
  }, "Rhymes with: ???")), /*#__PURE__*/React.createElement("div", {
    id: "game-controls"
  }, /*#__PURE__*/React.createElement("div", {
    id: "guessForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "guess",
    name: "guess",
    placeholder: "Enter Guess Here",
    autoFocus: true,
    onKeyPress: function onKeyPress(e) {
      if (e.key == 'Enter') checkGuess();
    }
  }), /*#__PURE__*/React.createElement("input", {
    id: "gameCsrf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("button", {
    id: "submitBtn",
    onClick: checkGuess
  }, "Guess")), /*#__PURE__*/React.createElement("button", {
    id: "hintBtn",
    onClick: giveHint
  }, "Hint"), /*#__PURE__*/React.createElement("button", {
    id: "instructionBtn",
    onClick: openInstructions
  }, "Instructions"), /*#__PURE__*/React.createElement("h4", {
    id: "score"
  }, "Score: ", currentScore), /*#__PURE__*/React.createElement("h4", {
    id: "best"
  }, "Best: ", storedScore)), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("label", {
    id: "checkboxLabel",
    htmlFor: "checkbox"
  }, "Music?: "), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: "checkbox",
    id: "musicCheckbox",
    onChange: changeMusic
  }), /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/logout"
  }, "Log Out"))));
}; //Get definitions from wordnik


var dataLoaded = function dataLoaded(e) {
  var xhr = e.target;
  var wordDefinitions = JSON.parse(xhr.responseText);
  var check = false;

  for (var i = 0; i < 10; i++) {
    //Try-catch to get definition, had to be done because of how the JSON from wordnik is formatted
    //Essentially the first 'defintion' for a word doesn't 'always' actually have to have text, so I ask for 10 to be safe, and the first with text is used
    try {
      if (!check) {
        definition = wordDefinitions[i].text;

        if (definition != undefined) {
          check = true;
        }
      }
    } catch (_unused) {}
  }

  ReactDOM.render( /*#__PURE__*/React.createElement(Game, {
    csrf: csrfGlobal
  }), document.querySelector("#center"));
};

var dataError = function dataError(e) {
  console.log("An error occurred");
}; //Create left ad


var LeftAd = function LeftAd(props) {
  return /*#__PURE__*/React.createElement("img", {
    className: "ad",
    src: "/assets/ad.jpg",
    alt: "advertisement placeholder"
  });
}; //Create right ad


var RightAd = function RightAd(props) {
  return /*#__PURE__*/React.createElement("img", {
    className: "ad",
    src: "/assets/ad.jpg",
    alt: "advertisement placeholder"
  });
}; //Set up game board and data


var setup = function setup(csrf) {
  //Get word and it's list of rhymes
  word = RiTa.randomWord();
  var rhymeList = RiTa.rhymes(word);
  rhyme = rhymeList[Math.floor(Math.random() * rhymeList.length)]; //Keep getting words if no rhymes are available

  while (rhyme == undefined) {
    word = RiTa.randomWord();
    rhymeList = RiTa.rhymes(word);
    rhyme = rhymeList[Math.floor(Math.random() * rhymeList.length)];
  } //Set up url for wordnik api


  var apiKey = "https://api.wordnik.com/v4/word.json/";
  var url = apiKey;
  url += word;
  url += "/definitions?api_key=tddgj4huom33f0x1mqx30jxd37w4qiddqvn92teu3h3egv650&limit=10";
  /*
  ~~DISABLE FOR TESTING PURPOSES~~
  */

  var xhr = new XMLHttpRequest();
  xhr.onload = dataLoaded;
  xhr.onerror = dataError;
  xhr.open("GET", url);
  xhr.send();
  console.log("Current word: " + word); //Log of current word to make grading/testing easier

  /*
  ~~ENABLE FOR TESTING PURPOSES~~
  
  //Wordnik (free) has a low call limit
    definition = word + " definition";
  */
  //Render 3 components to make up web page (probably only counts as 2 for requirements since ads are essentially the same)

  ReactDOM.render( /*#__PURE__*/React.createElement(Game, {
    csrf: csrfGlobal
  }), document.querySelector("#center"));
  ReactDOM.render( /*#__PURE__*/React.createElement(LeftAd, null), document.querySelector("#left"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RightAd, null), document.querySelector("#right"));
}; //Call and get csrf token, then proceed to set up


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    csrfGlobal = result.csrfToken;
    setup(result.csrfToken);
  });
}; //Immediately get best previous score for account, then get token as well
//~~~SEE IMPORTANT CONSOLE.LOG BELOW~~


$(document).ready(function () {
  console.log("For grading purposes, there are console logs of the words for when wordnik hits call limit for definitions, would have to pay for premium otherwise.");
  sendAjax('GET', '/score', "score=".concat(storedScore), function (data) {
    storedScore = data.score;
    getToken();
  });
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
