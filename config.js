/**
 * Created by sew on 2017-08-11.
 */
var  awsS3Config = {
    bucket: "sewemarkbucket",
    access_key: "AKIAJWMKWOHSHPFJ7XAQ",
    secret_key: "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",
    region: "us-east-2",
    acl: "public-read",                                                 // to allow the uploaded file to be publicly accessible
    "x-amz-algorithm": "AWS4-HMAC-SHA256",                              // algorithm used for signing the policy document
    success_action_status: "201",
    serverPort :55555,
    queueUrl :'https://sqs.us-east-2.amazonaws.com/810664644484/image-operation',
};

module.exports = awsS3Config;