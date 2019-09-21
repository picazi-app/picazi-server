import HttpException from './HttpException';

class ThisUserNameExistsException extends HttpException {
  constructor(val: string) {
    super(403, `${val}`);
  }
}

export default ThisUserNameExistsException;