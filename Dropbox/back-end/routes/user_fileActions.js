var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');

router.post('/uploadFile',function(req,res,next){

    console.log(req.body);

    var filename = req.file.originalname;
    console.log(req.file);

    var docPath = req.file.destination;

    var owner = req.session.email;

});

router.post('/deleteFile',function(req,res,next){

    console.log(req.body);

    console.log(req.body.DocPath + " " +req.body.DocName + " " + req.session.username);

    var currentPath = req.body.DocPath;

    var fileName =  req.body.DocName;

    kafka.make_request('login_topic',{"service":"deleteFile","username": req.session.username,"fileName": fileName,"currentPath":currentPath}, function(err,results){
        console.log('in result of remove folder');
        console.log(results);
        if(err){
            console.log(err);
        }
        else
        {
            console.log("code"+results.code);

            if(parseInt(results.code) === 204){
                console.log("File deleted");
                return res.status(204).send();
            }
        }
    });


});

module.exports = router;