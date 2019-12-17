module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    app.get('/secure/user', user.findAll);

    app.get('/user/:userId', user.findOne);

    app.put('/user/privilege/:userId', user.grantPrivilege);

    app.put('/secure/user/privilege', user.grantPrivilegeToUsers);

    app.put('/secure/user/activation', user.useractivation);
}