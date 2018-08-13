'use strict';

var express = require('express');
var router = express.Router();

module.exports = function (app) {
  app.use(router);
};

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to the blog api' });
});