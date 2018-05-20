const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');

module.exports = (app) => {
  app.use('/api/v1/blog', router);
};

router.get('/list', (req, res) => {
  Blog.find().then( blogs => {
    if (blogs)
      res.json({ blogs});
  }).catch( errors =>{
    res.status(404).json({message: errors.message});
  });
});

router.post('/add', (req, res) => {
  const blog = new Blog(req.body.blog);
   blog.slug = req.body.blog.title.split(' ').map( segment => segment.toLowerCase()).join('-');
  blog.save().then( blog => {
    if (blog)
      res.json({status: 'ok', blog});
  }).catch( errors =>{
    res.status(404).json({message: errors.message});
  });
});

router.put('/edit', (req, res) => {
  Blog.findByIdAndUpdate(req.body.blog._id, req.body.blog, { new: true }).then( blog => {
    if (blog)
      res.json({status: 'ok', blog});
  }).catch( errors =>{
    res.status(404).json({message: errors.message});
  });
});

router.delete('/delete/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id).then( response => {
    if (response)
      res.json({ status: 'ok', id: req.params.id });
  }).catch( errors =>{
    res.status(404).json({ message: errors.message });
  });
});
