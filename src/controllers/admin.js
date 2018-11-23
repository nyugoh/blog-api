const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let user = {};

module.exports = (app) => {
  app.use('/', router);
};

function isLoggedIn(req, res, next) {
  let token = req.headers['x-access-token'];
  if (token === undefined){
    token = req.session.token;
  }
  if (token === undefined) {
    res.redirect("/login")
  } else {
    let decode = jwt.verify(token, process.env.SESSIONKEY);
    req.user = decode;
    next()
  }
}

router.get('/admin', isLoggedIn, (req, res) => {
  res.render('admin/index', { user: {} })
});
