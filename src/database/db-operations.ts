const User = require('../models/user-model');
const Post = require('../models/posts-model');
const Comment = require('../models/comment-model');
const Like = require('../models/like-model');
const ObjectId = require('mongoose').Types.ObjectId; 

export function fetchUserByEmail(email: string) {
  return User.findOne({
    email: email
  })
  .exec()
  .catch((err: any) => console.log("err occured in fetchUserByEmail", err))
}

export function fetchUserByUserName(username: string) {
  return User.findOne({
    username: username
  })
  .exec()
  .catch((err: any) => console.log("err occured in fetchUserByUserName", err))
}

export function regSaveUser(email: string, username: string, firstName: string, password: string) {
  const user = new User({
    firstName: firstName, 
    username: username,
    email: email,
    password: password
  });
  return user.save()
  .catch((err: any) => console.log("err occured in regSaveUser ", err))

}

export function hasUserLiked(email, postId) {
  return Like.findOne({
    email: email,
    postId: postId
  })
  .exec()
  .catch((err) => console.log(err))
}

export function deleteLikedPostByUser(email, postId) {
  return Like.deleteOne({
    email: email,
    postId: postId
  })
  .exec()
  .catch((err) => console.log(err))
}

export function incrementLikes(email: string, postId: string) {
  const like = new Like({
    email,
    postId,
  });
  return like.save()
  .catch((err: any) => console.log("err occured in regSaveUser ", err))
}

export function fetchLikesCountForPost(postId: string) {
  return Like.find({postId: ObjectId(postId)}).count()
  .exec()
  .catch((err: any) => console.log("err occured in getPostsCount", err))
}

export function getPostsCount() {
  return Post.find({}).count()
  .exec()
  .catch((err: any) => console.log("err occured in getPostsCount", err))
}

export function getPosts(page: number, limit: number) {
  const skip = page-1;
  return Post.find({}).skip(skip*limit).limit(limit).sort({ createdAt: -1})
  .exec()
  .catch((err: any) => console.log("err occured in getPosts", err))
}

export function fetchSinglePost(id: string) {
  return Post.findOne({
    _id: ObjectId(id)
  }).exec()
}

export function removePost(postId: string) {
  return Post.deleteOne({
    _id: postId
  })
  .catch((err: any) => console.log("err occured inside removePost", err))
}

// Fetch Comments

export function fetchCommentsForPost(postId: string) {
  return Comment.find({
    postId: new ObjectId(postId)
  }).exec()
}

export function saveComment(postId: string, comment: string, username: string) {
  const comments = new Comment({
    postId: new ObjectId(postId), 
    text: comment,
    username: username
  })
  return comments.save()
  .catch((err: any) => console.log("err occured inside saveComment operation ", err) )
}

export function removeComment(_id: string) {
  return Comment.deleteOne({
    _id: _id
  })
  .catch((err: any) => console.log("err occured inside removeComment", err))
}

export function removeAllComments(postId: string) {
  console.log("id", postId);
  return Comment.deleteMany({
    postId: postId
  })
  .catch((err: any) => console.log("err occured inside removeComment", err))
}

export function fetchPostsWhereDeletedIsFalse() {
  return Post.find({
    delete: false
  })
  .catch((err: any) => console.log("err occured inside removePost", err))
}
