const Song = require('../models/song.model.js');
const Review = require('../models/review.model.js');
const jwtutil = require('../util/jwtutil.js');
var mongoose = require('mongoose');
exports.create = (req, res) => {
    console.log("Auth: " + req.headers.authorization);
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    try {
        req.body.createdByUser = response.userdata.userId;
        if(response.userdata.userType != "sitemanager") {
            console.log("not  a site manager");
            req.body.visibility = true;
        } else {
            console.log("is a site manager");
        }
        
        const song = new Song(req.body);
        console.log("song-> " + JSON.stringify(song));
        Song.findOne({"title" : req.body.title, "artist" : req.body.artist, "album" : req.body.album, "year" : req.body.year, "genre":req.body.genre}).then(data => {
            if(!data) {
                song.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Note."
                    }); 
                });
            } else {
                res.status(200).send({
                    message: "Song already exists"
                });
            }
            
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            }); 
        });
	  } catch (ex) {
        //if invalid token
        console.log("invalid token-> " + ex);
		return res.status(401).send({"msg":"Access denied." + ex});
      }
      
    
};

exports.findAll = (req, res) => {
    Song.find()
    .then(songs => {
        res.send(songs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving songs."
        });
    });
};

exports.findAllSecure = async (req, res) =>  {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    Song.find({"visibility":true})
    .then(songs => {
        res.send(songs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving songs."
        });
    });
};

exports.findTopSongs = (req, res) => {
    Review.aggregate(
        [
         {
            $group:
              {
                _id: "$songId",
                avgRating: { $sum: "$rating" }
              }
          },
          { $sort: { avgRating: -1 } }
        ]
    ).then(result => {
        var songIds = [];
        result.forEach(element => {
            songIds.push(mongoose.Types.ObjectId(element._id));
        });
       console.log(songIds);
       var query = [
        {$match: {_id: {$in: songIds}, visibility:true}},
        {$addFields: {"__order": {$indexOfArray: [songIds, "$_id" ]}}},
        {$sort: {"__order": 1}}
       ];
       Song.aggregate(query)
        .then(songs => {
            songs = songs.slice(0, 10);
            res.send(songs);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving songs."
            });
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving songs."
        });
    });
};

exports.findOne = (req, res) => {
    Song.findOne({
        _id: mongoose.Types.ObjectId(req.params.songId)
      }, function(err, result) {
        if(err) 
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving"
            });
        else
          res.status(200).send(result);
    });
};

exports.update = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    inputdata = req.body;
    req.body.updatedBy = response.userdata.userId;
    Song.update({
        _id: mongoose.Types.ObjectId(req.body._id)
      }, req.body).then(data => {
        res.send(inputdata);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the song"
        });
    });
};

exports.updateVisibility = (req, res) => {
    Song.updateOne({_id : mongoose.Types.ObjectId(req.params.songId)}, {$set : {"visibility" : req.params.value}})
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the song"
            });
        });
}

exports.delete = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    Song.deleteOne({
        _id: mongoose.Types.ObjectId(req.params.songId)
    }, function(err, result) {
        if(err) 
          res.status(500).send({
            message: err.message || "Some error occurred while deleting the song"
            });
        else
          res.status(200).send(result);
    });
};

exports.findAllSMSongs = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    Song.find()
    .then(songs => {
        res.send(songs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving songs."
        });
    });
};

