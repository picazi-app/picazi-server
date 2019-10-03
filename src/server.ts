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

//  "build": "tsc -p .",
// "build:live": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/server.ts"

// "clean": "rimraf dist",
// "start": "npm-run-all clean --parallel watch:build watch:server --print-label",
// "watch:build": "tsc --watch",
// "watch:server": "nodemon './dist/server.js' --watch './dist'",
// "tsc": "tsc"
// "build:live": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/server.ts --watch ./lib"

// docker ke liye
// "build:live": "nodemon './lib/server.js' --watch './dist'"