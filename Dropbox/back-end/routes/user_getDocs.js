var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');

router.post('/', function (req, res, next) {

    console.log(req.body);

    var currentPath = req.body.currentPath;

    var username = req.session.username;

    console.log(req.session.username+" path: "+req.body.currentPath);

    req.session.currentPath = currentPath;

    kafka.make_request('login_topic',{"service":"getFiles","username":username,"currentPath":currentPath}, function(err,results){

        console.log("In response to kafka.make_request for getDocs service");

        console.log(results);

        if(err){
            console.log(err);
        }

        else
        {
            console.log("code"+results.code);

            console.log("Results"+results.data.docs);

            console.log(results.data.docs.length);

            if(parseInt(results.code) === 200){
                console.log("Files received");
                console.log("Docs - "+results.data.docs);
                return res.status(200).send({docArr: results.data.docs, status: 200});
            }
        }

    });

});

module.exports = router;