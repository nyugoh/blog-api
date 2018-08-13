'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Category');

module.exports = function (app) {
  app.use('/api/v1/categories', router);
};

router.get('/list', function (req, res) {
  Category.aggregate([{
    $lookup: {
      "from": "blogs",
      "localField": "name",
      "foreignField": "category",
      "as": "articles"
    }
  }]).then(function (categories) {
    if (categories) res.json({ categories: categories });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.post('/add', function (req, res) {
  var category = new Category(req.body.skill);
  category.slug = req.body.skill.name.split(' ').map(function (segment) {
    return segment.toLowerCase();
  }).join('-');
  category.save().then(function (category) {
    if (category) res.json({ status: 'ok', category: category });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.put('/edit', function (req, res) {
  Category.findByIdAndUpdate(req.body.skill._id, req.body.skill, { new: true }).then(function (category) {
    if (category) res.json({ status: 'ok', category: category });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.delete('/delete/:id', function (req, res) {
  Category.findByIdAndRemove(req.params.id).then(function (response) {
    if (response) res.json({ status: 'ok', id: req.params.id });
  }).catch(function (errors) {
    res.status(404).json({ message: errors.message });
  });
});

router.get('/*', function (req, res) {
  res.status(505).json({ message: 'You have hit a wild-route' });
});