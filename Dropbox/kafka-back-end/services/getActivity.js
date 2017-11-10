const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In get Activities service");

    let activityArr = [];

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        const coll = mongo.collection('activity');
        coll.find({Username: data.data.username}).limit(15).toArray(function (err, activities) {

            if (err) {
                throw err;
            }
            else {

                console.log(activities.length);

                activityArr = activities.map(function (activity) {
                    let activityJSON = {};
                    activityJSON.DocName = activity.ActivityName;
                    activityJSON.DocType = activity.DocName;
                    activityJSON.Username = activity.Username;
                    activityJSON.TimeStamp = activity.TimeStamp;
                    return activityJSON;
                });

                console.log(activityArr);

                console.log('after handle' + res);

                res.code = "200";
                res.value = "Activities returned";
                res.data = {activityArr: activityArr};

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