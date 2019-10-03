import * as express from 'express';
const dbOperations = require('../database/db-operations');
import Post from '../interfaces/post.interface'
const Post = require('../models/posts-model');
const upload = require('../services/upload-photo-aws');
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
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
              return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
            } 
            else {
              // no error   
              // const post = new Post({ _id: { type: Schema.ObjectId, auto: true }});
              // console.log(post);
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
                console.log("req.file.image", req.file.image)
                console.log("req.file.location",req.file.location)
                console.log("Post data after creating Post object ", post1)
                post1.save((err: any) => {
                  if(err) {
                    console.log(err);
                    return;
                  }
                  res.status(200).json({ data: 'Post data saved successfully', imageUrl: req.file.location })
                })
              }
              // post.save()
              //   .then((postData: Post) => {
              //     res.status(200).json({ data: 'Post data saved successfully', imageUrl: req.file.location })
              //   })
              //   .catch(() => {
              //     res.status(400).json({
              //       error: "coundn't save the data"
              //     })
              //   })
              // return res.json({'imageUrl': req.file.location});
            }
          })
        }
      }
       else {
          next(new NotAuthorizedException())
      }
    }
    catch(exception) {
      console.log("upload photo exception")
    }
  }
}

export default PhotoController;