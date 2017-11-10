const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In file star-unstar service");

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        let coll = mongo.collection('documents');

        coll.find({DocName: data.data.DocName,DocPath: data.data.DocPath}).toArray(function (err, doc) {

            if (err) {
                throw err;
            }

            else {

                if (doc) {

                    let currentStar = data.data.Star;
                    let newStar;

                    console.log("Current status of star is : " + currentStar);

                    if (currentStar === 0) {
                        newStar = 1;
                    }
                    else {
                        newStar = 0;
                    }

                    try {
                        coll.updateOne(
                            {DocName: data.data.DocName, DocPath: data.data.DocPath},
                            {$set: {Star: newStar}}
                        );
                    } catch (e) {
                        console.log(e);
                    }

                    console.log("Star status updated to " + newStar + " from " + currentStar);

                    console.log('after handle' + res);

                    const coll1 = mongo.collection('activity');

                    coll1.insertOne({
                        ActivityName: 'starUnstarFile',
                        DocName: data.data.DocName,
                        Username: data.data.username,
                        TimeStamp: new Date(),
                        deleteFlag: 0
                    }, function (err, user) {

                        if (err) {
                            console.log(err);
                        }

                        console.log("Activity inserted - starUnstarFile");

                    });

                    res.code = "204";
                    res.value = "File Star - Unstar Action Completed";

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
            }
        });
    });

}

exports.handle_request = handle_request;