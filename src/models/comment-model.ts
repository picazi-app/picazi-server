// export {};
  import * as mongoose from 'mongoose';
import Comment from '../interfaces/comment.interface';

/**
 *  User's Schema.
 *
 */

 let CommentsSchema = new mongoose.Schema({
   postId: {type:  mongoose.Schema.Types.ObjectId, required: true},
   text: {type: String, required: true },
   username: {type: String,  required: true },
   createdAt: {type: Date, default: Date.now, required: true},
 })
//  let CommentsSchema = new mongoose.Schema({
//    postId: {type:  mongoose.Schema.Types.ObjectId, required: true},
//    comments: [
//       {
//         _id: false,
//         text: { type: String, required: true },
//         username: { type: String,  required: true, unique: true}
//       }
//     ],
//     createdAt: { type: Date, default: Date.now, required: true},
//  })


//  CommentsSchema.index({"postId": 1});


 module.exports = mongoose.model<Comment & mongoose.Document>('Comment', CommentsSchema);
