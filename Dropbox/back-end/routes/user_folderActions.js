var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');

router.post('/createFolder', function (req, res, next) {

    console.log(req.body.currentPath + " " +req.body.foldername);

    var currentPath = req.body.currentPath;

    var folderName =  req.body.foldername;

    if(req.body.foldername === "" || req.body.foldername === undefined || req.body.foldername === null){
        res.status(303).end();
    }

    else {

        kafka.make_request('login_topic',{"service":"createFolder","username": req.session.username,"folderName": folderName,"currentPath":currentPath}, function(err,results){
            console.log('in result of create folder');
            console.log(results);
            if(err){
                console.log(err);
            }
            else
            {
                console.log("code"+results.code);

                if(parseInt(results.code) === 201){
                    console.log("Folder created");
                    return res.status(201).send();
                }
                else {
                    console.log("Folder already exists.");
                    res.status(403).send();
                }
            }
        });

    }
});


router.post('/removeFolder',function(req,res,next){

    console.log(req.body);

    console.log(req.body.DocPath + " " +req.body.DocName + " " + req.session.username);

    var currentPath = req.body.DocPath;

    var folderName =  req.body.DocName;

    kafka.make_request('login_topic',{"service":"removeFolder","username": req.session.username,"folderName": folderName,"currentPath":currentPath}, function(err,results){
        console.log('in result of remove folder');
        console.log(results);
        if(err){
            console.log(err);
        }
        else
        {
            console.log("code"+results.code);

            if(parseInt(results.code) === 204){
                console.log("Folder removed");
                return res.status(204).send();
            }
        }
    });

});


module.exports = router;