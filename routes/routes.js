const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.json({
      message: 'Welcome to the web app scrabble backend, frontend here https://scrabble-clone-front.vercel.app/',
    })
  }
);

module.exports = router;