
var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000
    },
    avatar: {
      type: String,
      required: true
    },
    createdAt: { type: String },
    updatedAt: { type: String }
  });

module.exports = new mongoose.model('Image', imageSchema);