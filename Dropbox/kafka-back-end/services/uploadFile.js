const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";
const moment = require('moment-timezone');
const fs = require('fs');
// file upload and conversion from binary stream to file is remaining

function handle_request(data,callback) {

    let res = {};

    console.log("In file upload service "+data.data.filename+" "+data.data.username+" "+data.data.currentPath+" ");

    let filename = data.data.filename;

    let fileChunk = data.data.fileChunk;

    let username = data.data.username;

    let currentPath = data.data.currentPath;

    let docNotExists = true;

    let wstream = fs.createWriteStream(currentPath+"/"+filename);
    // OR add the encoding to each write
    wstream.write(fileChunk, function () {
        console.log("complete write");
        wstream.close();
    });

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        const coll = mongo.collection('documents');
        coll.findOne({DocName: filename, DocPath: currentPath}, function (err, doc) {
            console.log("before In find One docNotExists" + docNotExists);
            if (doc) {
                docNotExists = false;
            }
            console.log("after - In find One docNotExists " + docNotExists);
            if (docNotExists) {
                console.log("In docNotExists " + docNotExists);
                coll.insertOne({
                    DocName: filename,
                    DocType: 'file',
                    DocPath: currentPath,
                    DocOwner: username,
                    Star: 0,
                    TimeStamp: new Date(),
                    deleteFlag: 0
                }, function (err, doc) {
                    if (doc.insertedCount === 1) {
                        res.code = "204";
                        res.value = "File inserted";

                        let d = new Date();
                        let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                        let day = days[d.getDay()];
                        let time = moment().tz("America/Los_Angeles").format();

                        const coll1 = mongo.collection('activity');

                        coll1.insertOne({
                            ActivityName: 'Uploaded a File',
                            DocName: data.data.filename,
                            Username: data.data.username,
                            TimeStamp: day+" "+time,
                            deleteFlag: 0
                        }, function (err, user) {

                            if(err){
                                console.log(err);
                            }

                            console.log("Activity inserted - uploadFile");


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

                });
            }
            else {
                res.code = "403";
                res.value = "Similar file already exists.";

                console.log('after handle in 403' + res);

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