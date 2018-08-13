'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  blogs: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: "https://vignette.wikia.nocookie.net/epic-rap-battles-of-cartoons/images/c/cb/SpongeBob.png/revision/latest?cb=20131030015532"
  }
}, { timestamps: true });

// CategorySchema.pre('save', next =>{
//   CategorySchema.slug = CategorySchema.name.split(' ').map( segment => segment.toLowerCase()).join('-');
//   next();
// });

module.exports = mongoose.model('Category', CategorySchema);
