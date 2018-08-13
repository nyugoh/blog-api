'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  message: {
    type: String
  },
  subject: {
    type: String
  }
}, { timestamps: true });

mongoose.model('Message', MessageSchema);