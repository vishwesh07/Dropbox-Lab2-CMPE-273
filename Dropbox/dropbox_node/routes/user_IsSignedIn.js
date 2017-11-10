var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

        if(req.session.email !== "" && req.session.email !== undefined && req.session.email !== null){

            console.log(req.session.username);

            res.status(304).send({username: req.session.username, email: req.session.email});

        }

        else{

            res.status(401).send();

        }

});

module.exports = router;


