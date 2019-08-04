const User = require('../database/models/user-model');
const Post = require('../database/models/posts-model');
const Comment = require('./models/comment-model');

exports.fetchUserByEmail = function(email) {
  return User.findOne({
    email: email
  })
  .exec()
  .catch((err) => console.log("err occured in fetchUserByEmail", err))
}

// Save user info at the time of registration
exports.regSaveUser = function(email, username, firstName, password) {
  const user = new User({
    firstName: firstName, 
    username: username,
    email: email,
    password: password
  });
  return user.save()
  .catch((err) => console.log("err occured in regSaveUser ", err))

}

// Fetch Posts

exports.fetchPosts = function() {
  return Post.find({}).exec()

}

exports.fetchSinglePost = function(code) {
  return Post.findOne({code: code}).exec()

}

// Fetch Comments

exports.fetchCommentsForPost = function(postCode) {
  return Comment.findOne({postCode: postCode}).exec()
}