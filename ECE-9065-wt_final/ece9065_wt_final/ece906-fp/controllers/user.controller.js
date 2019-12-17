const User = require('../models/user.model.js');
var mongoose = require('mongoose');
const jwtutil = require('../util/jwtutil.js');
exports.findAll = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    User.find({userType : {$nin: ["sitemanager"]}})
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

exports.grantPrivilegeToUsers = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    User.updateMany({_id : {$in: req.body.users}}, {$set : {"userType" : "sitemanager"}})
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the playlist"
        });
    });
}

exports.findOne = (req, res) => {
    User.findOne({ _id : mongoose.Types.ObjectId(req.params.userId)})
    .then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

exports.grantPrivilege = (req, res) => {
    User.updateOne({_id : mongoose.Types.ObjectId(req.params.userId)}, {$set : {"userType" : "sitemanager"}})
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the playlist"
        });
    });
}

exports.useractivation = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    User.updateOne({username : req.body.username}, {$set : {"accountType" : req.body.accountType}})
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the playlist"
        });
    });
}