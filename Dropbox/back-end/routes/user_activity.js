var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');

router.post('/',function(req,res,next){

    kafka.make_request('login_topic',{"service":"getActivity","username":req.session.username}, function(err,results){

        console.log("In response to kafka.make_request for activity service");

        console.log(results);

        if(err){
            console.log(err);
        }

        else
        {
            console.log("code"+results.code);

            console.log("Results"+results.data.activityArr);

            if(parseInt(results.code) === 200){
                console.log("Activities received");
                return res.status(200).send({activityArr: results.data.activityArr, status: 200});
            }
        }

    });

});

module.exports = router;