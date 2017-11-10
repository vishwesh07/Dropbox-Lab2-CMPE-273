const shelljs = require('shelljs');
const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In folder remove service");

    console.log(data.data.currentPath+data.data.folderName);

    shelljs.rm('-r',data.data.currentPath+data.data.folderName);

    mongo.connect(mongoURL, function () {

        console.log('Connected to mongo at: ' + mongoURL);

        const coll = mongo.collection('documents');

        let regex = new RegExp("^"+data.data.currentPath);
        console.log("Got regex: "+regex);

        coll.remove({$or: [{DocName: data.data.folderName, DocPath: regex }]}, function (err, doc) {

            if (err) {
                throw err;
            }

            res.code = "204";
            res.value = "Folder removed";

            const coll1 = mongo.collection('activity');

            //recursive delete entry remaining
            coll1.insertOne({
                ActivityName: 'removeFolder',
                DocName: data.data.folderName,
                Username: data.data.username,
                TimeStamp: new Date(),
                deleteFlag: 0
            }, function (err, user) {

                if (err) {
                    console.log(err);
                }

                console.log("Activity inserted - removeFolder");

            });

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
    });
}

exports.handle_request = handle_request;