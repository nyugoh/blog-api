const express = require('express');
const glob = require('glob');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const config = require('./config');
const app= express();

module.exports = () => {
  const env = process.env.NODE_ENV;
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.engine('handlebars', exphbs({
    layoutsDir: config.root + '/src/views/layouts/',
    defaultLayout: 'main',
    partialsDir: [config.root + '/src/views/partials/']
  }));
  app.set('views', config.root + '/src/views');
  app.set('view engine', 'handlebars');

  if (env === 'development') app.use(logger('dev'));

  // CORS headers
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Add necessary middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session({
    name: 'admin-session',
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(Date.now() + 3600000),
      maxAge: 3600000
    }
  }));
  app.use(compress()); // compress http json
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  // Import all controllers and call app on them
  let controllers = glob.sync(config.root + '/src/controllers/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  // Handle wild routes
  app.use((req, res, next) => {
    let err = new Error('End-point not found, You have hit a wild-route');
    err.status = 404;
    next(err);
  });

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.status(505).json({
      message: err.message,
      title: 'error'
    });
  });

  return app;
};
