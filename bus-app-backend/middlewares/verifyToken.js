const jwt = require("jsonwebtoken")

const { publicKey } = require("../utils/jwt")

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json({ message: "Unauthorized" })

  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" })

    req.userId = decoded.userId
    next()
  })
}

module.exports = verifyToken
