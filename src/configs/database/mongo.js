const mongo = require('mongoose');

module.exports = () => {
    const {MONGO_URL} = process.env;
    const {connection} = mongo;

    mongo.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    connection.on('connected', () => console.info('MongoDB connected.'));
    connection.on('error', (err) => console.error('Error in MongoDB connection: ' + err));
}