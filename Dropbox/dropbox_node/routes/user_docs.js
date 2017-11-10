var express = require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('./mysql');
var shelljs = require('shelljs');
var fs = require('fs');
var glob = require('glob');

var email ;
var changeDestination ;
// ============================== FILE Actions ====================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("In Multer Storage : changeDestination = "+changeDestination);
        cb(null,changeDestination)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({storage:storage});

router.post('/upload',upload.single('myfile'), function (req, res, next) {

    console.log(req.body);

    console.log(req.file);

    console.log(req.file.destination);

    var t = false;

    var getFiles="SELECT * FROM documents WHERE DocName='"+req.file.originalname+"' AND DocPath='"+req.file.destination+"'";

    mysql.dbOperation(function(err,results) {
        if (err) {
            throw err;
        }
        else {
            //Check if folder already exists or not.
            if (results.length > 0) {

                console.log("Similar file already exists.");

                //Send message: "User already exists" back as response and render message variable.
                t = true;
                res.status(304).end();
            }

        }
    },getFiles);

    if(!t){

        var insertFileDetails="INSERT INTO documents (DocName, DocType, DocPath, OwnerEmailId) VALUES ('" + req.file.originalname +"' , 'file' , '"+ req.file.destination +"' , '"+ req.session.email + "')";

        console.log("Query is:"+insertFileDetails);

        mysql.dbOperation(function(err,results){

            if(err){
                throw err;
            }

            else
            {
                res.status(204).end();
            }
        },insertFileDetails);

        var activityQuery = "INSERT INTO user_activity (ActivityName, FileName, EmailId) VALUES ('Upload' , '"+ req.file.originalname +"' , '"+ req.session.email +"')";

        mysql.dbOperation(function(err,results){
            if(err){
                throw err;
            }
            else {
                console.log("Activity added from File - upload");
            }
        },activityQuery);

    }

});

router.post('/starUnstarDoc', function (req, res, next) {

   var star = req.body.star;

   var docName = req.body.DocName;

   var docPath = req.body.DocPath;

    var getStarDetail="SELECT Star FROM documents WHERE DocName='"+docName+"' AND DocPath='"+docPath+"'";

    mysql.dbOperation(function(err,results) {
        if (err) {
            throw err;
        }
        else {
            //Check currentStatus of document.
            if (results.length > 0) {

                var currentStar = results[0].Star;
                var newStar;

                console.log("Current status of star is : "+currentStar);

                if(currentStar === 0){
                    newStar = 1;
                }
                else{
                    newStar = 0;
                }

                var changeStarDetail="UPDATE documents SET Star = '"+newStar+"' WHERE DocName ='"+ docName +" ' AND DocPath='"+docPath+"'";

                // UPDATE Customers
                // SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
                // WHERE CustomerID = 1;

                mysql.dbOperation(function(err,results) {
                    if (err) {
                        throw err;
                    }
                    else {

                        console.log("Star stuatus udated to "+newStar+" from "+currentStar);

                        res.status(200).end();

                    }
                },changeStarDetail);
            }
        }
    },getStarDetail);

    var activityQuery = "INSERT INTO user_activity (ActivityName, FileName, EmailId) VALUES ('Star' , '"+ docName +"' , '"+ req.session.email +"')";

    mysql.dbOperation(function(err,results){
        if(err){
            throw err;
        }
        else {
            console.log("Activity added from File - star/unstar");
        }
    },activityQuery);

});

// File Delete - Additional
router.post('/delete', function (req, res, next) {

    var filePath = req.body.DocPath;

    var fileName = req.body.DocName;

    console.log(filePath+"/"+fileName);

    shelljs.rm(filePath+"/"+fileName);

    var deleteFileDetails= "DELETE FROM documents WHERE DocName='"+ fileName +"' AND DocPath='"+filePath+"'";

    console.log("Query is:"+deleteFileDetails);

    mysql.dbOperation(function(err,results){

        if(err){
            throw err;
        }

        else
        {
            res.status(204).end();
        }
    },deleteFileDetails);

    // File delete => delete
    var activityQuery = "INSERT INTO user_activity (ActivityName, FileName, EmailId) VALUES ('delete' , '"+ fileName +"' , '"+ req.session.email +"')";

    mysql.dbOperation(function(err,results){
        if(err){
            throw err;
        }
        else {
            console.log("Activity added from File - delete");
        }
    },activityQuery);

});


// ============================== FOLDER Actions ====================================

router.post('/create', function (req, res, next) {

    console.log(req.body.currentPath + " " +req.body.foldername);

    var currentPath = req.body.currentPath;

    var folderName =  req.body.foldername;

    var e,t = false;

    if(req.body.foldername === "" || req.body.foldername === undefined || req.body.foldername === null){
        e = true;
        res.status(303).end();
    }

    else{

        console.log("In Folder else");

        var getFolders="SELECT * FROM documents WHERE DocName='"+folderName+"' AND DocPath='"+currentPath+"'";

        mysql.dbOperation(function(err,results) {
            if (err) {
                throw err;
            }
            else {
                //Check if folder already exists or not.
                if (results.length > 0) {

                    console.log("Similar folder already exists.");

                    //Send message: "User already exists" back as response and render message variable.
                    t = true;
                    res.status(304).end();
                }

            }
        },getFolders);

        if(!e && !t){

            shelljs.mkdir(currentPath+"/"+folderName);

            var insertFolderDetails="INSERT INTO documents (DocName, DocType, DocPath, OwnerEmailId) VALUES ('" + folderName +"' , 'folder' , '"+ currentPath +"' , '"+ req.session.email + "')";

            console.log("Query is:"+insertFolderDetails);

            mysql.dbOperation(function(err,results){

                if(err){
                    throw err;
                }

                else
                {
                    res.status(204).end();
                }
            },insertFolderDetails);

            var activityQuery = "INSERT INTO user_activity (ActivityName, FileName, EmailId) VALUES ('create' , '"+ folderName +"' , '"+ req.session.email +"')";

            mysql.dbOperation(function(err,results){
                if(err){
                    throw err;
                }
                else {
                    console.log("Activity added from Folder - create");
                }
            },activityQuery);
        }

    }

});

// Folder delete - Additional - Partial
router.post('/remove', function (req, res, next) {

    var folderPath = req.body.DocPath;

    var folderName = req.body.DocName;

    console.log(folderPath+folderName);

    shelljs.rm('-r',folderPath+folderName);

    var deleteFolderDetails= "DELETE FROM documents WHERE DocPath LIKE '"+folderPath+folderName+"%' OR DocPath='"+folderPath+"' AND DocName='"+folderName+"'";

    console.log("Query is:"+deleteFolderDetails);

    mysql.dbOperation(function(err,results){

        if(err){
            throw err;
        }

        else
        {
            res.status(204).end();
        }
    },deleteFolderDetails);

    // Folder delete => remove
    var activityQuery = "INSERT INTO user_activity (ActivityName, FileName, EmailId) VALUES ('remove' , '"+ folderName +"' , '"+ req.session.email +"')";

    mysql.dbOperation(function(err,results){
        if(err){
            throw err;
        }
        else {
            console.log("Activity added from Folder - remove");
        }
    },activityQuery);

});


// ============================== FILE - FOLDER Action ====================================

router.post('/get', function (req, res, next) {

    console.log(req.body);

    var currentPath = req.body.currentPath;

    changeDestination = req.body.currentPath;

    var docArr = [];

    var getFiles=" SELECT * FROM documents WHERE DocPath='"+currentPath+"'";

    mysql.dbOperation(function(err,results) {
        if (err) {
            throw err;
        }
        else {

            console.log(results.length);

            docArr = results.map(function (result) {
                var docJSON = {};
                docJSON.DocName = result.DocName;
                docJSON.DocType = result.DocType;
                docJSON.DocPath = result.DocPath;
                docJSON.Star = result.Star;
                docJSON.OwnerEmailId = result.OwnerEmailId;
                return docJSON;
            });

            console.log(docArr);

            res.status(200).send(docArr);

        }
    },getFiles);

});

// -------------------------------- Testing Function ------------------------

router.post('/getUsers', function (req, res, next) {

    var currentPath = req.body.currentPath;

    var docArr = [];

    var getFiles=" SELECT * FROM documents WHERE DocPath='"+currentPath+"'";

    mysql.dbOperation(function(err,results) {
        if (err) {
            throw err;
        }
        else {

            console.log(results.length);

            docArr = results.map(function (result) {
                var docJSON = {};
                docJSON.DocName = result.DocName;
                docJSON.DocType = result.DocType;
                docJSON.DocPath = result.DocPath;
                docJSON.Star = result.Star;
                docJSON.OwnerEmailId = result.OwnerEmailId;
                return docJSON;
            });

            console.log(docArr);

            res.status(200).send(docArr);

        }
    },getFiles);

});

router.get('/upload/Mils@gmail.com/K-F-P.jpg', function(req, res) {
    res.sendFile('public/upload/Mils@gmail.com/K-F-P.jpg')
})

module.exports = router;
