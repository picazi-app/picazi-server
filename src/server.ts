import App from './app1';
import PostController from './route-controllers/post-controller1';
import UserController from './route-controllers/user-controller1';
import SessionController from './route-controllers/session-controller1';
import UploadPhotoController from './route-controllers/upload-photo-contoller';
import 'dotenv/config';

const app = new App([
  new SessionController(),
  new PostController(),
  new UserController(),
  new UploadPhotoController(),
])

app.listen();