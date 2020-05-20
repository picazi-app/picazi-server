import * as express from 'express';
const dbOperations = require('../database/db-operations');
import Post from '../interfaces/post.interface'
import CommentInterface from '../interfaces/comment.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import { NextFunction } from 'connect';
import HttpException from '../exceptions/HttpException';
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
      const page = parseInt(req.query.page);

      const limit = 10;
      const posts = await dbOperations.getPosts(page, limit);
      const postsCount = await dbOperations.getPostsCount();

      const totalPages = Math.ceil(postsCount/limit);
      
        const postsInfoPromises = posts.map((post: Post) => {
          return Promise.all([
            dbOperations.fetchCommentsForPost(post._id), 
            dbOperations.fetchLikesCountForPost(post._id)
          ])
          .then( ([comments, likes]) => {
            return {
              _id: post._id,
              caption: post.caption,
              likes: likes,
              display_src: post.display_src,
              totalComments: comments ? comments.length : 0
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
            res.status(200).json({posts: results, totalPages: totalPages})
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
          const likePromise = dbOperations.fetchLikesCountForPost(req.params.postId)
      
          const [post, commentsInfo, likes] = await Promise.all([postPromise, commentPromise, likePromise]);
          if(post === null) {
              next(new PostNotFoundException(req.params.postId))

          }
          else {
            const postInfo = {
              _id: post._id,
              caption: post.caption,
              likes: likes,
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
  private incrementLikes = async(req: any, res: express.Response, next: NextFunction) => {
    try {
      if(req.session.user) {
        const postId = req.params.postId;

        if(ObjectId.isValid(postId)){ 
          const email = req.session.user.email;
          const likes = req.params.likes;

          const hasLiked = await dbOperations.hasUserLiked(email, postId);

          if(hasLiked) {
            const deletedLikePost = await dbOperations.deleteLikedPostByUser(email, postId);
            res.status(200).json({
              _id: postId,
              isLiked: false
            })
          } else {
            const incrementLikePost = await dbOperations.incrementLikes(email, postId);
            res.status(200).json({
              _id: postId,
              isLiked: true
            })
          }  

          
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
          Promise.all([
            dbOperations.removePost(postId),
            dbOperations.removeAllComments(postId)
          ]).then( ([deletedPost, deletedComment]) => {
            if (deletedPost && deletedComment) {
              res.status(200).json({
                postId,
              });
            } else {
              next(new HttpException(500, "Some error occurred while trying to remove post / comment"));
            }
          });
        } else {
          next(new PostNotFoundException(postId));
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