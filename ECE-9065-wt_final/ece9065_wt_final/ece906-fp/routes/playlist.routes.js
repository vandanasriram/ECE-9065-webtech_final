module.exports = (app) => {
    const playlist = require('../controllers/playlist.controller.js');

    app.get('/playlist', playlist.findAll);

    app.get('/secure/smplaylists', playlist.findSMPlaylists);

    app.get('/secure/playlists', playlist.findUserPlaylists);

    app.get('/secure/playlists/others', playlist.findOtherUserPlaylists);

    app.post('/secure/playlist', playlist.create);

    app.put('/secure/playlist', playlist.update);

    app.put('/playlist/song', playlist.addSongs);

    app.delete('/playlist/:playlistid/song/:songid', playlist.removeSongs);

    app.delete('/secure/playlist/:playlistId', playlist.delete);
}