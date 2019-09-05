// export {};
// const mongoose = require('mongoose');
import * as mongoose from 'mongoose';
import User from '../interfaces/user.interface';
/**
 *  User's Schema.
 *
 */

 let userSchema = new mongoose.Schema({
   username: { type: String, required: true },
   email: { type: String, trim: true },
   password: { type: String },
   createdAt: { type: Date, default: Date.now, required: true},
   firstName: { type: String }
 })

 module.exports = mongoose.model<User & mongoose.Document>('User', userSchema);

//  module.exports.User = User;

// "start": "node ./bin/www",
//     "devstart": "nodemon ./bin/www"