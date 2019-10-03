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

exports.getPosts = function(email: string) {
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
// exports.saveComment = function(postId: string, comment: string, username: string) {
  //   console.log(postId, comment, username);
  //   return Comment.findOneAndUpdate(
  //     {postId: ObjectId(postId)},
  //     {
  //       $push: { 
  //          comments: { 
  //           text: comment,
  //           username: username
  //          }
  //       }
  //     },  
  //     {new: true},
  //   )
  //   .exec()
  //   .catch((err: any) => console.log("err occured inside in saveComment operation ", err) )
  // }
  // Fetch Posts
//OLD Schema values 

// {
// 	"_id" : ObjectId("5d8680ad41cb627c17d0f557"),
// 	"postId" : ObjectId("5d728e52cd08f069943317f5"),
// 	"comments" : [
// 		{
// 			"text" : "llllllllll",
// 			"username" : "puri"
// 		},
// 		{
// 			"text" : "lllllllllllll",
// 			"username" : "puri"
// 		},
// 		{
// 			"text" : "lllllllllllllllllllllllllllllllllllllllllllllllll",
// 			"username" : "puri"
// 		},
// 		{
// 			"text" : "purnima",
// 			"username" : "puri"
// 		}
// 	],
// 	"createdAt" : ISODate("2019-09-21T19:57:33.411Z"),
// 	"__v" : 0
// }
