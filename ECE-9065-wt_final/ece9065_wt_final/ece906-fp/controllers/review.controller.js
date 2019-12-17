const Review = require('../models/review.model.js');
const jwtutil = require('../util/jwtutil.js');
exports.findBySongId = (req, res) => {
    Review.find({"songId" : req.params.songId}).sort({createdAt : -1})
    .then(reviews => {
        res.send(reviews);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving reviews"
        });
    });
};

exports.create = (req, res) => {
    response = jwtutil.jwtverify(req, res);
    if(! response.valid ) {
        return res.status(401).send({"msg":response.msg});
    }
    console.log("response data -> " + JSON.stringify(response));
    req.body.userId = response.userdata.userId;
    const review = new Review(req.body);
    review.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};
