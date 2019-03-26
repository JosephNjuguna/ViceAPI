class Responses {
  static handleSuccess(response, message, result) {
    res.status(message[0]).json({
      success: message[2],
      message: message[1],
    });
  }

  static handleError(message, statusCode, response) {
    response.status(statusCode).json({
      success: false,
      message: message
    });
  }
}

module.exports = Responses;