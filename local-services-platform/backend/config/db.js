const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/local_services_platform';
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB || undefined });
  return mongoose.connection;
}

module.exports = { connectDatabase };


