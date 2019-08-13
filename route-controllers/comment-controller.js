const Comment = require('../database/models/comment-model')
const dbOperations = require('../database/db-operations');

exports.fetchCommentsForPost= async function(req, res, next) {

  try {
    const comments = await dbOperations.fetchCommentsForPost(req.params.postId);
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