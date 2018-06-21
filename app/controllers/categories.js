const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = mongoose.model('Category');

module.exports = (app) => {
  app.use('/api/v1/blog/categories', router);
};

router.get('/list', (req, res) => {
  Category.aggregate([
    {
      $lookup: {
        "from": "blogs",
        "localField": "name",
        "foreignField": "category",
        "as": "articles"
      }
    }
  ]).then( categories => {
    if (categories)
      res.json({ categories});
  }).catch( errors =>{
    res.status(404).json({message: errors.message});
  });
});

router.post('/add', (req, res) => {
  const category = new Category(req.body.skill);
   category.slug = req.body.skill.name.split(' ').map( segment => segment.toLowerCase()).join('-');
  category.save().then( category => {
    if (category)
      res.json({status: 'ok', category});
  }).catch( errors =>{
    res.status(404).json({message: errors.message});
  });
});

router.put('/edit', (req, res) => {
  Category.findByIdAndUpdate(req.body.skill._id, req.body.skill, { new: true }).then( category => {
    if (category)
      res.json({status: 'ok', category});
  }).catch( errors =>{
    res.status(404).json({message: errors.message});
  });
});

router.delete('/delete/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id).then( response => {
    if (response)
      res.json({ status: 'ok', id: req.params.id });
  }).catch( errors =>{
    res.status(404).json({ message: errors.message });
  });
});

router.get('/*', (req, res) => {
  res.status(505).json({ message: 'You have hit a wild-route' });
});
