// const models = require('../models');

// const { Word } = models;

const gamePage = (req, res) => res.render('app', { csrfToken: req.csrfToken() }); // , word: docs });
/*
  Word.WordModel.findWord('example account', (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), word: docs });
  });
  */
/*
const makeGuess = (req, res) => {
  const wordData = {
    word: req.body.word,
    definition: req.body.definition,
    scrabbleScore: req.body.scrabbleScore,
  };

  const newWord = new Word.WordModel(wordData);

  const wordPromise = newWord.save();

  wordPromise.then(() => res.json({ redirect: '/game' }));

  wordPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  });

  return wordPromise;
};

const getWord = (request, response) => {
  const req = request;
  const res = response;

  return res.json({ word: docs });
};
*/
module.exports.gamePage = gamePage;
// module.exports.getWord = getWord;
// module.exports.makeGuess = makeGuess;
