class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
  }
}

export default HttpException;

// //TODO: convert to functional class
// class AppError extends Error {
//   constructor(message) {
//       super();
//       // Maintains proper stack trace for where our error was thrown (only available on V8)
//       if (Error.captureStackTrace) {
//           Error.captureStackTrace(this, this.constructor);
//       }
//       this.error = true;
//       this.name = this.constructor.name;
//       this.message = message;
//       this.code = 'application/unknown-error';
//   }
// }


// module.exports = AppError