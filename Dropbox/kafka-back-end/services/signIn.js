const bcrypt = require('bcrypt');
const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback){

    let res = {};

    console.log("In handle request:"+ JSON.stringify(data.data));

    mongo.connect(mongoURL, function(){

        console.log('Connected to mongo at: ' + mongoURL);
        const coll = mongo.collection('users');
        console.log("In passport collection defined"+coll);

        coll.findOne({Username: data.data.username}, function(err, user){

            if (user) {

                let b = bcrypt.compareSync(data.data.password, user.Password);

                if(b){
                    console.log("In successful signIn");
                    res.code = "201";
                    res.value = "Success signIn";
                    res.data = {username: user.Username, firstname: user.Firstname, lastname: user.Lastname};

                    const coll1 = mongo.collection('activity');

                    coll1.insertOne({
                        ActivityName: 'SignIn',
                        DocName: '',
                        Username: user.Username,
                        TimeStamp: new Date(),
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