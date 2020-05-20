// export {};
import * as mongoose from 'mongoose';
import Like from '../interfaces/like.interface';

/**
 *  Like's Schema.
 *
 */

 let likeSchema = new mongoose.Schema({
   email: {type: String, required: true, trim: true },
   postId: {type: mongoose.Schema.Types.ObjectId, required: true},
   createdAt: {type: Date, default: Date.now, required: true},
 })

 module.exports = mongoose.model<Like & mongoose.Document>('Like', likeSchema);
