/**
 * Created by sew on 2017-08-10.
 */
var AWS = require('aws-sdk');
var config = require('./config');
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs');
var express = require('express');
var signatureGenerator = require('./signatureGenerator');
var bodyParser = require('body-parser');
var bucketParamsFactory = require('./bucketParamsFactory');
var sQSParamsFactory = require('./sQSParamsFactory');

AWS.config.loadFromPath('./package.json');
s3 = new AWS.S3({apiVersion: '2006-03-01'});
var sqs = new AWS.SQS();
var app = express();

app.use(bodyParser());
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/views'));

app.get('/files', function (req, res) {
    s3.listObjects(bucketParamsFactory.create(), function (err, data) {
        if(err){
            throw err;
            res.status(500).send('Can not load files for this bucket');
        }else{
            var data = data.Contents;
            var mappedFiles =data.map(function (item) {
                return item.Key;
            });
            res.status(200).render('files', { files: mappedFiles })
        }
    });
});

app.post('/sendSQS',function (reqest,response) {

    var files = reqest.body;
    var errMessage = new Array();
    var dataMaessage = new Array();
    files.forEach(function (item) {
        sqs.sendMessage(sQSParamsFactory.createParamsForFiles(JSON.stringify(item)), function(err, data) {
            if(err){
                errMessage.push(err);
            }else{
                dataMaessage.push(data);
            }
        });
    });

    if (errMessage.length>0) {
        console.log('error:', errMessage);
        res.status(500).send('SQS can not be sent')
    }else{
        console.log(dataMaessage);
        response.status(200).send('SQS has been sent');
    }
});

app.get('/getCredentialForFile',function (req,res) {
    if (req.query.filename !== undefined && req.query.filename !== null) {
        var filename = uuid.v4() + path.extname(req.query.filename);
        var result = signatureGenerator.getS3Credentials(config, filename);
        res.status(200).json(result);
    } else {
        res.status(400).send("File does not exist");
    }
});

app.get('/download', function(req, res){
    var fileName = req.query.fileName;
    s3.getObject(bucketParamsFactory.createForFile(fileName), function (err, data) {
        if(err || typeof data == 'undefined' || data === null){
            res.status(500).send('Can not download this file');
        }
        else {
            res.setHeader('Content-Length', data.ContentLength);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
            res.write(data.Body, 'binary');
            res.end();
        }
    });
});

app.get('/delete', function(req, res){
    console.log("DELETE");
    var fileName = req.query.fileName;
    console.log(fileName);
    s3.deleteObject(bucketParamsFactory.createForDeleteFile(fileName), function (err, data) {
        if(err || typeof data == 'undefined' || data === null){
            console.log(err);
            res.status(500).send('Can not delete this file');
        }
        else {
          res.status(200).send('File has been deleted');
        }
    });
});

var server = app.listen(config.serverPort, function() {
    console.log('Node app is running on port: ' + server.address().port);
});

