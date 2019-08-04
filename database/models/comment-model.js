var mongoose = require('mongoose');

/**
 *  User's Schema.
 *
 */

 let CommentsSchema = mongoose.Schema({
   postCode: {type: String, required: true},
   comments: [
    {
      text: { type: String, required: true },
      user: { type: String,  required: true}
    }
  ]

 })

 module.exports = mongoose.model('Comment', CommentsSchema);
