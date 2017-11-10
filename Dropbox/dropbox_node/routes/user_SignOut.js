var express = require('express');
var mysql = require("./mysql");
var router = express.Router();

router.get('/', function(req, res, next) {

    var message;

    var activityQuery = "INSERT INTO user_activity (ActivityName, EmailId) VALUES ('Signed Out' , '"+ req.session.email +"')";

    mysql.dbOperation(function(err,results){
        if(err){
            throw err;
        }
        else {
            console.log("Activity added from Sign out");
        }
    },activityQuery);

    //Reset the session
    req.session.destroy();

    console.log("Session destroyed from SignOut");

    message = "successful SignOut";

    console.log(message);

    return res.json({status:304, message: message});

});

module.exports = router;


