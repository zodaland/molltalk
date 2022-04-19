const mongoose = require('mongoose');
const conf = require('../config/db_config');
const logger = require('./library/log');
mongoose.Promise = global.Promise;

exports.connect = () => {
    return mongoose.connect(conf.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to mongodb');
        return true;
    })
    .catch(error => {
        logger.error(error);
        return false;
    });
}
exports.close = () => {
    return mongoose.connection.close()
    .then(() => true)
    .catch(e => false);
}