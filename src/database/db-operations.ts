export {};
const User = require('../models/user-model');
const Post = require('../models/posts-model');
const Comment = require('../models/comment-model');

exports.fetchUserByEmail = function(email: string) {
  return User.findOne({
    email: email
  })
  .exec()
  .catch((err: any) => console.log("err occured in fetchUserByEmail", err))
}

// Save user info at the time of registration
exports.regSaveUser = function(email: string, username: string, firstName: string, password: string) {
  const user = new User({
    firstName: firstName, 
    username: username,
    email: email,
    password: password
  });
  return user.save()
  .catch((err: any) => console.log("err occured in regSaveUser ", err))

}

// Fetch Posts

exports.getPosts = function() {
  return Post.find({})
  .exec()
  .catch((err: any) => console.log("err occured in fetchUserByEmail", err))
}

exports.fetchSinglePost = function(code: string) {
  return Post.findOne({code: code}).exec()

}

// Fetch Comments

exports.fetchCommentsForPost = function(postCode: string) {
  return Comment.findOne({postCode: postCode}).exec()
}