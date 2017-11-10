const shelljs = require('shelljs');
const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In folder creation service");

    let docNotExists = true;

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        const coll = mongo.collection('documents');
        coll.findOne({DocName: data.data.folderName, DocPath: data.data.currentPath}, function (err, doc) {
            console.log("before In find One docNotExists" + docNotExists);
            if (doc) {
                docNotExists = false;
            }
            console.log("after - In find One docNotExists " + docNotExists);
            if (docNotExists) {
                console.log("In docNotExists " + docNotExists);
                coll.insertOne({
                    DocName: data.data.folderName,
                    DocType: 'folder',
                    DocPath: data.data.currentPath,
                    DocOwner: data.data.username,
                    Star: 0,
                    TimeStamp: new Date(),
                    deleteFlag: 0
                }, function (err, doc) {
                    if (doc.insertedCount === 1) {
                        res.code = "201";
                        res.value = "Folder inserted";

                        const coll1 = mongo.collection('activity');

                        coll1.insertOne({
                            ActivityName: 'createFolder',
                            DocName: data.data.folderName,
                            Username: data.data.username,
                            TimeStamp: new Date(),
                            deleteFlag: 0
                        }, function (err, user) {

                            if(err){
                                console.log(err);
                            }

                            console.log("Activity inserted - createFolder");

                        });

                    }

                    shelljs.mkdir(data.data.currentPath + "/" + data.data.folderName);

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
                res.code = "403";
                res.value = "Similar folder already exists.";

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