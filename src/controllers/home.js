const router = require('express').Router();

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to the blog api' });
});

router.get('/:blogSlug', (req, res) => {
  res.render('index', { title: req.params['blogSlug'] });
});
