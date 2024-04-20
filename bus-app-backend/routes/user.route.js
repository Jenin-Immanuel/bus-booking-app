const express = require("express")

// Middlewares
const logger = require("../middlewares/logger")
const verifyToken = require("../middlewares/verifyToken")

// Controllers
const {
  createUser,
  getUsers,
  login,
  me,
} = require("../controllers/user.controller")

const router = express.Router()

// router.all("*", logger)
router.use(logger)

router.route("/").post(createUser)
router.route("/").get(getUsers)
router.route("/login").post(login)

// Safe Routes
router.route("/hello").get(verifyToken, (req, res) => {
  res.json({ email: req.email })
})
router.route("/me").get(verifyToken, me)
router.route("/logout").get(verifyToken, (req, res) => {
  res.cookie("accessToken", "", { maxAge: 0, httpOnly: true })
  return res.json({ status: "success", message: "You have been logged out" })
})

module.exports = router
