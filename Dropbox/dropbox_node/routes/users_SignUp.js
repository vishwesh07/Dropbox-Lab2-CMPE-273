var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var bcrypt = require('bcrypt');
var shelljs = require('shelljs');
var path=require('path');

router.post('/SignUp', function(req, res, next) {

    var email = req.body.userData.email;
    var firstName = req.body.userData.firstName;
    var lastName = req.body.userData.lastName;
    var password = req.body.userData.password;

    console.log("email"+email);

    if(email === '' || firstName === '' || lastName === '' || password === '' ){
        return res.status(303).send({status:303});
    }

    var getUser="SELECT * FROM users WHERE EmailId='"+email+"'";

    mysql.dbOperation(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            //Check if user already exists or not.
            if(results.length > 0){

                var message = "This email is already taken.";

                console.log(message);

                //Send message: "User already exists" back as response and render message variable.
                return res.json({status:401, message: message});

            }

            //If user doesn't exists in database then insert user data in database.
            else {

                var salt = bcrypt.genSaltSync(10);

                var hash = bcrypt.hashSync(password, salt);

                var setUser="INSERT INTO users (FirstName, LastName, EmailId, Password, Salt) VALUES ('" + firstName +"' , '"+ lastName +"' , '"+ email +"' , '"+ hash +"' , '"+salt+ "')";

                var uploadpath=path.resolve(__dirname,'../','public','upload');

                console.log(uploadpath);

                shelljs.mkdir(uploadpath+"/"+email);

                console.log("Valid SignUp");

                mysql.dbOperation(function(err,results){

                    if(err){
                        throw err;
                    }

                    else
                    {

                        //Assigning the session
                        req.session.email = email;
                        req.session.username = firstName;

                        console.log("Session initialized from SignUp");

                        var message = "Successful Sign up";

                        var activityQuery = "INSERT INTO user_activity (ActivityName, EmailId) VALUES ('Signed Up' , '"+ email +"')";

                        mysql.dbOperation(function(err,results){
                            if(err){
                                throw err;
                            }
                            else {
                                console.log("Activity added from Sign Up");
                            }
                        },activityQuery);

                        return res.json({status: 200, username: req.session.username , email: req.session.email});
                    }
                },setUser);
            }
        }
    },getUser);

});

module.exports = router;
