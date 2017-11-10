var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/', function(req, res) {

    passport.authenticate('signIn', function (err, result) {

        console.log("In signIn "+result.code);

        if (err) {
            res.status(500).send({status: 500});
        }

        else if (parseInt(result.code) === 401) {
            res.status(401).send({status: 401});
        }

        else if (parseInt(result.code) === 201){
            console.log("code"+result.code);
            req.session.username = result.data.username;
            console.log(req.session.username);
            console.log("session initilized");
            console.log(result.data.username + " " + result.data.firstname + " " + result.data.lastname);
            result.data.status = 201;
            return res.status(201).send({
                username: result.data.username,
                firstname: result.data.firstname,
                lastname: result.data.lastname,
                status: 201
            });
        }

    })(req, res);

});

module.exports = router;