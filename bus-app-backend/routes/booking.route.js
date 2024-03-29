const express = require("express")

// Middlewares
const verifyToken = require("../middlewares/verifyToken")
const logger = require("../middlewares/logger")

// Business Logic
const { bookTicket, payment } = require("../controllers/booking.controller")

const router = express.Router()

router.use(logger, verifyToken)

router.route("/book").post(bookTicket)
router.route("/payment").post(payment)

module.exports = router
