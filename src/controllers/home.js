const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res) => {
  console.log(req.session)
  res.render('index', { title: 'Welcome to the blog api' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res) => {
  if (req.body === undefined) {
    res.status(404).json({ error: true, message: "No credentials in request" });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      login(req, res, user);
    }).catch((error) => {
      res.status(404).json({ error: true, message: "User doesn't exist" });
    });
  }
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', (req, res) => {
  registerUser(req, res);
});

router.get('/:blogSlug', (req, res) => {
  console.log(req.session)
  res.render('blog', { title: req.params['blogSlug'] });
});

function login(req, res, user) {
  bcrypt.compare(req.body.password, user.password).then((status) => {
    if (status) {
      let payload = {
        email: user.email,
        username: user.username
      };
      let token = jwt.sign(payload, process.env.SESSIONKEY, { expiresIn: 1440 });
      req.session.token = token;
      res.json({ token });
    } else {
      res.status(404).json({ error: true, message: "Invalid email/password" });
    }
  }).catch(e => {
    res.status(404).json({ error: true, message: e.message });
  });
}

function registerUser(req, res) {
  if (req.body === undefined) {
    res.status(404).json({ error: true, message: "Post a user object" });
  } else {
    User.find({ email: req.body.email }).then((users) => {
      if (users.length === 0) {
        let user = new User();
        user.email = req.body.email;
        user.username = req.body.username;
        user.fullName = req.body.fullName;
        user.password = req.body.password;
        bcrypt.hash(user.password, 10).then((hash) => {
          user.password = hash;
          user.save().then((user) => {
            login(req, res, user);
          }).catch((e) => {
            res.status(400).json({ error: true, message: e.message });
          });
        }).catch((e) => {
          res.status(404).json({ error: true, message: e.message });
        });
      } else {
        res.status(404).json({ error: true, message: "User already exists, login" });
      }
    }).catch((e) => {
      res.status(404).json({ error: true, message: e.message });
    });
  }
}
