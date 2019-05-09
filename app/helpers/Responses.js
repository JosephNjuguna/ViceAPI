class Responses {
  static handleSignupsuccess(statusCode, message, token, data, res) {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      token,
      data,
    });
  }

  static handleSuccess(statusCode, message, data, res) {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      data,
    });
  }

  static handleError(statusCode, message, res) {
    return res.status(statusCode).json({
      status: statusCode,
      message,
    });
  }

  static internalError(res) {
    res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
}

export default Responses;
