'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');

module.exports = function (app, config) {
  var env = process.env.NODE_ENV;
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.engine('handlebars', exphbs({
    layoutsDir: config.root + 'views/layouts/',
    defaultLayout: 'main',
    partialsDir: [config.root + 'views/partials/']
  }));
  app.set('views', config.root + 'views');
  app.set('view engine', 'handlebars');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  if (env === 'development') app.use(logger('dev'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(_express2.default.static(config.root + '/public'));
  app.use(methodOverride());
  var controllers = _glob2.default.sync(config.root + 'controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.get('*', function (req, res) {
    res.status(505).json({ message: 'You have hit a wild-route' });
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.status(500).json({
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.status(505).json({
      message: err.message,
      title: 'error'
    });
  });

  return app;
};
