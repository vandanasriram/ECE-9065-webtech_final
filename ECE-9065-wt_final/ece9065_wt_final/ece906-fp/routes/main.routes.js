module.exports = (app) => {
    const main = require('../controllers/main.controller.js');

    app.get('/google/url', main.getGoogleUrl);

    app.get('/google/redirect', main.createuserViaGoogle);

    app.post('/login', main.login);

    app.post('/register', main.register);

    app.get('/secure/user/verification', main.userVerification);
}