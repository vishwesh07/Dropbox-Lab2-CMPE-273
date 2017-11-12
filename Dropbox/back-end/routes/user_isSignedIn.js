var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    console.log("In isSignedIn req.session.username "+req.session.username);

    if(req.session.username !== "" && req.session.username !== undefined && req.session.username !== null){

        res.status(200).send({status:200});

    }

    else{

        res.status(401).send({status: 401});

    }

});

module.exports = router;
