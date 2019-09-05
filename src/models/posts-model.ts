// export {};
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
import * as mongoose from 'mongoose';
import Post from '../interfaces/post.interface'
/**
 *  User's Schema.
 *
 */

 let postSchema = new mongoose.Schema({
  code: { type: String, required: true },
  caption: { type: String, required: true },
  likes: Number,
  display_src: { type: String, required: true },
 })

 module.exports = mongoose.model<Post & mongoose.Document>('Post', postSchema);
