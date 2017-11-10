const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

// file upload and conversion from binary stream to file is remaining

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In file upload service");

    let docNotExists = true;

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        const coll = mongo.collection('documents');
        coll.findOne({DocName: data.data.fileName, DocPath: data.data.currentPath}, function (err, doc) {
            console.log("before In find One docNotExists" + docNotExists);
            if (doc) {
                docNotExists = false;
            }
            console.log("after - In find One docNotExists " + docNotExists);
            if (docNotExists) {
                console.log("In docNotExists " + docNotExists);
                coll.insertOne({
                    DocName: data.data.fileName,
                    DocType: 'file',
                    DocPath: data.data.currentPath,
                    DocOwner: data.data.username,
                    Star: 0,
                    TimeStamp: new Date(),
                    deleteFlag: 0
                }, function (err, doc) {
                    if (doc.insertedCount === 1) {
                        res.code = "204";
                        res.value = "File inserted";

                        const coll1 = mongo.collection('activity');

                        coll1.insertOne({
                            ActivityName: 'uploadFile',
                            DocName: data.data.fileName,
                            Username: data.data.username,
                            TimeStamp: new Date(),
                            deleteFlag: 0
                        }, function (err, user) {

                            if(err){
                                console.log(err);
                            }

                            console.log("Activity inserted - uploadFile");

                        });

                    }

                    console.log('after handle' + res);

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
                });
            }
            else {
                res.code = "304";
                res.value = "Similar file already exists.";

                console.log('after handle' + res);

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