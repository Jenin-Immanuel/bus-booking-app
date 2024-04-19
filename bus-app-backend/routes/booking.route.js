const express = require("express")

// Middlewares
const verifyToken = require("../middlewares/verifyToken")
const logger = require("../middlewares/logger")

// Business Logic
const {
  bookTicket,
  payment,
  getTicketsOfUser,
  getTicketById,
} = require("../controllers/booking.controller")

const router = express.Router()

router.use(logger, verifyToken)

router.route("/book").post(bookTicket)
router.route("/payment").post(payment)
router.route("/getTickets").get(getTicketsOfUser)
router.route("/getTicket/:ticketId").get(getTicketById)
module.exports = router
