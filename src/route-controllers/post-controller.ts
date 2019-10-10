import * as express from 'express';
const dbOperations = require('../database/db-operations');
import Post from '../interfaces/post.interface'
import CommentInterface from '../interfaces/comment.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import { NextFunction } from 'connect';
import comments from '../database/sample-comments';
const Comment = require('../models/comment-model');

var ObjectId = require('mongodb').ObjectID

class PostController {
  public path = '/posts';
  public router = express.Router();

  constructor() {
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.get(`${this.path}`, this.fetchPosts)
    this.router.get(`${this.path}/:postId`, this.fetchSinglePost)
    this.router.delete(`${this.path}/:postId`, this.removeSinglePost)
    this.router.get(`${this.path}/:postId/comments`, this.getCommentsForPost)
    this.router.post(`${this.path}/:postId/comments`, this.saveCommentForPost)
    this.router.delete(`${this.path}/:postId/comments`, this.removeCommentForPost)
    this.router.patch(`${this.path}/:postId/likes`, this.incrementLikes)
  }

  private fetchPosts = async (req: any, res: express.Response, next: express.NextFunction) => {
  try {
    if(req.session.user) {
        const email = req.session.user.email;

        const posts = await dbOperations.getPosts();
        
        const postsInfoPromises = posts.map((post: Post) => {
          return dbOperations.fetchCommentsForPost(post._id)
          .then((results: any)=> {
            return {
              _id: post._id,
              caption: post.caption,
              likes: post.likes,
              display_src: post.display_src,
              totalComments: results ? results.length : 0
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
            res.status(200).json({ posts: [] })
          }
          else {
            res.status(200).json({posts: results})
          }
          
        }).catch(e => {
          next(e)
        });
      }
      else  {
        next(new NotAuthorizedException())
      }
    }
    catch(e) {
      console.log(e);
      next(e)
    };
  }

  private fetchSinglePost = async (req:express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if(!ObjectId.isValid(req.params.postId)){
          next(new PostNotFoundException(req.params.postId))
        }
        else {
          const postPromise = dbOperations.fetchSinglePost(req.params.postId);
          const commentPromise = dbOperations.fetchCommentsForPost(req.params.postId);
      
          const [post, commentsInfo] = await Promise.all([postPromise, commentPromise]);
          if(post === null) {
              next(new PostNotFoundException(req.params.postId))

          }
          else {
            const postInfo = {
              _id: post._id,
              caption: post.caption,
              likes: post.likes,
              display_src: post.display_src,
              totalComments: commentsInfo ? commentsInfo.length : 0
            }
            res.status(200).json({
              post: postInfo
            })
          }
        }    
    } 
    catch(e) {
        console.log("e..................", e)
        // next(new PostNotFoundException(req.params.postId))
        next(e)
    };
  }

  private incrementLikes = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    } 
  }

  private getCommentsForPost = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const id = req.params.postId;
      if(ObjectId.isValid(id)){
        let comments = await dbOperations.fetchCommentsForPost(id);
        res.status(200).json({ comments: comments})
      }
      else {
        next(new PostNotFoundException(req.params.postId))
      }
    } catch(e) {
        // res.status(500).send('Server Error.')
        next(e)
    };
  }

  private saveCommentForPost = async (req: any, res: express.Response, next: NextFunction) => {
    try {
      if(req.session.user) {
        const postId = req.params.postId;

        if(ObjectId.isValid(postId)){ 
          const email = req.session.user.email;
          const comment = req.body.comment;

          const user = await dbOperations.fetchUserByEmail(email);

          const commentToSave = await dbOperations.saveComment(postId, comment, user.username);
          const fetchComments = await dbOperations.fetchCommentsForPost(postId);
          // console.log(fetchComments)
      
          
          res.status(200).json({
            comments: fetchComments
          })
          
        }
      }else {
        next(new NotAuthorizedException())
      }
    }catch(e){
        next(e)
    }
  }

  private removeCommentForPost = async (req: any, res: express.Response, next: express.NextFunction) => {

    try {
      if(req.session.user) {
        const postId = req.params.postId;
        const email = req.session.user.email;
        const commentId = req.body.commentId;
        const user = await dbOperations.fetchUserByEmail(email);

        if(ObjectId.isValid(postId) && user){ 
          const commentToRemove = await dbOperations.removeComment(commentId)
          const fetchComments = await dbOperations.fetchCommentsForPost(postId);
          console.log("commentToRemove is ", commentToRemove)
      
          
          res.status(200).json({
            comments: fetchComments
          })
        }
      }else {
        next(new NotAuthorizedException())
      }
    }catch(e){
        next(e)
    }

  }

  private removeSinglePost = async (req: any, res: express.Response, next: express.NextFunction) => {

    try {
      if(req.session.user) {
        const postId = req.params.postId;
        const email = req.session.user.email;

        const user = await dbOperations.fetchUserByEmail(email);

        if(ObjectId.isValid(postId) && user){ 

          const postToRemove = await dbOperations.removePost(postId)
          const commentsToRemove = await dbOperations.removeAllComments(postId);

          const postsToDisplay = await dbOperations.getPosts();
          
          console.log("postToRemove ", postToRemove)
          console.log("commentToRemove is ", commentsToRemove)
          
          
          res.status(200).json({
            posts: postsToDisplay
          })
        }
      }else {
        next(new NotAuthorizedException())
      }
    }catch(e){
        next(e)
    }

  }

}

export default PostController;