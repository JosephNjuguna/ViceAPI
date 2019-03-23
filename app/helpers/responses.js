class Responses {
  static handleSuccess(response, message, result) {
    res.status(message[0]).json({
      success: message[2],
      message: message[1],
      result,
    });
  }

  static handleError(error, statusCode, response) {
    response.status(statusCode).json({
      success: false,
      error,
    });
  }
}

module.exports = Responses;