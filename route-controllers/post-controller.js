const User = require('../database/models/user-model')
const dbOperations = require('../database/db-operations');

exports.fetchPosts = async function(req, res, next) {

  try {
    const posts = await dbOperations.fetchPosts();

    const postsInfoPromises = posts.map(post => {
      return dbOperations.fetchCommentsForPost(post.code)
      .then(results => {
        return {
          code: post.code,
          caption: post.caption,
          likes: post.likes,
          display_src: post.display_src,
          totalComments: results ? results.comments.length : 0
        }
      })
    });

    // const postsInfoPromises = posts.map(async function(post) {
    //   const comments = await dbOperations.fetchCommentsForPost(post.code);
    //   console.log(comments);
    //   return {
    //     code: post.code,
    //     caption: post.caption,
    //     likes: post.likes,
    //     display_src: post.display_src,
    //     totalComments: comments ? comments.length : 0
    //   }
    // });


    
    Promise.all(postsInfoPromises).then((results) => {
      if(results === null) {
        res.status(200).send('Posts are empty')
      }
      else {
        res.status(200).json({posts: results})
      }
      
    }).catch(e => {
      console.log(e);
    });
  }
  catch(e) {
    console.log(e)
    res.status(500).send('Server Error.')
  };
}


exports.fetchSinglePost = async function(req, res, next) {

  try {
    const post = await dbOperations.fetchSinglePost(req.params.postId);
    if(post === null) {
      res.status(200).send('There is no post with this Id')
    }
    else {
      res.status(200).json({post: post})
    } 
  } catch(e) {
      console.log(e)
      res.status(500).send('Server Error.')
  };

}
  


  