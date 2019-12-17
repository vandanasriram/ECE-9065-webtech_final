const Playlist = require('../models/playlist.model.js');
var mongoose = require('mongoose');
const jwtutil = require('../util/jwtutil.js');

exports.findAll = (req, res) => {
    Playlist.find()
    .then(playlist => {
        res.send(playlist);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving playlists"
        });
    });
};

exports.findUserPlaylists = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    Playlist.find({"userId" : response.userdata.userId})
    .then(playlist => {
        res.send(playlist);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving playlists"
        });
    });
}

exports.findOtherUserPlaylists = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    Playlist.find({ "userId": {$nin : [response.userdata.userId]}, "visibility" : "public"})
    .then(playlist => {
        res.send(playlist);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving playlists"
        });
    });
}

exports.create = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    req.body.userId = response.userdata.userId;
    const playlist = new Playlist(req.body);
    playlist.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the playlist"
        });
    });
};

exports.update = (req, res) => {
    var updateObj = {};
    if(req.body.title) {
        updateObj.title = req.body.title;
    }
    if(req.body.description) {
        updateObj.description = req.body.description;
    }
    if(req.body.visibility) {
        updateObj.visibility = req.body.visibility;
    }
    if(req.body.songs) {
        updateObj.songs = req.body.songs;
    }
    if(req.body.userId) {
        updateObj.userId = req.body.userId;
    }
    if(req.body._id) {
        updateObj._id = req.body._id;
    }
    console.log("req-> " + JSON.stringify(req.body));
    Playlist.updateOne({_id : mongoose.Types.ObjectId(req.body._id)}, {$set : updateObj})
        .then(data => {
            console.log('updatebj ->' + JSON.stringify(updateObj));
            Playlist.findOne({ _id: mongoose.Types.ObjectId(req.body._id)})
                .then(playlist => {
                    res.send(playlist);
                }).catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while retrieving playlist"
                });
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the playlist"
        });
    });
};

exports.addSongs = (req, res) => {
    Playlist.findOne({_id : mongoose.Types.ObjectId(req.body._id)})
    .then(playlist => {
        var updatedSongs;
        if(playlist.songs) {
            updatedSongs = playlist.songs.concat(req.body.songs);
        } else {
            updatedSongs = req.body.songs;
        }
        console.log("updated " + updatedSongs);
        Playlist.updateOne({_id : mongoose.Types.ObjectId(req.body._id)}, {$set : {"songs" : updatedSongs}})
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the playlist"
            });
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving playlists"
        });
    });
}

exports.removeSongs = (req, res) => {
    Playlist.findOne({_id : mongoose.Types.ObjectId(req.params.playlistid)})
    .then(playlist => {
        var updatedSongs;
        var currentSongs = playlist.songs;
        if(currentSongs) {
            updatedSongs = currentSongs.filter(item => item != req.params.songid);
        } else {
            return;
        }
        console.log("updated " + updatedSongs);
        Playlist.updateOne({_id : mongoose.Types.ObjectId(req.params.playlistid)}, {$set : {"songs" : updatedSongs}})
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the playlist"
            });
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving playlists"
        });
    });
};

exports.delete = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    Playlist.deleteOne({
        _id: mongoose.Types.ObjectId(req.params.playlistId)
    }, function(err, result) {
        if(err) 
          res.status(500).send({
            message: err.message || "Some error occurred while deleting the playlist"
            });
        else
          res.status(200).send(result);
    });
};

exports.findSMPlaylists = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    Playlist.find()
    .then(playlist => {
        res.send(playlist);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving playlists"
        });
    });
};