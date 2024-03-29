const jwt = require("jsonwebtoken")

const { publicKey } = require("../utils/jwt")

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1]

  if (!token) return res.status(401).json({ message: "Unauthorized" })

  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" })
    req.email = decoded.email
    next()
  })
}

module.exports = verifyToken
