var config = require('./config');

function createForFile(fileName) {
    return{
            Bucket: config.bucket,
            Key: fileName
    }
}

function create() {
    return{
            Bucket: config.bucket,
            Delimiter: '',
            Prefix: ''
    };
}

function createForDeleteFile(fileName) {
    return{
        Bucket: config.bucket,
        Key: fileName
    }
}

module.exports = {
    createForFile:createForFile,
    createForDeleteFile:createForDeleteFile,
    create:create
};