module.exports = (app) => {
    const song = require('../controllers/song.controller.js');

    app.post('/secure/song', song.create);

    app.get('/song', song.findAll);

    app.get('/song/toplist', song.findTopSongs);
    
    app.get('/song/:songId', song.findOne);

    app.get('/secure/smsongs', song.findAllSMSongs);

    app.put('/secure/song', song.update);

    app.put('/song/visibility/:songId/:value', song.updateVisibility);

    app.delete('/secure/song/:songId', song.delete);

    //secured apis
    app.get('/secure/song', song.findAllSecure);
}