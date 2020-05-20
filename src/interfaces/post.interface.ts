 interface Post {
   email?: string;
  _id?: string;
  caption: string;
  likes: number;
  display_src: string;
  createdAt: Date;
}

export default Post;