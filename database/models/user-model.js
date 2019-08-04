var mongoose = require('mongoose');

/**
 *  User's Schema.
 *
 */

 let userSchema = mongoose.Schema({
   username: { type: String, required: true },
   email: { type: String, trim: true },
   password: { type: String },
   createdAt: { type: Date, default: Date.now, required: true},
   firstName: { type: String }
 })

 module.exports = mongoose.model('User', userSchema);

//  module.exports.User = User;