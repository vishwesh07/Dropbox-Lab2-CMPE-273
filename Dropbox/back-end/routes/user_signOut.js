var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');

router.get('/', function(req,res) {

    console.log("In SignOut: "+ req.session.username);

    kafka.make_request('login_topic',{"service":"signOut","username":req.session.username}, function(err,results){

        console.log("In response to kafka.make_request for signOut service");

        console.log(results);

        if (err) {
            res.status(500).send({status: 500});
        }

        else
        {
            console.log("code"+results.code);

            if(parseInt(results.code) === 200){
                console.log("In signOut :");
                console.log(req.session.username);
                req.session.destroy();
                console.log('Session Destroyed');
                res.status(200).send({status:200});
            }
        }

    });


});

module.exports = router;