export {};
const User = require('../models/user-model');
const Post = require('../models/posts-model');
const Comment = require('../models/comment-model');
const ObjectId = require('mongoose').Types.ObjectId; 

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
// Increment the like counter

exports.incrementLikes = function(postId: string, likes: number) {
  // const id = request.params.id;
  //   const postData: Post = request.body;
  return Post.findByIdAndUpdate(
    {_id: ObjectId(postId)}, 
    { $inc: { likes: 1 }},
    {new: true},
  )
  .exec()
  .catch((err: any) => console.log("err occured inside in INCREEMENT_LIKES ", err) )
}

// Fetch Posts

exports.getPosts = function() {
  return Post.find({})
  .exec()
  .catch((err: any) => console.log("err occured in fetchUserByEmail", err))
}

exports.fetchSinglePost = function(id: string) {
  return Post.findOne({
    _id: ObjectId(id)
  }).exec()
}

// Fetch Comments

exports.fetchCommentsForPost = function(postId: string) {
  return Comment.findOne({
    postId: new ObjectId(postId)
  }).exec()
}