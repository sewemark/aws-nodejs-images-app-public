/**
 * Created by sew on 2017-08-10.
 */
var AWS = require('aws-sdk');
var config = require('./config');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./package.json');

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list current buckets
s3.listBuckets(function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Bucket List", data.Buckets);
    }
});

var express = require('express');


var app = express();

app.use(express.static(__dirname + '/views'));

var server = app.listen(55555, function() {
    console.log('Node app is running on port: ' + server.address().port);
});
