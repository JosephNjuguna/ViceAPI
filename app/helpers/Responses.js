class Responses {
  static handleSignupsuccess(statusCode, message, token, data, res) {
    res.status(statusCode).json({
      status: statusCode,
      message,
      token,
      data,
    });
  }

  static handleSuccess(statusCode, message, data, res) {
    res.status(statusCode).json({
      status: statusCode,
      message,
      data,
    });
  }

  static handleError(statusCode, message, res) {
    res.status(statusCode).json({
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

module.exports = Responses;
