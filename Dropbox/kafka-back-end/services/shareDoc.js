const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In shareDoc service");

    let shareWith = data.data.shareWith;

    let shareFrom = data.data.shareFrom;

    let DocName = data.data.DocName;

    let DocPath = data.data.currentPath;

    mongo.connect(mongoURL, function () {

        console.log('Connected to mongo at: ' + mongoURL);

        const coll = mongo.collection('document');

        const coll1 = mongo.collection('sharedDocuments');

        coll1.findOne({
            Username: shareWith,
            SharedWithMe: {
                DocName: DocName,
                DocPath: DocPath
            }
        }, function (err, doc) {

            if(doc){
                res.code = "403";
                res.value = `${DocName} already shared with ${shareWith}`;
            }

            else{

                coll.findOne({DocOwner: shareFrom, DocName: DocName, DocPath:DocPath}, function (err, doc) {

                    DocName = doc.DocName;
                    let DocType = doc.DocType;
                    DocPath = doc.DocPath;
                    let DocOwner = doc.DocOwner;

                    // sharedWithMe --> for "shareWith" user
                    coll1.update({Username: shareWith},
                        {
                            $push:
                                {
                                    SharedWithMe: {
                                        DocName: DocName,
                                        DocType: DocType,
                                        DocPath: DocPath,
                                        DocOwner: DocOwner,
                                        Star: 0,
                                        TimeStamp: new Date(),
                                        deleteFlag: 0
                                    }
                                }

                        },{upsert: true}, function (err, doc) {

                            // if it's folder than we need to pass whole hierarchy of folder as sharedDocument
                            if(doc.DocType === folder){

                                let regex = new RegExp("^/"+DocPath+"/");
                                console.log("Got regex: "+regex);

                                //if $regex doesn't work try regex variable directly
                                coll.find({DocOwner: shareFrom, DocPath: regex},function(err,docs){

                                    if(err){
                                        console.log(err);
                                    }

                                    else{
                                        docs.forEach(function(doc){

                                            let DocName = doc.DocName;
                                            let DocType = doc.DocType;
                                            let DocPath = doc.DocPath;
                                            let DocOwner = doc.DocOwner;

                                            coll1.update({Username: shareWith},
                                                {
                                                    $push:
                                                        {
                                                            SharedWithMe: {
                                                                DocName: DocName,
                                                                DocType: DocType,
                                                                DocPath: DocPath,
                                                                DocOwner: DocOwner,
                                                                Star: 0,
                                                                TimeStamp: new Date(),
                                                                deleteFlag: 0
                                                            }
                                                        }

                                                },{upsert: true}, function (err, doc) {

                                                    console.log("Doc Inserted for folder hierarchy");
                                                });

                                        });
                                    }
                                });

                            }

                            //Logic for copying file from its source folder to sharedFile/Folder

                            // sharedByMe --> for "shareFrom" user
                            coll1.update({Username: shareFrom},
                                {
                                    $push:
                                        {
                                            SharedByMe: {
                                                DocName: DocName,
                                                DocType: DocType,
                                                DocPath: DocPath,
                                                SharedWith: shareWith,
                                                deleteFlag: 0
                                            }
                                        }

                                },{upsert: true}, function (err, doc) {

                                    console.log("Doc Inserted in sharedByMe");

                                });
                        });

                    res.code = "204";
                    res.value = "Document shared";

                    const coll1 = mongo.collection('activity');

                    coll1.insertOne({
                        ActivityName: 'sharedDoc',
                        DocName: DocName,
                        Username: shareFrom,
                        TimeStamp: new Date(),
                        deleteFlag: 0
                    }, function (err, user) {

                        if(err){
                            console.log(err);
                        }

                        console.log("Activity inserted - sharedDoc");

                    });

                    console.log('after handle' + res);

                });

            }


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