const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Blog = require('../models/Blog');
const Message = require('../models/Message');
const Category = require('../models/Category');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
  }
});
module.exports = (app) => {
  app.use('/api/v1/blog', router);
};

router.get('/list', (req, res) => {
  Blog.find().then((blogs) => {
    if (blogs) res.json({ blogs });
  }).catch((errors) => {
    res.status(404).json({ error: true, message: errors.message });
  });
});

router.get('/categories/:category', (req, res) => {
  Blog.find({ category: req.params.category }).then((blogs) => {
    if (blogs) res.json({ blogs });
  }).catch((errors) => {
    res.status(404).json({ error: true, message: errors.message });
  });
});

router.post('/add', (req, res) => {
  if (req.body.blog === undefined) {
    res.status(404).json({ error: true, message: "A body is required" });
    return;
  }
  const blog = new Blog(req.body.blog);
  blog.slug = req.body.blog.title.split(' ').map((segment) => segment.toLowerCase()).join('-');
  blog.save().then((blog) => {
    if (blog) Category.findOneAndUpdate({ name: blog.category }, { $inc: { blogs: 1 } }, { new: true }).then((category) => {
        res.json({ status: 'ok', blog, category });
      })
  }).catch((errors) => {
    res.status(404).json({ error: true, message: errors.message });
  });
});

router.put('/edit', (req, res) => {
  Blog.findByIdAndUpdate(req.body.blog._id, req.body.blog, { new: true }).then((blog) => {
    if (blog) res.json({ status: 'ok', blog });
  }).catch((errors) => {
    res.status(404).json({ error: true, message: errors.message });
  });
});

router.put('/archive/:id', (req, res) => {
  Blog.findById(req.params.id).then((blog) => {
    if (blog) {
      blog.status = blog.status === 0 ? 1 : 0;
      blog.save().then((blog) => {
        if (blog) res.json({ status: 'ok', blog });
      });
    }
  }).catch((errors) => {
    res.status(404).json({ error: true, message: errors.message });
  });
});

router.delete('/delete/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id).then((response) => {
    if (response) res.json({ status: 'ok', id: req.params.id });
  }).catch((errors) => {
    res.status(404).json({ error: true, message: errors.message });
  });
});

router.post('/send', (req, res) => {
  const message = new Message(req.body.message);
  message.save().then((message) => {
    if (message) {
      sendMail(message, function (status) {
        if (status) res.json({ status: 'ok', message });
        else res.status(404).json({ status: 'ok', message });
      });
    }
  }).catch((errors) => {
    res.status(400).json({ error: true, message: errors.message });
  });
});

router.get('/*', (req, res) => {
  res.status(505).json({ error: true, message: 'You have hit blog wild-route...' });
});


function sendMail(message, callback) {
  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: message.subject,
    html: `<table class="body-wrap">
            	<tr>
            		<td></td>
            		<td class="container" bgcolor="#FFFFFF">
            			<div class="content">
            			<table>
            				<tr>
            					<td>
            						<h3>From </h3>
            						<p style="padding-left: 20px"><b>Name::</b> ${message.name}</p>
            						<p style="padding-left: 20px"><b>Email:</b> ${message.email}</p>
            						<p style="padding-left: 20px"><b>ID:</b> ${message._id}</p>
            					</td>
            				</tr>
                    <tr>
                      <td>
                        <h3>Message</h3>
                        <p>${message.message}</p>
                      </td>
                    </tr>
            			</table>
            			</div>
            		</td>
            		<td></td>
            	</tr>
            </table>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error)
      callback(false);
    } else {
      callback(true);
    }
  });
}
