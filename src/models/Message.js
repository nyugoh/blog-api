const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  name:{
    type: String
  },
  email: {
    type: String
  },
  message: {
    type: String,
  },
  subject: {
    type: String,
  }
}, { timestamps: true });


mongoose.model('Message', MessageSchema);
