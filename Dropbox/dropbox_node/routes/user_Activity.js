var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

router.post('/', function(req, res, next) {

    console.log(req.body);

    var email = req.body.email;

    var getUserActivity=" SELECT TOP 10 * FROM user_activity WHERE EmailId='"+email+"' ORDER BY TimeStamp DESC";

    console.log("Query is:"+getUserActivity);

    var activityArr = [];

    mysql.dbOperation(function(err,results){

        if(err){
            throw err;
        }
        else
        {
            activityArr = results.map(function (result) {
                var activityJSON = {};
                activityJSON.ActivityName = result.ActivityName;
                activityJSON.FileName = result.FileName;
                activityJSON.TimeStamp = result.TimeStamp;
                activityJSON.EmailId = result.EmailId;
                return activityJSON;
            });

            console.log(activityArr);

            var activityQuery = "INSERT INTO user_activity (ActivityName, EmailId) VALUES ('checked Activity' , '"+ email +"')";

            mysql.dbOperation(function(err,results){

                if(err){
                    throw err;
                }
                else {
                    console.log("Activity added from activity.");
                }

            },activityQuery);

        }

    },getUserActivity);

    res.status(200).send(activityArr);

});

module.exports = router;