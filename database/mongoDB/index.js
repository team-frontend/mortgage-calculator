const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost/zillower';
const db = mongoose.connect(mongoUri);

module.exports = db;
