const shelljs = require('shelljs');
const path=require('path');
const mongo = require('./mongo');
const moment = require('moment-timezone');

const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};
    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In passport service");

    let userNotExists = true;

        mongo.connect(mongoURL, function () {
            console.log('Connected to mongo at: ' + mongoURL);
            const coll = mongo.collection('users');
            coll.findOne({username: data.data.username}, function (err, user) {

                if(err){
                    console.log(err);
                }

                console.log("before In find One userNotExists" + userNotExists);
                console.log("user details found from database" + data.data.firstname+ " "+ data.data.lastname);
                if (user) {
                    userNotExists = false;
                }
                console.log("after - In find One userNotExists " + userNotExists);
                if (userNotExists) {
                    console.log("In userNotExists " + userNotExists);
                    coll.insertOne({
                        Username: data.data.username,
                        Password: data.data.password,
                        Firstname: data.data.firstname,
                        Lastname: data.data.lastname,
                        Salt: data.data.salt,
                        TimeStamp: new Date(),
                        deleteFlag: 0
                    }, function (err, user) {
                        if (user.insertedCount === 1) {
                            res.code = "201";
                            res.value = "Success SignUp";
                            res.data = {username: user.username, firstname: user.firstname, lastname: user.lastname};

                            let d = new Date();
                            let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                            let day = days[d.getDay()];
                            let time = moment().tz("America/Los_Angeles").format();

                            const coll1 = mongo.collection('activity');

                            coll1.insertOne({
                                ActivityName: 'Signed Up',
                                DocName: '',
                                Username: data.data.username,
                                TimeStamp: day+" "+time,
                                deleteFlag: 0
                            }, function (err, user) {

                                if(err){
                                    console.log(err);
                                }

                                console.log("Activity inserted - signUp");

                            });

                            }

                        const uploadpath=path.resolve(__dirname,'../','public','upload');

                        console.log(uploadpath);

                        shelljs.mkdir(uploadpath+"/"+data.data.username);

                        console.log('after handle'+res);

                        let payloads = [
                            { topic: data.replyTo,
                                messages:JSON.stringify({
                                    correlationId:data.correlationId,
                                    data : res
                                }),
                                partition : 0
                            }
                        ];

                        callback(null,payloads);
                    });
                }
                else {
                    res.code = "401";
                    res.value = "User already exists";

                    console.log('after handle'+res);

                    let payloads = [
                        { topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];

                    callback(null,payloads);
                }
            });
        });
}

exports.handle_request = handle_request;