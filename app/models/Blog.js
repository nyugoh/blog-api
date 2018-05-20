const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  content: {
    type: String,
    default: "This is a test blog. Lorem ipsum text"
  },
  imageUrl: {
    type: String,
    default: "https://vignette.wikia.nocookie.net/epic-rap-battles-of-cartoons/images/c/cb/SpongeBob.png/revision/latest?cb=20131030015532"
  },
  imageCpation: {
    type: String,
    default: "https://vignette.wikia.nocookie.net/epic-rap-battles-of-cartoons/images/c/cb/SpongeBob.png/revision/latest?cb=20131030015532"
  },
  category: {
    type: String
  }
}, { timestamps: true });


mongoose.model('Blog', BlogSchema);
