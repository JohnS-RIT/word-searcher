let word, definition, csrfGlobal;
let rhyme, scrabbleScore;
let rhymeCheck = false;
let scrabbleCheck = false;
let guess = '';
let guessesMade = 0;
let currentScore = 0;
let fireworksCheck = false;
let storedScore = 0;

//Reset game vars and recall setup
const resetGame = () => {
    rhymeCheck = false;
    scrabbleCheck = false;
    guess = '';
    document.querySelector('#guess').value = '';
    guessesMade = 0;

    setup(csrfGlobal);
}

//Give hints, first scrabble score, then rhyme (which sometimes makes it reaaally easy so it's always second)
const giveHint = () => {
    if (!scrabbleCheck) {
        document.querySelector('#scrabble').innerHTML = "Scrabble Score: " + getScrabbleScore();
        scrabbleCheck = true;
    }
    else if (!rhymeCheck) {
        document.querySelector('#rhyme').innerHTML = "Rhymes with: " + rhyme;
        rhymeCheck = true;
    }
    else alert("Sorry! No more hints for this word :(");
};

//Get scrabble score for hint and to assign point award
const getScrabbleScore = () => {
    let wordArray = word.split('');
    scrabbleScore = 0;
    for (let i = 0; i < wordArray.length; i++) {
        let ltr = wordArray[i];
        if (ltr == 'a' || ltr == 'e' || ltr == 'i' || ltr == 'o' || ltr == 'u' || ltr == 'l' || ltr == 'n' || ltr == 's' || ltr == 't' || ltr == 'r') scrabbleScore++;
        else if (ltr == 'd' || ltr == 'g') scrabbleScore += 2;
        else if (ltr == 'b' || ltr == 'c' || ltr == 'm' || ltr == 'p') scrabbleScore += 3;
        else if (ltr == 'k') scrabbleScore += 5;
        else if (ltr == 'j' || ltr == 'x') scrabbleScore += 8;
        else if (ltr == 'q' || ltr == 'z') scrabbleScore += 10;
        else scrabbleScore += 4;
    }
    return scrabbleScore;
};

//Show scrabble tool tip
const showTooltip = () => {
    document.querySelector('.tooltip').style.visibility = 'visible';
};

//Hide scrabble tool tip
const hideTooltip = () => {
    document.querySelector('.tooltip').style.visibility = 'hidden';
};

//Send new best score to be save on user's account
const postScore = () => {
    let csrf = document.querySelector("#gameCsrf").value;

    sendAjax('POST', "/game", `score=${storedScore}&_csrf=${csrf}`);
};

//Super important function to let things kind of 'animate' and work in proper order
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Reveal answer, way it's done depends on whether they were right or not
const revealAnswer = (correct) => {
    let wordArray = word.split('');
    let blanks = document.querySelector('#blanks');
    let spacedWord = '';
    for (let i = 0; i < wordArray.length; i++) {
        spacedWord += wordArray[i];
        if (i != word.length - 1) {
            spacedWord += " ";
        }
    }

    if (!correct) blanks.style.color = "#8B0000";
    else blanks.style.color = "#008B00";
    blanks.innerHTML = spacedWord;

    //Begin resetting
    sleep(100).then(() => { document.querySelector('#definition').innerText = "Loading next word..." });
    sleep(2250).then(() => { resetGame(); });
    sleep(2255).then(() => {
        blanks.style.color = "#000";
        document.querySelector('#definition').innerText = `Random word: ${word}, definition: ${definition}`;
        document.querySelector('#scrabble').innerText = `Scrabble Score: ???`;
        document.querySelector('#rhyme').innerText = `Rhymes with: ???`;
    });
}

//Render fireworks gif
const Fireworks = (props) => {
    return (<div id="filler" onClick={function () {
        document.querySelector("#filler").style.display = "none";
    }}>
        <img id="fireworksImg" src="/assets/fireworks.gif" />
    </div>
    );
};

//Adjust score after a correct guess
const setScoreboard = () => {
    currentScore += getScrabbleScore(); //get scrabble score to use as word's score
    if (currentScore > storedScore) { //change best score if lower than current
        storedScore = currentScore;
        postScore();
    }
    //Update the scoreboard
    document.querySelector("#score").innerHTML = `Score: ${currentScore}`;
    document.querySelector("#best").innerHTML = `Best: ${storedScore}`;

    //Give the user some celebratory fireworks if they get over 50 points (current score total) and haven't had any this session
    if (currentScore > 50 && !fireworksCheck) {
        fireworksCheck = true;
        ReactDOM.render(
            <Fireworks />, document.querySelector("#gifPlaceholder")
        );

        document.querySelector("#filler").style.display = "flex";
    }
}

//Check guess, compare to answer and act accordingly
const checkGuess = () => {
    guess = document.querySelector('#guess').value;
    guess.toLowerCase();

    //If not guess (blank) is amde
    if (guess == '') {
        alert("Please enter a valid guess");
    }
    //If guess is wrong
    else if (guess !== word) {
        guessesMade++;
        //If this is first or second wrong guess
        if (guessesMade < 3) {
            document.querySelector('#guess').value = '';

            let blanks = document.querySelector("#blanks");
            let blanksText = blanks.innerText;//'';
            let blanksX = '';

            for (let i = 0; i < word.length; i++) {
                blanksX += "x";
                if (i != word.length - 1) {
                    blanksX += " ";
                }
            }

            //Blink word blanks to show answer was wrong visually
            blanks.style.color = "#8B0000";
            blanks.innerHTML = blanksX;
            sleep(200).then(() => {
                blanks.style.color = "#000";
                blanks.innerHTML = blanksText;
            });
            sleep(400).then(() => {
                blanks.style.color = "#8B0000";
                blanks.innerHTML = blanksX;
            });
            sleep(600).then(() => {
                blanks.style.color = "#000";
                blanks.innerHTML = blanksText;
            });
        }
    }
    else { //If guess is right
        setScoreboard(); //Add points
        revealAnswer(true);
    }

    if (guessesMade >= 3) { //If 3 failed guesses are made, move on
        revealAnswer(false);
    }
}

//create instructions modal
const Modal = (props) => {
    return (
        <div id="instructions" onClick={function () {
            document.querySelector("#instructions").style.display = "none";
        }}>
            <div className="modal-content">
                <span className="close" onClick={function () {
                    document.querySelector("#instructions").style.display = "none";
                }}>&times;</span>
                <h3>Welcome!</h3>
                <ul>
                    <li>Look at the definition and try to guess the word.</li>
                    <li>You get three guesses per word, so make them count!</li>
                    <li>If you need help, try asking for a hint or two!</li>
                    <li>Points are awarded based on the word's scrabble score</li>
                    <li><i>Tip:</i> Hover over the scrabble score to find out what each letter is worth.</li>
                    <li>Most importantly, have fun :)</li>
                </ul>
            </div>
        </div>
    );
};

//Create music element
const Music = (props) => {
    return (
        <audio id="audio">
            <source src="/assets/bensound-littleidea.mp3" type="audio/mpeg" />
        </audio>
    );
};

//Set up render of instructions modal
const openInstructions = () => {
    ReactDOM.render(
        <Modal />, document.querySelector("#instructPlaceholder")
    );

    document.querySelector("#instructions").style.display = "block";
};

//Set up render of music component
const changeMusic = () => {
    let checked = document.querySelector("#musicCheckbox").checked;

    if (checked) {
        ReactDOM.render(
            <Music />, document.querySelector("#audioPlaceholder")
        );
        document.querySelector("audio").play();
    }
    else document.querySelector("audio").pause();
};

//Set up game board, manage number of blanks based on word length
const Game = (props) => {
    let blanks = "";

    for (let i = 0; i < word.length; i++) {
        blanks += "_";
        if (i != word.length - 1) {
            blanks += " ";
        }
    }

    return (
        <div id="game">
            <div id="game-board">
                <h3 id="definition">{definition}</h3>
                <h1 id="blanks">{blanks}</h1>
                <h4 id="scrabble" onMouseOver={showTooltip} onMouseLeave={hideTooltip}>Scrabble Score: ???</h4>
                <span className="tooltip"><img id="scrabblePoints" src="/assets/Scrabble-Letters.jpg" alt="Scrabble letters with points" /></span>
                <h4 id="rhyme">Rhymes with: ???</h4>
            </div>
            <div id="game-controls">
                <div id="guessForm">
                    <input id="guess" name="guess" placeholder="Enter Guess Here" autoFocus onKeyPress={function (e) {
                        if (e.key == 'Enter') checkGuess();
                    }} />
                    <input id="gameCsrf" type="hidden" name="_csrf" value={props.csrf} />
                    <button id="submitBtn" onClick={checkGuess}>Guess</button>
                </div>
                <button id="hintBtn" onClick={giveHint}>Hint</button>
                <button id="instructionBtn" onClick={openInstructions}>Instructions</button>
                <h4 id="score">Score: {currentScore}</h4>
                <h4 id="best">Best: {storedScore}</h4>
            </div>
            <nav>
                <label id="checkboxLabel" htmlFor="checkbox">Music?: </label>
                <input type="checkbox" name="checkbox" id="musicCheckbox" onChange={changeMusic} />
                <div className="navlink">
                    <a href="/logout">Log Out</a>
                </div>
            </nav>
        </div>
    );
};

//Get definitions from wordnik
const dataLoaded = (e) => {
    let xhr = e.target;
    let wordDefinitions = JSON.parse(xhr.responseText);
    let check = false;
    for (let i = 0; i < 10; i++) {
        //Try-catch to get definition, had to be done because of how the JSON from wordnik is formatted
        //Essentially the first 'defintion' for a word doesn't 'always' actually have to have text, so I ask for 10 to be safe, and the first with text is used
        try {
            if (!check) {
                definition = wordDefinitions[i].text
                if (definition != undefined) {
                    check = true;
                }
            }
        }
        catch {
        }
    }

    ReactDOM.render(
        <Game csrf={csrfGlobal} />, document.querySelector("#center")
    );
};

const dataError = (e) => {
    console.log("An error occurred");
};

//Create left ad
const LeftAd = (props) => {
    return (
        <img className="ad" src="/assets/ad.jpg" alt="advertisement placeholder" />
    );
};

//Create right ad
const RightAd = (props) => {
    return (
        <img className="ad" src="/assets/ad.jpg" alt="advertisement placeholder" />
    );
};

//Set up game board and data
const setup = function (csrf) {
    //Get word and it's list of rhymes
    word = RiTa.randomWord();
    let rhymeList = RiTa.rhymes(word);
    rhyme = rhymeList[Math.floor(Math.random() * rhymeList.length)];

    //Keep getting words if no rhymes are available
    while (rhyme == undefined) {
        word = RiTa.randomWord();
        rhymeList = RiTa.rhymes(word);
        rhyme = rhymeList[Math.floor(Math.random() * rhymeList.length)];
    }

    //Set up url for wordnik api
    const apiKey = "https://api.wordnik.com/v4/word.json/";
    let url = apiKey;
    url += word;
    url += "/definitions?api_key=tddgj4huom33f0x1mqx30jxd37w4qiddqvn92teu3h3egv650&limit=10";

    /*
    ~~DISABLE FOR TESTING PURPOSES~~
    */
    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;
    xhr.open("GET", url);
    xhr.send();

    console.log("Current word: " + word);   //Log of current word to make grading/testing easier

    /*
    ~~ENABLE FOR TESTING PURPOSES~~
    
    //Wordnik (free) has a low call limit

    definition = word + " definition";
    */

    //Render 3 components to make up web page (probably only counts as 2 for requirements since ads are essentially the same)
    ReactDOM.render(
        <Game csrf={csrfGlobal} />, document.querySelector("#center")
    );

    ReactDOM.render(
        <LeftAd />, document.querySelector("#left")
    );

    ReactDOM.render(
        <RightAd />, document.querySelector("#right")
    );
};

//Call and get csrf token, then proceed to set up
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfGlobal = result.csrfToken;
        setup(result.csrfToken);
    });
};

//Immediately get best previous score for account, then get token as well
//~~~SEE IMPORTANT CONSOLE.LOG BELOW~~
$(document).ready(function () {
    console.log("For grading purposes, there are console logs of the words for when wordnik hits call limit for definitions, would have to pay for premium otherwise.")
    sendAjax('GET', '/score', `score=${storedScore}`, (data) => {
        storedScore = data.score;
        getToken();
    });
});