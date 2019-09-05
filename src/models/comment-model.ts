// export {};
import * as mongoose from 'mongoose';
import Comment from '../interfaces/comment.interface';

/**
 *  User's Schema.
 *
 */

 let CommentsSchema = new mongoose.Schema({
   postCode: {type: String, required: true},
   comments: [
    {
      text: { type: String, required: true },
      user: { type: String,  required: true}
    }
  ]

 })

 module.exports = mongoose.model<Comment & mongoose.Document>('Comment', CommentsSchema);
