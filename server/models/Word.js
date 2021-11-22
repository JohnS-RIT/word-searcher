const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const _ = require('underscore');

let WordModel = {};

// const convertID = mongoose.Types.ObjectId;
// const setWord = (word) => _.escape(word).trim();

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    default: 'example word',
    // set: setWord,
  },

  definition: {
    type: String,
    required: true,
    trim: true,
    default: 'example definition',
  },

  scrabbleScore: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  /*
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    default: 'example account',
  },
  */
});

WordSchema.statics.toAPI = (doc) => ({
  word: doc.word,
  definition: doc.definition,
  scrabbleScore: doc.scrabbleScore,
});
/*
WordSchema.statics.findWord = (callback) => {
  const search = {
    owner: convertID('example account'),
  };
  return WordModel.select(search).select('word definition scrabbleScore').lean().exec(callback);
};
*/

WordModel = mongoose.model('Word', WordSchema);

module.exports.WordModel = WordModel;
module.exports.WordSchema = WordSchema;
