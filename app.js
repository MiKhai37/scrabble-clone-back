require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const mongoose = require('mongoose');
const passport = require('passport');

require('./auth/auth');

//DB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const routes = require('./routes/routes');
const secureRoute = require('./routes/protected-routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', routes);

// Add the jwt strategy as a middleware, only authenticated user can access
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`listening on port ${process.env.PORT || 5000}!`),
);

module.exports = app;
