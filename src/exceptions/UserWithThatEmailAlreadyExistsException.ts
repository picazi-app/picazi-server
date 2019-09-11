import HttpException from './HttpException';

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(val: string) {
    super(403, `${val}`);
  }
}

export default UserWithThatEmailAlreadyExistsException;