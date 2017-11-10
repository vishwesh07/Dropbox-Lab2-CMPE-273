var express = require('express');
var request = require('request');
var assert = require('assert');
var http = require('http');
var mocha = require('mocha');

describe('SignIn test', function(){
    it('should return sign Up if the url is correct',
        function(done){
            request.post('http://localhost:3004/SignIn/',
            { form: { userData: { email: 'Mils@gmail.com', password: 'M54321' } } }, function(res) {
                assert.equal(200, res.statusCode);
                done();
            })
        });
});

