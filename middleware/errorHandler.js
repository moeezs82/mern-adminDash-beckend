const { logEvents } = require("./logger");

const errorHandler = (error, req, res, next) => {
  logEvents(
    `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "error.log"
  );
  console.log(error.stack);

  const status = res.statusCode ? res.statusCode : 500; //server error

  //if wrong mongodb id error
  //invalid id for mongo
  if (error.name === "CastError") {
    return res.status(404).json({
      success: false,
      message: `Resource not found. Invalid ${error.path}`,
    });
  }

  //wrong jwt error
  if (error.name === "JsonWebTokenError") {
    return res.status(400).json({
      success: false,
      message: `json web token is invalid try again`,
    });
  }

  //jwt expire error
  if (error.name === "TokenExpiredError") {
    return res.status(400).json({
      success: false,
      message: `json web token is expired, please longin again`,
    });
  }

  //checking if error is for duplicate email
  if (error.keyValue?.email && error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: `Email already exists`,
    });
  }

  if (error.name === "ValidationError") {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "TypeError") {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.status(status).json({
    success: false,
    message: error.message,
  });
};

module.exports = errorHandler;
