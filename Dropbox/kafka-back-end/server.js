var connection = require('./kafka/Connection');
var getActivity = require("./services/getActivity");
var starUnstarDoc = require("./services/starUnstarDoc");
var signIn = require("./services/signIn");
var signUp = require("./services/signUp");
var signOut = require("./services/signOut");
var createFolder = require("./services/createFolder");
var getFiles = require("./services/getFiles");
var uploadFile = require("./services/uploadFile");
var deleteFile = require("./services/deleteFile");
var removeFolder = require("./services/removeFolder");
var editProfile = require("./services/editProfile");
var getProfile = require("./services/getProfile");
var shareDoc = require("./services/shareDoc");
var unshareDoc = require("./services/unshareDoc");
var starUnstarSharedDoc = require("./services/starUnstarSharedDoc");

// import * as connection from './kafka/Connection';
// import * as getActivity from "./services/getActivity";
// import * as starUnstarFile from "./services/starUnstarFile";
// import * as starUnstarFolder from "./services/starUnstarFolder";
// import * as signIn from "./services/signIn";
// import * as signUp from "./services/signUp";
// import * as createFolder from "./services/createFolder";
// import * as getFiles from "./services/getFiles";
// import * as uploadFile from "./services/uploadFile";
// import * as deleteFile from "./services/deleteFile";
// import * as removeFolder from "./services/removeFolder";
// import * as editProfile from "./services/editProfile";
// import * as getProfile from "./services/getProfile";
// import * as shareDoc from "./services/shareDoc";
// import * as unshareDoc from "./services/unshareDoc";
// import * as starUnstarSharedDoc from "./services/starUnstarSharedDoc";

const topic_name = 'login_topic';
const consumer = connection.getConsumer(topic_name);
const producer = connection.getProducer();

console.log('server is running');

consumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    const data = JSON.parse(message.value);
    console.log(data.replyTo);
    let changeDestination = " ";


    if(data.data.service === 'signIn'){
        signIn.handle_request(data, function(err,payloads){
            console.log("In signin handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'signUp'){
        signUp.handle_request(data, function(err,payloads){
            console.log("In signup handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    if(data.data.service === 'signOut'){
        signOut.handle_request(data, function(err,payloads){
            console.log("In signOut handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'createFolder'){
        createFolder.handle_request(data, function(err,payloads){
            console.log("In createFolder handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'getFiles'){
        changeDestination = data.data.currentPath;
        getFiles.handle_request(data, function(err,payloads){
            console.log("In getFiles handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'getActivity'){
        getActivity.handle_request(data, function(err, payloads){
            console.log("In activity handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'starUnstarDoc'){
        starUnstarDoc.handle_request(data, function(err,payloads){
            console.log("In starUnstarFile handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'uploadFile'){
        data.data.changeDestination = changeDestination;
        uploadFile.handle_request(data, function(err,payloads){
            console.log("In uploadFile handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'deleteFile'){
        deleteFile.handle_request(data, function(err,payloads){
            console.log("In deleteFile handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'removeFolder'){
        removeFolder.handle_request(data, function(err,payloads){
            console.log("In removeFolder handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'editProfile'){
        editProfile.handle_request(data, function(err,payloads){
            console.log("In editProfile handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'getProfile'){
        getProfile.handle_request(data, function(err,payloads){
            console.log("In getProfile handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'shareDoc'){
        shareDoc.handle_request(data, function(err,payloads){
            console.log("In shareDoc handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'unshareDoc'){
        unshareDoc.handle_request(data, function(err,payloads){
            console.log("In unshareDoc handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

    else if(data.data.service === 'starUnstarSharedDoc'){
        starUnstarSharedDoc.handle_request(data, function(err,payloads){
            console.log("In starUnstarSharedDoc handle request"+ payloads);
            producer.send(payloads, function(err, data){
                console.log(data);
            });
        });
    }

});