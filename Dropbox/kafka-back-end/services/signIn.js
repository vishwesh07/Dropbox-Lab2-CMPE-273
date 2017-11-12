const bcrypt = require('bcrypt');
const mongo = require('./mongo');
const moment = require('moment-timezone');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback){

    let res = {};

    console.log("In handle request:"+ JSON.stringify(data.data));

    mongo.connect(mongoURL, function(){

        console.log('Connected to mongo at: ' + mongoURL);

        const coll = mongo.collection('users');

        console.log("Username in SignIn "+data.data.username);

        console.log("In passport collection defined"+coll);

        coll.findOne({Username: data.data.username}, function(err, user){

            if (user) {

                let b = bcrypt.compareSync(data.data.password, user.Password);

                if(b){
                    console.log("In successful signIn");
                    res.code = "201";
                    res.value = "Success signIn";
                    res.data = {username: data.data.username, firstname: user.Firstname, lastname: user.Lastname};

                    let d = new Date();
                    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    let day = days[d.getDay()];
                    let time = moment().tz("America/Los_Angeles").format();

                    console.log(`day ${day} - time ${time} `);

                    const coll1 = mongo.collection('activity');

                    coll1.insertOne({
                        ActivityName: 'Signed In',
                        DocName: '',
                        Username: data.data.username,
                        TimeStamp: day+" "+time,
                        deleteFlag: 0
                    }, function (err, user) {

                        if(err){
                            console.log(err);
                        }

                        console.log("Activity inserted - signIn");

                    });

                    console.log('after handle'+res);

                    const payloads = [
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

                else{

                    console.log("In failed signIn");
                    res.code = "401";
                    res.value = "Username and / or Password is wrong.";

                    console.log('after handle'+res);

                    const payloads = [
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

            }

            else {

                console.log("In failed signIn");
                res.code = "401";
                res.value = "User with given user name doesn't exists.";

                console.log('after handle'+res);

                const payloads = [
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