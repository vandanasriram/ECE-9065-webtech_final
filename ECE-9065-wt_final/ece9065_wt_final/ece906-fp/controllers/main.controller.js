const User = require('../models/user.model.js');
const googleUtil = require('../google-util.js');
const jwtutil = require('../util/jwtutil.js');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const argon2 = require('argon2');
const saltRounds = 10000;
const keylength = 512;
const alg = 'sha512';

const secret = process.env.JWT_KEY; 
if (typeof secret === 'undefined') { 
	console.log("Please set secret as environment variable. E.g. JWT_KEY=\"Open Sesame\" node index");
	process.exit(1);
}

exports.getGoogleUrl = (req, res) => {
    console.log("googleUtil " + googleUtil);
    var googleUrl = googleUtil.urlGoogle();
    res.status(200).send({"url" : googleUrl});
}

exports.createuserViaGoogle = async (req, res) => {
    var userDetails;
    if(req.query.code) {
        userDetails = await googleUtil.getGoogleAccountFromCode(req.query.code);
        User.findOne({
            username: userDetails.email
          }).then(data => {
            console.log(data);
            if(data){
                console.log("userDetails -> " + JSON.stringify(userDetails));
                let payload = {
                    "username" : data.username,
                    "name" : data.username,
                    "accountType": data.accountType,
                    "emailVerified": data.emailVerified,
                    "userType": data.userType,
                    "signUpMethod": data.signUpMethod,
                    "userId": data._id
                }; 
                let token = jwt.sign(payload, secret);	
                console.log('token: ' + token);
                //res.status(200).send({"statusCode":200,"token" : userDetails.tokens.id_token});
                res.status(200).redirect("http://localhost:4200/signin?token="+token);
            }
            else {
                var userObj = {
                    "username" : userDetails.email,
                    "name" : userDetails.email,
                    "accountType": "activated",
                    "emailVerified": true,
                    "userType": "ordinary",
                    "signUpMethod": "email"
                };
                const user = new User(userObj);
                console.log(user);
                user.save()
                .then(data => {
                    userObj.userId = data._id;
                    let token = jwt.sign(userObj, secret);
                    //res.status(200).send({"statusCode":200,"result":data, "token" : token});
                    console.log("userDetails -> " + JSON.stringify(userDetails));
                    res.redirect("http://localhost:4200/user/landing?token="+token);
                }).catch(err => {
                    res.status(500).send({
                    msg: err.message || "Some error occurred while creating the user."
                });
            });
            }
        }).catch(err => {
            res.status(500).send({
                msg: err.message || "Some error occurred while creating the user."
            });
        });

        
        //res.status(200).send({"userDetails" : userDetails});
    };
}

exports.register = (req, res) => {
    User.findOne({
        username: req.body.username
      }).then(async data =>  {
        console.log(data);
        if(data)
            res.status(200).send({"statusCode":200,"msg" : "Username already exists"});
        else {
            let salt = crypto.randomBytes(16).toString('hex');
            const hash = await argon2.hash(req.body.password, salt);
		    //let hash = crypto.pbkdf2Sync(req.body.password, salt, saltRounds, keylength, alg).toString('hex');
            var userObj = {
                "username" : req.body.username,
                "password" : hash,
                //"salt" : salt,
                "accountType": "activated",
                "emailVerified": false,
                "userType": "ordinary",
                "signUpMethod": "general",
                "name" : req.body.name
            };
            const user = new User(userObj);
            console.log(user);
            user.save()
            .then(data => {
                console.log("user data->. " + JSON.stringify(data));
                userObj.userId = data._id;
                let token = jwt.sign(userObj, secret);
                res.status(200).send({"statusCode":200,"result":data, "token" : token});
            }).catch(err => {
                res.status(500).send({
                msg: err.message || "Some error occurred while creating the user."
            });
        });
        }
    }).catch(err => {
        res.status(500).send({
            msg: err.message || "Some error occurred while creating the user."
        });
    });
};

exports.userVerification = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    User.updateOne({_id : mongoose.Types.ObjectId(response.userdata.userId)}, {"emailVerified" : true})
        .then(data => {
            res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the playlist"
        });
    });
}

exports.login = (req, res) => {
    console.log("request-> " + JSON.stringify(req.body));
    User.findOne({
        username: req.body.username
      }).then(async data => {
        console.log(data);
        if(!data)
            res.status(200).send({"statusCode": 400,"msg" : "Username does not exists"});
        else if(data.accountType == "deactivated") {
            res.status(200).send({"statusCode": 400,"msg" : "Your account is deactivated. Contact site manager."});
        }
        else {
            //deactivated or not check
            //const hash = crypto.pbkdf2Sync(req.body.password, data.salt, saltRounds, keylength, alg).toString('hex');
            if (await argon2.verify(data.password, req.body.password)) { 
                console.log("data->" + data);
                let payload = {
                    "username" : data.username,
                    "accountType": data.accountType,
                    "emailVerified": data.emailVerified,
                    "userType": data.userType,
                    "signUpMethod": data.signUpMethod,
                    "userId": data._id
                }; 
                let token = jwt.sign(payload, secret);	
                console.log('token: ' + token);
                res.status(200).send({"statusCode": 200,"msg" : "Login is successful", "token" : token});						
            }
            else {
                res.status(200).send({"statusCode": 401,"msg" : "Access denied for " + data.username + ". Check your username/password. "});
                console.log('Hashes don\'t match');
            }
        } 
        
    }).catch(err => {
        console.log("error occurred-> " + err);
        res.status(500).send({
            msg: err.message || "Some error occurred while creating the user."
        });
    });
};