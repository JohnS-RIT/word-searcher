const gamePage = (req, res) => res.render('app', { csrfToken: req.csrfToken() }); // , word: docs });

module.exports.gamePage = gamePage;
