'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var config = require('./app/config/config');
var glob = require('glob');
var mongoose = require('mongoose');


mongoose.connect(config.db, { useMongoClient: true });
mongoose.Promise = _bluebird2.default;
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + './app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = require('./app/config/express')(express(), config);

module.exports = app;

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});