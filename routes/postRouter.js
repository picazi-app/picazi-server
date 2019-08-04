var express = require('express');
var router = express.Router();
var postController = require('../route-controllers/post-controller')
var commentController = require('../route-controllers/comment-controller')

router.get('/', postController.fetchPosts)

router.get('/:postId', postController.fetchSinglePost)

router.get('/:postId/comments', commentController.fetchCommentsForPost)

module.exports = router;