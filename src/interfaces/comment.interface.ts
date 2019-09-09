interface Comments {
  postId: number;
  comments: SingleComment[];
}

interface SingleComment {
  text: string;
  user: string; 
}

export default Comments