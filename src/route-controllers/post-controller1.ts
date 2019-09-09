import * as express from 'express';
const dbOperations = require('../database/db-operations');
import Post from '../interfaces/post.interface'
import Comment from '../interfaces/comment.interface';

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
  }

  private fetchPosts = async (req: any, res: express.Response, next: express.NextFunction) => {
    console.log("inside fetchPosts");
    console.log("req.session.user", req.session.user);
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
            res.status(200).send('Posts are empty')
          }
          else {
            res.status(200).json({posts: results})
          }
          
        }).catch(e => {
          console.log("error inside promise all", e);
          res.status(500).json({
            msg: "catch error"
          })
        });
      }
      else  {
        res.status(401).json({
          msg: "user unlogged"
        });
      }
    }
    catch(e) {
      console.log(e);
      // throw new Error('Inside catch block. not sure what happening');
      res.status(500).send({msg: 'Server Error.'})
    };
  }

  private fetchSinglePost = async (req:express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      console.log("req.params.postId", req.params.postId)
      const postPromise = dbOperations.fetchSinglePost(req.params.postId);
      const commentPromise = dbOperations.fetchCommentsForPost(req.params.postId);
  
      const [post, commentsInfo] = await Promise.all([postPromise, commentPromise]);
  
      if(post === null) {
        res.status(200).send('There is no post with this Id')
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
    } catch(e) {
        console.log(e)
        res.status(500).send('Server Error.')
    };
  }

  private fetchCommentsForPost = async (req: express.Request, res: express.Response) => {
    try {
      const comments = await dbOperations.fetchCommentsForPost(req.params.postId);

      console.log("comments", comments)
      if(comments === null) {
        res.status(200).send('There are no comments for this post')
      }
      else {
        res.status(200).json({comments: comments})
      } 
    } catch(e) {
        res.status(500).send('Server Error.')
    };
  }
}

export default PostController;