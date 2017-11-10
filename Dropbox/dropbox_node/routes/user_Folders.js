var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var fs = require('fs');
var shelljs = require('shelljs');
var path=require('path');

var email ;

router.post('/get', function (req, res, next) {

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
                docJSON.OwnerEmailId = result.OwnerEmailId;
                return docJSON;
            });

            console.log(docArr);

            res.status(200).send(docArr);

        }
    },getFiles);

});

module.exports = router;
