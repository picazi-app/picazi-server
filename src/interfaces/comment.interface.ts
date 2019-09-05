interface Comments {
  postCode: string;
  comments: SingleComment[];
}

interface SingleComment {
  text: string;
  user: string; 
}

export default Comments