const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/changePassword', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePassPage);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePass);
  app.get('/game', mid.requiresLogin, controllers.Word.gamePage);
  app.post('/game', mid.requiresLogin, controllers.Account.pushScore);
  app.get('/score', mid.requiresLogin, controllers.Account.getScore);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresLogin, controllers.Word.gamePage);
};

module.exports = router;
