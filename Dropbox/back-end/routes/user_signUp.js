var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
var bcrypt = require('bcrypt');

router.post('/', function(req, res) {

    console.log("In signUp :");

    console.log(req.body.userData.email+" "+req.body.userData.password+" "+req.body.userData.firstName+" "+req.body.userData.lastName);

    var salt = bcrypt.genSaltSync(10);

    var passwordHash = bcrypt.hashSync(req.body.userData.password, salt);

    kafka.make_request('login_topic',{"service":"signUp","username":req.body.userData.email,"password":passwordHash, "firstname":req.body.userData.firstName, "lastname": req.body.userData.lastName, "salt":salt}, function(err,results){

        console.log("In response to kafka.make_request for signUp service");

        console.log(results);

        if (err) {
            res.status(500).send({status: 500});
        }

        else
        {
            console.log("code"+results.code);

            if(parseInt(results.code) === 201){
                req.session.username = req.body.userData.email;
                console.log(req.session.username+"\n");
                console.log("session initilized");
                return res.status(201).send({username: req.body.userData.firstName, email: req.body.userData.email, status: 201});
            }
            else {
                res.status(403).send({status: 403});
            }
        }

    });

});

module.exports = router;
