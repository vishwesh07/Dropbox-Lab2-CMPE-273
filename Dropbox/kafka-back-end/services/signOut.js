const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback){

    let res = {};

    console.log("In handle request:"+ JSON.stringify(data.data));

    mongo.connect(mongoURL, function() {

        console.log('Connected to mongo at: ' + mongoURL);

        const coll1 = mongo.collection('activity');

        coll1.insertOne({
            ActivityName: 'SignOut',
            DocName: '',
            Username: data.data.username,
            TimeStamp: new Date(),
            deleteFlag: 0
        }, function (err, user) {

            if(err){
                console.log(err);
            }

            console.log("Activity inserted - signOut");

        });

        res.code = "200";
        res.value = "Success signOut";

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

    });

}

exports.handle_request = handle_request;