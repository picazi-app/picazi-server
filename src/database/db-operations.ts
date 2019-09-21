import comments from "./sample-comments";

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

exports.fetchUserByUserName = function(username: string) {
  return User.findOne({
    username: username
  })
  .exec()
  .catch((err: any) => console.log("err occured in fetchUserByUserName", err))
}

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

exports.incrementLikes = function(postId: string, likes: number) {
  return Post.findByIdAndUpdate(
    postId, 
    { $inc: { likes: 1 }},
    {new: true},
  )
  .exec()
  .catch((err: any) => console.log("err occured inside in INCREEMENT_LIKES ", err) )
}

exports.saveComment = function(postId: string, comment: string, username: string) {
  console.log(postId, comment, username);
  return Comment.findOneAndUpdate(
    {postId: ObjectId(postId)},
    {
      $push: { 
         comments: { 
          text: comment,
          username: username
         }
      }
    },  
    {new: true},
  )
  .exec()
  .catch((err: any) => console.log("err occured inside in saveComment operation ", err) )
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