var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
var Busboy = require('busboy');

router.post('/uploadFile',function(req,res,next){

    console.log("In Upload File");

    var username = req.session.username;

    var currentPath = req.session.currentPath;

    var busboy = new Busboy({headers: req.headers});

    var fileChunk = ' ';

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

        console.log(encoding);
        console.log(mimetype);
        console.log(fieldname);
        console.log(filename);

        file.on('data', function (data) {

            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');

            fileChunk += new Buffer(data, 'utf8');
        });

        console.log(typeof fileChunk+" username "+username+" currentPath "+currentPath+" filename "+filename);

        file.on('end', function () {

            console.log('File [' + fieldname + '] got data completely');
            kafka.make_request('login_topic',{"service":"uploadFile","username":username,"currentPath":currentPath,"filename":filename,"fileChunk":fileChunk}, function (err, result) {
                console.log(err);
                console.log(result.code);

                if (err) {
                    res.status(500).send();
                }
                else {
                    if(result.code === "204"){
                        res.status(204).send({status:204});
                    }
                    else{
                        res.status(403).send({status:403});
                    }


                }
            });
        });
    });

    req.pipe(busboy);

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