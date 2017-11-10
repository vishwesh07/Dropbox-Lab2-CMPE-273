const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In get Files service");

    let docArr = [];

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        const coll = mongo.collection('documents');
        coll.find({DocPath: data.data.currentPath}).toArray(function (err, doc) {

            if (err) {
                throw err;
            }
            else {

                console.log(doc.length);

                docArr = doc.map(function (result) {
                    let docJSON = {};
                    docJSON.DocName = result.DocName;
                    docJSON.DocType = result.DocType;
                    docJSON.DocPath = result.DocPath;
                    docJSON.OwnerEmailId = result.DocOwner;
                    docJSON.Star = result.Star;
                    return docJSON;
                });

                console.log(docArr);

                console.log('after handle' + res);

                res.code = "200";
                res.value = "Files returned";
                res.data = {docs: docArr};

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