const Comment = require('../../models/comment-model');
const Post = require('../../models/posts-model');
var mongoose = require('mongoose');
import Comments from '../../interfaces/comment.interface';
const samplePosts = require("./sample-posts");
const sampleComments = require("./sample-comments");

function insertPostsAndComments() {

let dbURL = 'mongodb://localhost:27017/reduxtagram-server';

  mongoose.connect(dbURL, { useNewUrlParser: true}, function(err: any){
    if(err) {
      console.log('Error connecting to: ', dbURL)
    }
    else {
      console.log('Connected to : ' + dbURL);

      Post.collection.insert(samplePosts.default, async function (err: any, docs: any) {
        if (err){ 
            return console.error(err);
        } else {
          const posts = await Post.find({})
            .exec()
            .catch((err: any) => console.log("err occured in fetching posts", err));

          const comments: Comments[] = []
          posts.map((post:any, i: any) => {
            comments.push({
              ...sampleComments.default[i],
              postId: post._id
            })
          });

          Comment.collection.insert(comments, async function(err: any, docs: any){
            if(err) {
              return console.error(err)
            } else {
              const comments = await Comment.find({})
                .exec()
                .catch((err: any) => console.log("err occured in fetching comments", err))
                console.log("comments");
                console.log(comments);
            }
          })        
        }
      });
    }
  });
}

insertPostsAndComments();