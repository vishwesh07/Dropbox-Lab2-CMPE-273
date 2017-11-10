var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');

router.post('/',function(req,res,next){

    var star = req.body.Star;

    var DocName = req.body.DocName;

    var DocPath = req.body.DocPath;

    console.log("In StarUnstarDoc: "+ req.session.username);

    kafka.make_request('login_topic',{"service":"starUnstarDoc","username":req.session.username,"DocName": DocName,"DocPath":DocPath, "Star": star}, function(err,results){

        console.log("In response to kafka.make_request for starUnstarDoc service");

        console.log(results);

        if (err) {
            res.status(500).send({status: 500});
        }

        else
        {
            console.log("stars - code "+results.code);

            if(parseInt(results.code) === 204){

                res.status(204).send({status:204});

            }
        }

    });

});

module.exports = router;