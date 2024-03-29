const jwt = require("jsonwebtoken")

require("dotenv").config()

const privateKey = Buffer.from(
  process.env.PRIVATE_KEY || "",
  "base64"
).toString("ascii")

const publicKey = Buffer.from(process.env.PUBLIC_KEY || "", "base64").toString(
  "ascii"
)

const signJwt = (data) => {
  return jwt.sign(data, privateKey, { expiresIn: "24h", algorithm: "RS256" })
}

module.exports = { signJwt, publicKey }
