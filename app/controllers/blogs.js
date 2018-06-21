const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const Category = mongoose.model('Category');

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

router.get('/categories/:category', (req, res) => {
  Blog.find({ category: req.params.category }).then(blogs => {
    if (blogs)
      res.json({ blogs });
  }).catch(errors => {
    res.status(404).json({ message: errors.message });
  });
});

router.post('/add', (req, res) => {
  const blog = new Blog(req.body.blog);
   blog.slug = req.body.blog.title.split(' ').map( segment => segment.toLowerCase()).join('-');
  blog.save().then( blog => {
    if (blog)
      Category.findOneAndUpdate({ name: blog.category }, { $inc: { blogs: 1} }, { new: true }).then( category => {
        res.json({status: 'ok', blog, category});
      })
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

router.put('/archive/:id', (req, res) => {
  Blog.findById(req.params.id).then( blog => {
    if (blog){
      blog.status = blog.status === 0? 1: 0;
      blog.save().then(blog =>{
        if (blog)
          res.json({status: 'ok', blog});
      });
    }
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

router.get('/*', (req, res) => {
  res.status(505).json({ message: 'You have hit blog wild-route' });
});
