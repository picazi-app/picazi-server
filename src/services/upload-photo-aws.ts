const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

import { AWS_ACCESS_KEYID, AWS_SECRET_ACCESS_KEY, BUCKET} from '../config'

aws.config.update({
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  accessKeyId: AWS_ACCESS_KEYID,
  region: 'us-east-2',
});

const s3 = new aws.S3();

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: any)=> {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: BUCKET,
    acl: 'public-read',
    metadata: function (req: Express.Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req: Express.Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) {
      cb(null, file.originalname + "_" + Date.now().toString());
    },
    limits:{ fileSize: 4000000 }, // In bytes: 2000000 bytes = 4 MB
  })
})

module.exports = upload;