import 'dotenv/config';
import App from './app';
import PostController from './route-controllers/post-controller';
import UserController from './route-controllers/user-controller';
import SessionController from './route-controllers/session-controller';
import UploadPhotoController from './route-controllers/upload-photo-contoller';

const app = new App([
  new SessionController(),
  new PostController(),
  new UserController(),
  new UploadPhotoController(),
])

app.listen();
