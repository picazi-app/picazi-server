import { link } from "fs";

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

exports.getPostsCount= function() {
  return Post.find({}).count()
  .exec()
  .catch((err: any) => console.log("err occured in getPostsCount", err))
}

exports.getPosts = function(page: number, limit: number) {
  const skip = page-1;
  return Post.find({}).skip(skip*limit).limit(limit).sort({ createdAt: -1})
  .exec()
  .catch((err: any) => console.log("err occured in getPosts", err))
}

exports.fetchSinglePost = function(id: string) {
  return Post.findOne({
    _id: ObjectId(id)
  }).exec()
}

// Fetch Comments

exports.fetchCommentsForPost = function(postId: string) {
  return Comment.find({
    postId: new ObjectId(postId)
  }).exec()
}

exports.saveComment = function(postId: string, comment: string, username: string) {
  const comments = new Comment({
    postId: new ObjectId(postId), 
    text: comment,
    username: username
  })
  return comments.save()
  .catch((err: any) => console.log("err occured inside saveComment operation ", err) )
}

exports.removeComment = function(_id: string) {
  console.log("id", _id);
  return Comment.deleteOne({
    _id: _id
  })
  .catch((err: any) => console.log("err occured inside removeComment", err))
}

exports.removeAllComments = function(postId: string) {
  console.log("id", postId);
  return Comment.deleteMany({
    postId: postId
  })
  .catch((err: any) => console.log("err occured inside removeComment", err))
}
exports.removePost = function(postId: string) {
  console.log("post to delete", postId);
  return Post.deleteOne({
    _id: postId
  })
  .catch((err: any) => console.log("err occured inside removePost", err))
}

exports.fetchPostsWhereDeletedIsFalse = function() {
  return Post.find({
    delete: false
  })
  .catch((err: any) => console.log("err occured inside removePost", err))
}
