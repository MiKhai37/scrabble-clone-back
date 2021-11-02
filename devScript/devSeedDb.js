// This script seed the database with fake users, posts and comments
require('dotenv').config();

const async = require('async');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserModel = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log('Database connection opened');

const user1 = {
  email: 'user1@like.com',
  password: 'pass1',
};

const user2 = {
  email: 'user2@like.com',
  password: 'pass2',
};

const user3 = {
  email: 'user3@like.com',
  password: 'pass3',
};

const createUser = async ({ email, password }, cb) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = await new UserModel(
    {
      email,
      password: hash,
      creationTimestamp: new Date().getTime(),
    }
  )

  newUser.save(function (err, user) {
    if (err) {
      console.error(err);
      cb(err, null)
      return;
    };
    console.log(user.username);
    cb(null, user.username);
  });
};

console.time('Users seeding');
async.parallel([
  function (callback) {
    createUser(user1, callback);
  },
  function (callback) {
    createUser(user2, callback);
  },
  function (callback) {
    createUser(user3, callback);
  },
], function (err, users) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(users)
  db.close();
  console.log('Database connection closed');
  console.timeEnd('Users seeding');
  process.exit();
})