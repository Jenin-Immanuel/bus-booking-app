const { UserModel } = require("../models/user.model")

// Service instances
const UserService = require("../services/user.service")
const userService = new UserService(UserModel)

async function createUser(req, res, next) {
  const { name, email, password } = req.body
  try {
    const user = await userService.createNewUser(name, email, password)
    return res.status(200).json({ status: "success", data: user })
  } catch (err) {
    next(err)
  }
}

async function getUsers(req, res) {
  const users = await userService.getAllUsers()
  return res.status(200).json({ status: "success", data: users })
}

async function login(req, res, next) {
  const email = req.body.email
  const password = req.body.password
  try {
    const { token, name } = await userService.login(email, password)
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getDate() + 24)
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: expirationDate,
    })

    return res.status(200).json({ token, name, email })
  } catch (err) {
    next(err)
  }
}

const getUserByToken = async (req, res) => {
  const token = req.headers["authorization"]
  const decoded = jwt.decode(token, process.env.PRIVATE_KEY)
  return res.json(decoded)
}

const me = async (req, res) => {
  const user = await userService.me(req.userId)
  console.log(user)
  return res
    .status(200)
    .json({ status: "success", data: { name: user.name, email: user.email } })
}

module.exports = {
  createUser,
  getUsers,
  getUserByToken,
  login,
  me,
}
