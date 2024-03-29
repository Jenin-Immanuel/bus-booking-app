function logger(req, res, next) {
  console.log("\n-----------------------------")
  console.log("Request Url: ", req.originalUrl)
  console.log("Request Method: ", req.method)
  next()
}

module.exports = logger
