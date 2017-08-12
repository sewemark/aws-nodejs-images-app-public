/**
 * Created by sew on 2017-08-10.
 */
var AWS = require('aws-sdk');
var config = require('./config');
var crypto = require('crypto');
var uuid = require('node-uuid');
var path = require('path');
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
app.get('/getCredentialForFile',function (request,res) {
    console.log("uploading");
    if (request.query.filename !== undefined && request.query.filename !== null) {
        var filename = uuid.v4() + path.extname(request.query.filename);

        var result = getS3Credentials(config, filename);
        console.log(result);
        response.json(result);
    } else {
        response.status(400).send("A Valid filename Is Needed!");
    }
})
var server = app.listen(55555, function() {
    console.log('Node app is running on port: ' + server.address().port);
});

function getS3Credentials(config, filename) {

    var params = getS3Parameters(config, filename);

    var result = {
        upload_url: "https://" + config.bucket + ".s3.amazonaws.com",
        params: params
    };

    return result;
}

// Returns the parameters that need to be send with the AWS' upload API
function getS3Parameters(config, filename) {

    var date = new Date().toISOString();

    // create date string for the current date
    var dateString = date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);

    // create upload credentials
    var credential = config.access_key + "/" + dateString + "/" + config.region + "/s3/aws4_request";

    // create policy
    var policy = {
        expiration: new Date((new Date).getTime() + (1 * 60 * 1000)).toISOString(),         // to set the time after which upload will no longer be allowed using this policy
        conditions: [
            { bucket: config.bucket },
            { key: filename },                                          // filename with which the uploaded file will be saved on s3
            { acl: config.acl },
            { success_action_status: config.success_action_status },
            ["content-length-range", 0, 1000000],                       // optional: to specify the minimum and maximum upload limit
            { "x-amz-algorithm": config["x-amz-algorithm"] },
            { "x-amz-credential": credential },
            { "x-amz-date": dateString + "T000000Z" }
        ]
    };
    console.log(policy);

    // base64 encode policy
    var policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');

    // create signature with policy, aws secret key & other scope information
    var dateKey = createHmacDigest('AWS4' + config.secret_key, dateString);
    var dateRegionKey = createHmacDigest(dateKey    , config.region);
    var dateRegionServiceKey = createHmacDigest(dateRegionKey, 's3');
    var signingKey = createHmacDigest(dateRegionServiceKey, 'aws4_request');

    // sign policy document with the signing key to generate upload signature
    var xAmzSignature = createHmacDigest(signingKey, policyBase64).toString('hex');

    // create upload parameters
    return {
        key: filename,
        acl: config.acl,
        success_action_status: config.success_action_status,
        policy: policyBase64,
        'x-amz-algorithm': config["x-amz-algorithm"],
        'x-amz-credential': credential,
        'x-amz-date': dateString + "T000000Z",
        'x-amz-signature': xAmzSignature
    };
}

function createHmacDigest(key, string) {
    var hmac = crypto.createHmac('sha256', key);
    hmac.write(string);
    hmac.end();
    return hmac.read();
}

