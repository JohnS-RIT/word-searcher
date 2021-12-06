const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const _ = require('underscore');

let WordModel = {};

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    default: 'example word',
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
});

WordSchema.statics.toAPI = (doc) => ({
  word: doc.word,
  definition: doc.definition,
  scrabbleScore: doc.scrabbleScore,
});

WordModel = mongoose.model('Word', WordSchema);

module.exports.WordModel = WordModel;
module.exports.WordSchema = WordSchema;
