import * as express from 'express';
const dbOperations = require('../database/db-operations');
import Post from '../interfaces/post.interface'
import Comment from '../interfaces/comment.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import { NextFunction } from 'connect';
var ObjectId = require('mongodb').ObjectID

class PostController {
  public path = '/posts';
  public router = express.Router();
  // private post = postModel

  constructor() {
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.get(`${this.path}`, this.fetchPosts)
    this.router.get(`${this.path}/:postId`, this.fetchSinglePost)
    this.router.get(`${this.path}/:postId/comments`, this.fetchCommentsForPost)
    this.router.patch(`${this.path}/:postId/likes`, this.incrementLikes)
  }

  private fetchPosts = async (req: any, res: express.Response, next: express.NextFunction) => {
    // console.log("inside fetchPosts");
    // console.log("req.session.user", req.session.user);
  try {
    if(req.session.user) {
        const posts = await dbOperations.getPosts();
        const postsInfoPromises = posts.map((post: Post) => {
          return dbOperations.fetchCommentsForPost(post._id)
          .then((results: Comment)=> {
            return {
              _id: post._id,
              caption: post.caption,
              likes: post.likes,
              display_src: post.display_src,
              totalComments: results ? results.comments.length : 0
            }
          })
          .catch((err:any) => {
            res.json({
              msg: "err occured"
            })
          })
        });
        
        Promise.all(postsInfoPromises).then((results) => {
          if(results === null) {
            // res.status(200).send('Posts are empty')
            res.status(200).json({ posts: [] })
          }
          else {
            res.status(200).json({posts: results})
          }
          
        }).catch(e => {
          // console.log("error inside promise all", e);
          // res.status(500).json({
          //   msg: "catch error"
          // })
          next(e)
        });
      }
      else  {
        // res.status(401).json({
        //   msg: "user unlogged"
        // });
        next(new NotAuthorizedException())
      }
    }
    catch(e) {
      console.log(e);
      // throw new Error('Inside catch block. not sure what happening');
      // res.status(500).send({msg: 'Server Error.'})
      next(e)
    };
  }

  private fetchSinglePost = async (req:express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // console.log("fetch single posts...........")
        if(!ObjectId.isValid(req.params.postId)){
          // res.status(404).send("No record exist")
          next(new PostNotFoundException(req.params.postId))
        }
        else {
          const postPromise = dbOperations.fetchSinglePost(req.params.postId);
          const commentPromise = dbOperations.fetchCommentsForPost(req.params.postId);
      
          const [post, commentsInfo] = await Promise.all([postPromise, commentPromise]);
          // console.log("post...................", post)
          if(post === null) {
            // res.status(200).send('There is no post with this Id')
            
              next(new PostNotFoundException(req.params.postId))

          }
          else {
            const postInfo = {
              _id: post._id,
              caption: post.caption,
              likes: post.likes,
              display_src: post.display_src,
              totalComments: commentsInfo ? commentsInfo.comments.length : 0
            }
            res.status(200).json({
              post: postInfo
            })
          }
        }    
    } 
    catch(e) {
        console.log("e..................", e)
        // res.status(500).send('Server Error.')
        // next(new PostNotFoundException(req.params.postId))
        next(e)
    };
  }

  private incrementLikes = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("req.params.postId inside incrementLikes", req.params.postId)
    if(ObjectId.isValid(req.params.postId)) {
      const postId = req.body.postId;
      const likes = req.body.likes;
      const post = await dbOperations.incrementLikes(postId, likes)
      if(post) {
        res.json({ post: post})
      }
      else {
        next(new PostNotFoundException(req.params.postId))
      }
      // console.log("After increment the likes", post)
    } 
  }

  private fetchCommentsForPost = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      if(ObjectId.isValid(req.params.postId)){
        const comments = await dbOperations.fetchCommentsForPost(req.params.postId);
        // console.log("comments", comments)
        if(comments === null) {
          // res.status(200).send('There are no comments for this post')
          res.status(200).json({ comments: []})
        }
        else {
          res.status(200).json({ comments: comments})
        } 
      }
      else {
        next(new PostNotFoundException(req.params.postId))
      }
    } catch(e) {
        // res.status(500).send('Server Error.')
        next(e)
    };
  }
}

export default PostController;