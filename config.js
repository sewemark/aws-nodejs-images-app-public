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
    success_action_status: "201"                                        // to return an XML object to the browser detailing the file state
};

module.exports =awsS3Config;