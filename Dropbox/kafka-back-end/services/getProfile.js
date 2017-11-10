const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In get profile service");

    let profileArr = [];

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        const coll = mongo.collection('profile');
        coll.findOne({Username: data.data.username}, function (err, profile) {

            if (err) {
                throw err;
            }
            else {

                console.log(profile.length);

                profileArr.Username = profile.Username;
                profileArr.Overview = profile.Overview;
                profileArr.Work = profile.Work;
                profileArr.Education = profile.Education;
                profileArr.ContactNumber = profile.ContactNumber;
                profileArr.TimeStamp = profile.TimeStamp;
                profileArr.deleteFlag = profile.deleteFlag;

                console.log(profileArr);

                console.log('after handle' + res);

                res.code = "200";
                res.value = "Profile returned";
                res.data = {profile: profileArr};

                let payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];

                callback(null, payloads);

            }
        });
    });

}

exports.handle_request = handle_request;