require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const session = require('express-session')

const mongoose = require('mongoose');
const passport = require('passport');

const User = require('./models/user')

require('./auth/passport');

//DB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const routes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL]
}));

app.use(logger('dev'));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (user, done) {
  //If using Mongoose with MongoDB; if other you will need JS specific to that schema.
  User.findById(user._id, function (err, user) {
      done(err, user);
  });
});

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: oneDay}
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes)

app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err.message);
});

app.listen(port, () => {
  console.log(`Server is up at port:${port}`)
})

module.exports = app;
