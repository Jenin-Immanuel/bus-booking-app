function errorHandler(err, req, res, next) {
  console.log(1)
  let message = "Something broke!"
  if (err.message) {
    message = err.message
  }

  //   let message = err.messgae ? err.messgae : "Something broke!"
  let statusCode = err.statusCode ? err.statusCode : 500

  console.error(err.stack)
  return res.status(statusCode).json({ status: "error", message: message })
}

module.exports = errorHandler
