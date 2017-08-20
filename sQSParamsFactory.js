var config = require('./config');

function createParamsForFiles(files) {
    return  sqsParams = {
        QueueUrl: config.queueUrl,
        MessageBody:files
    };
}

module.exports = {
    createParamsForFiles:createParamsForFiles
}