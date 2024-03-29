var rpc = new (require('./kafkarpc'))();

//make request to kafka
function make_request(topic_name, msg_payload, callback){
    console.log('in make request');
    console.log(msg_payload.username);
	rpc.makeRequest(topic_name, msg_payload, function(err, response){
		if(err)
			console.error(err);
		else{
			console.log("response", response);
			callback(null, response);
		}
	});
}

exports.make_request = make_request;
