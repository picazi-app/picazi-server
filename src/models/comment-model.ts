// export {};
  import * as mongoose from 'mongoose';
import Comment from '../interfaces/comment.interface';

/**
 *  User's Schema.
 *
 */

 let CommentsSchema = new mongoose.Schema({
   postId: {type:  mongoose.Schema.Types.ObjectId, required: true},
   comments: [
    {
      text: { type: String, required: true },
      user: { type: String,  required: true}
    }
  ]

 })

//  CommentsSchema.index({"postId": 1});


 module.exports = mongoose.model<Comment & mongoose.Document>('Comment', CommentsSchema);
