'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var Blog = require('../models/Blog');
var Message = require('../models/Message');
var Category = require('../models/Category');

var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});
module.exports = function (app) {
  app.use('/api/v1/blog', router);
};

router.get('/list', function (req, res) {
  Blog.find().then(function (blogs) {
    if (blogs) res.json({ blogs: blogs });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.get('/categories/:category', function (req, res) {
  Blog.find({ category: req.params.category }).then(function (blogs) {
    if (blogs) res.json({ blogs: blogs });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.post('/add', function (req, res) {
  var blog = new Blog(req.body.blog);
  blog.slug = req.body.blog.title.split(' ').map(function (segment) {
    return segment.toLowerCase();
  }).join('-');
  blog.save().then(function (blog) {
    if (blog) Category.findOneAndUpdate({ name: blog.category }, { $inc: { blogs: 1 } }, { new: true }).then(function (category) {
      res.json({ status: 'ok', blog: blog, category: category });
    });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.put('/edit', function (req, res) {
  Blog.findByIdAndUpdate(req.body.blog._id, req.body.blog, { new: true }).then(function (blog) {
    if (blog) res.json({ status: 'ok', blog: blog });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.put('/archive/:id', function (req, res) {
  Blog.findById(req.params.id).then(function (blog) {
    if (blog) {
      blog.status = blog.status === 0 ? 1 : 0;
      blog.save().then(function (blog) {
        if (blog) res.json({ status: 'ok', blog: blog });
      });
    }
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.delete('/delete/:id', function (req, res) {
  Blog.findByIdAndRemove(req.params.id).then(function (response) {
    if (response) res.json({ status: 'ok', id: req.params.id });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.post('/send', function (req, res) {
  var message = new Message(req.body.message);
  message.save().then(function (message) {
    if (message) {
      sendMail(message, function (status) {
        if (status) res.json({ status: 'ok', message: message });else res.status(404).json({ status: 'ok', message: message });
      });
    }
  }).catch(function (errors) {
    res.status(400).json({ message: errors.message });
  });
});

router.get('/*', function (req, res) {
  res.status(505).json({ message: 'You have hit blog wild-route' });
});

function sendMail(message, callback) {
  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: message.subject,
    html: '<table class="body-wrap">\n            \t<tr>\n            \t\t<td></td>\n            \t\t<td class="container" bgcolor="#FFFFFF">\n            \t\t\t<div class="content">\n            \t\t\t<table>\n            \t\t\t\t<tr>\n            \t\t\t\t\t<td>\n            \t\t\t\t\t\t<h3>From </h3>\n            \t\t\t\t\t\t<p style="padding-left: 20px"><b>Name::</b> ' + message.name + '</p>\n            \t\t\t\t\t\t<p style="padding-left: 20px"><b>Email:</b> ' + message.email + '</p>\n            \t\t\t\t\t\t<p style="padding-left: 20px"><b>ID:</b> ' + message._id + '</p>\n            \t\t\t\t\t</td>\n            \t\t\t\t</tr>\n                    <tr>\n                      <td>\n                        <h3>Message</h3>\n                        <p>' + message.message + '</p>\n                      </td>\n                    </tr>\n            \t\t\t</table>\n            \t\t\t</div>\n            \t\t</td>\n            \t\t<td></td>\n            \t</tr>\n            </table>'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      callback(false);
    } else {
      callback(true);
    }
  });
}
