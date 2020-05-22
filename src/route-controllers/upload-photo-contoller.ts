import * as express from 'express';
const dbOperations = require('../database/db-operations');
const Post = require('../models/posts-model');
const upload = require('../services/upload-photo-aws');
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import FileUploadException from '../exceptions/FileUploadException';
const ObjectId = require('mongoose').Types.ObjectId; 
const singleUpload = upload.single('imageData');

class PhotoController {
  public path = '/uploads';
  public router = express.Router();
  // private post = postModel

  constructor() {
    this.initializeRouters();
    // this.fileStorage();
  }

  private initializeRouters() {
    this.router.post(`${this.path}/upload-photo`, this.uploadPhoto)
    // this.router.post(`${this.path}/get-photo/:photoId`, this.getPhoto)
  }

  private uploadPhoto = async (req: any, res: express.Response, next: express.NextFunction) => { 
    try {
      if(req.session.user) {
        const email = req.session.user.email;
        const user = await dbOperations.fetchUserByEmail(email);
        if(user) {
          singleUpload(req, res, function(err: any) {
            if (err) {
              return next(new FileUploadException(err.message))
            } 
            else {
              if(req.file === undefined) {
                res.json({ error: 'No file selected'})
              } 
              else {
                const post1 = new Post({
                  email: user.email,
                  display_src: req.file.location,
                  likes: 0,
                  caption: ""  
                });
                post1.save((err: any) => {
                  if(err) {
                    console.log(err);
                    return;
                  }
                  res.status(200).json({ data: 'Post data saved successfully', imageUrl: req.file.location })
                })
              }
             
            }
          });

        } else {
          next(new NotAuthorizedException());
        }

      } else {
        next(new NotAuthorizedException());
      }
    }
    catch(exception) {
      console.log("upload photo exception");
    }
  }
}

export default PhotoController;
