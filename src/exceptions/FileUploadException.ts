import HttpException from './HttpException';

class FileUploadException extends HttpException {
  constructor(err: string) {
    super(422, err)
  }
}

export default FileUploadException;