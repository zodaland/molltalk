const mongoose = require('mongoose');
const conf = require('../config/db_config');
mongoose.Promise = global.Promise;

exports.connect = () => {
    return mongoose.connect(conf.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to mongodb');
        return true;
    })
    .catch(e => {
        console.log(e);
        return false;
    });
}
exports.close = () => {
    return mongoose.connection.close()
    .then(() => true)
    .catch(e => false);
}