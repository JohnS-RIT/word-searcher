const models = require('../models');

const { Account } = models;

// Render login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Delete session, send to homepage
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// POST new best score to account
const pushScore = (req, res) => {
  Account.AccountModel.findByUserName(req.session.account.username, (err, doc) => {
    doc.bestScore = `${req.body.score}`;

    const savePromise = doc.save();

    savePromise.then(() => {
      res.json({
        _id: doc._id,
        username: doc.username,
        salt: doc.salt,
        password: doc.password,
        bestScore: doc.bestScore,
      });
    });

    savePromise.catch((error) => res.status(500).json({ error }));
  });
};

// GET current best score of account
const getScore = (req, res) => {
  Account.AccountModel.findByUserName(req.session.account.username, (err, doc) => {
    res.json({ score: doc.bestScore });
  });
};

// Sleep for change password since has to wait for new hash to be generated before moving on
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Render change password page
const changePassPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Allow user to change password, checks to make sure its valid and authentic,
// then generates new salt and hash to post to account
const changePass = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  const newPassword = `${req.body.pass2}`;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // if missing fields
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Oops! Seems like you didn\'t fill out everything.' });
  }

  // if old and new passwords are the same
  if (req.body.pass === req.body.pass2) {
    return res.status(400).json({ error: 'Uh oh! Looks like the passwords are the same.' });
  }

  // Make sure account and old passsword line-up
  Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Uh oh! Seems like the username or password is wrong.' });
    }
    // get user based on username
    Account.AccountModel.findByUserName(username, (error, doc) => {
      // make new hash based on new password
      Account.AccountModel.generateHash(newPassword, (salt, hash) => {
        doc.password = hash;
        doc.salt = salt;

        sleep(500).then(() => {
          const savePromise = doc.save();

          savePromise.then(() => {
            res.json({
              _id: doc._id, username: doc.username, salt: doc.salt, password: doc.password,
            });
          });

          savePromise.catch((e) => res.status(500).json({ e }));
        });
      });
    });
    return false;
  });
  return false;
};

// Checks login, ensures everything is in good order
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!req.body.username || !req.body.pass) {
    return res.status(400).json({ error: 'Oops! Seems like you didn\'t fill out everything.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Uh oh! Seems like the username or password is wrong.' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/game' });
  });
};

// Checks sign up, ensures fields are correct
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Oops! Seems like you didn\'t fill out everything.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Uh oh! Looks like the passwords don\'t match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/game' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Sorry! That username is already in use.' });
      }

      return res.status(400).json({ error: 'Whoops! An error has occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.changePassPage = changePassPage;
module.exports.changePass = changePass;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.pushScore = pushScore;
module.exports.getScore = getScore;
module.exports.getToken = getToken;
