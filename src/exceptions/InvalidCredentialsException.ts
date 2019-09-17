import HttpException from './HttpException';

class InvalidCredentialsException extends HttpException {
  constructor() {
    super(401, "Email/password is incorrect")
  }
}

export default InvalidCredentialsException;