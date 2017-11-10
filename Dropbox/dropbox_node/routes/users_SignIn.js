var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var bcrypt = require("bcrypt");

router.post('/', function(req, res, next) {

    console.log(req.body);

    var hash;
    var email = req.body.userData.email;
    var password = req.body.userData.password;

    if(email === '' || password === '' ){
        return res.status(303).send({status:303});
    }

    var getUser=" SELECT FirstName,Password FROM users WHERE EmailId='"+email+"'";

    console.log("Query is:"+getUser);

    var message;

    mysql.dbOperation(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            console.log(results.length);

            if(results.length === 1){

                hash =  results[0].Password;

                var b = bcrypt.compareSync(password, hash);

                //Assigning the session
                req.session.email = email;
                req.session.username = results[0].FirstName;

                console.log("Session initialized from SignIn");


                if(b){

                    message = "valid SignIn";

                    console.log(req.session);

                    var activityQuery = "INSERT INTO user_activity (ActivityName, EmailId) VALUES ('Signed In' , '"+ email +"')";

                    mysql.dbOperation(function(err,results){
                        if(err){
                            throw err;
                        }
                        else {
                            console.log("Activity added from Sign In");
                        }
                    },activityQuery);

                    return res.status(200).json({status: 200, username:  req.session.username , email: req.session.email});

                }
                else{
                    return res.status(401).json({status: 401});
                }


            }
            else {

                message = "Invalid SignIn";

                console.log(message);

                // req.session.destroy();

                return res.status(401).json({status: 401});

                // return res.status(401).send();

            }
        }
    },getUser);

});

module.exports = router;


