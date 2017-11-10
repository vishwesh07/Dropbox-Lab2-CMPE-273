var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

    var userWantedToAccessPage = req.body.userData.email;

    console.log(" req.session.username "+req.session.username+" userWantedToAccessPage: "+userWantedToAccessPage);

    if(req.session.username !== "" && req.session.username !== undefined && req.session.username !== null){

        if(req.session.username === userWantedToAccessPage){

            console.log(" In 200 of isSignedIn");

            res.status(200).send({status:200});

        }

        else{

            console.log(" In 401 of isSignedIn");

            res.status(401).send({status:401});

        }

    }

    else{

        res.status(401).send();

    }

});

module.exports = router;
