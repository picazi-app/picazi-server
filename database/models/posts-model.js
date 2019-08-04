var mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 *  User's Schema.
 *
 */

 let postSchema = mongoose.Schema({
  code: { type: String, required: true },
  caption: { type: String, required: true },
  likes: Number,
  display_src: { type: String, required: true },
 })

 module.exports = mongoose.model('Post', postSchema);
