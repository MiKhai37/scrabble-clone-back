// This script seed the database with fake users, posts and comments
require('dotenv').config();

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log('Database connection opened')

console.time('Database dropped');
db.dropDatabase(function(err, result) {
  if (err) {
    console.error(err);
    return;
  };
  console.log(result);
  db.close();
  console.log('Database connection closed');
  console.timeEnd('Database dropped');
  process.exit();
})

