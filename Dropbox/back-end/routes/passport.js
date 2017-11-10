var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

module.exports = function(passport) {

    passport.use('signIn', new LocalStrategy(function(username , password, done) {

        console.log('in passport');

        kafka.make_request('login_topic',{"service":"signIn", "username":username,"password":password}, function(err,results){

            console.log("In response to kafka.make_request for signIn service");

            console.log(results);

            if(err){
                done(err,{});
            }

            else
            {
                console.log("In passport "+results.code+" "+ results.value);
                done(null,results);
            }

        });

    }));

};


