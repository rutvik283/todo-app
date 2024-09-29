class ApiErrors extends Error {
  constructor(
    statuscode,
    message = "Something Went Wrong !!",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statuscode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiErrors };
