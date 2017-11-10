const mongo = require('./mongo');
const mongoURL = "mongodb://localhost:27017/dropbox";

function handle_request(data,callback) {

    let res = {};

    console.log("In handle request:" + JSON.stringify(data.data));

    console.log("In edit profile service");

    mongo.connect(mongoURL, function () {

        console.log('Connected to mongo at: ' + mongoURL);

        const coll = mongo.collection('profile');

        if(data.data.edit === "Overview"){

            try {
                coll.updateOne(
                    {Username: data.data.username},
                    {$set: {
                        Overview: data.data.profile.Overview,
                        TimeStamp: new Date()
                    }},
                    { upsert: true }
                );
                console.log("username edited");
            } catch (e) {
                console.log(e);
            }

        }

        if(data.data.edit === "Work"){

            try {
                coll.updateOne(
                    {Username: data.data.username},
                    {$set: {
                        Work: data.data.profile.Work,
                        TimeStamp: new Date()
                    }},
                    { upsert: true }
                );
                console.log("work edited");
            } catch (e) {
                console.log(e);
            }

        }

        if(data.data.edit === "Education"){

            try {
                coll.updateOne(
                    {Username: data.data.username},
                    {$set: {
                        Education: data.data.profile.Education,
                        TimeStamp: new Date()
                    }},
                    { upsert: true }
                );
                console.log("education edited");
            } catch (e) {
                console.log(e);
            }

        }

        if(data.data.edit === "ContactNumber"){

            try {
                coll.updateOne(
                    {Username: data.data.username},
                    {$set: {
                        ContactNumber: data.data.profile.ContactNumber,
                        TimeStamp: new Date()
                    }},
                    { upsert: true }
                );
                console.log("contact edited");
            } catch (e) {
                console.log(e);
            }

        }

        const coll1 = mongo.collection('activity');

        coll1.insertOne({
            ActivityName: 'editedProfile',
            DocName: "",
            Username: data.data.username,
            TimeStamp: new Date(),
            deleteFlag: 0
        }, function (err, user) {

            if (err) {
                console.log(err);
            }

            console.log("Activity inserted - editedProfile");

        });

        res.code = "200";
        res.value = "Profile parameter"+ data.data.edit +" edited";

        console.log(profileArr);

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

exports.handle_request = handle_request;