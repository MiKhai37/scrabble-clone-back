const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST route for signup middleware define in ../auth/passport.js
router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({ message: 'Signup successful' });
  }
);

// POST route for login middleware define in ../auth/passport.js
router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user) => {

        if (err || !user) {
          return next(err);
        }

        const jwtPayload = {
          _id: user._id,
          email: user.email,
          expiration: Date.now() + parseInt(process.env.JWT_EXPIRATION_TIME),
        };

        const token = jwt.sign(JSON.stringify(jwtPayload), process.env.JWT_SECRET);

        return res
          .cookie("secret_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .status(200)
          .json({ message: "Logged in successfully 😊 👌" });

      }
    )(req, res, next);
  }
);

router.get('/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(200).json({
      message: 'welcome to the protected route!'
    })
  }
)

module.exports = router;