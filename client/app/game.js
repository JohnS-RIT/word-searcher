const Game = (props) => {
    let word = RiTa.randomWord();
    let blanks = "";
    for(let i = 0; i < word.length; i++){
        blanks+="_";
        if (i != word.length - 1){
            blanks+=" ";
        }
    }
    return (
        <div id="game">
            <div id="game-board">
                <h4 id="definition">Random word: {word} (placeholder for definition hint which I will pull from wordnik api (words themselves are from RiTa.js, might make words and definitions from wordnik but it's been finicky in the past)</h4>
                <h1 id="blanks">{blanks}</h1>
                <h4 id="scrabble">Scrabble Score: ???</h4>
                <h4 id="rhyme">Rhymes With: ???</h4>
            </div>
            <div id="game-controls">
                <form id="guessForm">
                    <input id="guess" name="guess" placeholder="Enter Guess Here" />
                    <input type="submit" value="Submit" />
                </form>
                <button id="hintBtn">Hint</button>
                <button id="instructionBtn">Instructions</button>
                <h4 id="score">Score: 0</h4>
                <h4 id="best">Best: 0</h4>
            </div>
            <nav>
                <div className="navlink"><a href="/logout">Log out</a></div>
            </nav>
        </div>
    );
};

const LeftAd = (props) => {
    return (
        <img className="ad" src="/assets/ad.jpg" alt="advertisement placeholder" />
    );
}

const RightAd = (props) => {
    return (
        <img className="ad" src="/assets/ad.jpg" alt="advertisement placeholder" />
    );
}

const setup = function (csrf) {
    ReactDOM.render(
        <Game csrf={csrf} />, document.querySelector("#center")
    );

    ReactDOM.render(
        <LeftAd />, document.querySelector("#left")
    );

    ReactDOM.render(
        <RightAd />, document.querySelector("#right")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});