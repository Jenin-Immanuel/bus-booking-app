async function getUserByToken(req, res) {
  const token = req.headers["authorization"]
  const decoded = jwt.decode(token, process.env.PRIVATE_KEY)
  return res.json(decoded)
}

module.exports = { getUserByToken }
