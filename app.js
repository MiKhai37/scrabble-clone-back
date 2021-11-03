require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const mongoose = require('mongoose');
const passport = require('passport');

require('./auth/passport');

//DB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const authRoutes = require('./routes/authRoutes');
const protectedRoute = require('./routes/protected-routes');

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

app.use(passport.initialize());

app.use('/auth', authRoutes);

// Add the jwt strategy as a middleware, only authenticated user can access
app.use('/user', passport.authenticate('jwt', { session: false }), protectedRoute);


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
