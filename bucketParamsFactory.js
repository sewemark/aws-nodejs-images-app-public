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

module.exports = {
    createForFile:createForFile
};