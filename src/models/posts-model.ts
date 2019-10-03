// export {};
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
import * as mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';
import Post from '../interfaces/post.interface'
/**
 *  User's Schema.
 *
 */

 let postSchema = new mongoose.Schema({
  // _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: {type: String, required: true, trim: true},
  caption: { type: String },
  likes: { type: Number, default:0},
  display_src: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true},
 })

//  postSchema.plugin(mongoose_delete, { deletedAt : true });

 module.exports = mongoose.model<Post & mongoose.Document>('Post', postSchema);
