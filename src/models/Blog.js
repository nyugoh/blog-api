const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: { type: String },
  content: {
    type: String,
    default: "This is a test blog. Lorem ipsum text"
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: "https://www.emberjs.com/img/tomsters/emberconf-2017-fcff003f.png"
  },
  imageCpation: {
    type: String,
    default: "https://vignette.wikia.nocookie.net/epic-rap-battles-of-cartoons/img/c/cb/SpongeBob.png/revision/latest?cb=20131030015532"
  },
  category: { type: String },
  status: {
    type: Number,
    default: 0
  }
}, { timestamps: true });


module.exports = mongoose.model('Blog', BlogSchema);
