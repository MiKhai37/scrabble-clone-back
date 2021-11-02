const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const JWTstrategy = require('passport-jwt').Strategy;

// Passport middleware to save user information in the database; when signing up
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {


      if (await User.findOne({ email })) {
        const err = new Error('Email already use');
        err.status = 401;
        return done(err, null)
      }

      User.create({ email, password }, (err, user) => {
        if (err) return done(err, null);
        return done(null, user, { message: 'Sign up Successfully' });
      });

    }
  )
);

// Login middleware check if user exists, then validate the password
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {

      const user = await User.findOne({ email });

      if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        return done(err, null)
      }

      const validate = await user.isValidPassword(password);

      if (!validate) {
        const err = new Error('Invalid password');
        err.status = 401;
        return done(err, null)
      }

      return done(null, user, { message: 'Logged in Successfully' });

    }
  )
);

const cookieExtractor = req => {
  let jwt = null

  if (req && req.cookies) {
    jwt = req.cookies['secret_token']
    console.log(req.cookies)
  }

  return jwt
}

// Verifying tokens are valid and unmanipulated
passport.use(
  'jwt',
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: cookieExtractor,
    },
    (jwtPayload, done) => {
      const { expiration } = jwtPayload;

      console.log('jwt', jwtPayload)
      if (Date.now() > expiration) {
        const err = new Error('Unauthorized, jwt expired');
        err.status = 401;
        done(err, null);
      };

      done(null, jwtPayload);
    }
  )
);