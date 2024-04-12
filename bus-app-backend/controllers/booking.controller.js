const { BusModel } = require("../models/bus.model")
const { SeatModel } = require("../models/seat.model")
const { TicketModel } = require("../models/ticket.model")
const { UserModel } = require("../models/user.model")

const checkParams = require("../helpers/checkParams")

const UserService = require("../services/user.service")
const { BookingService } = require("../services/booking.service")
const userService = new UserService(UserModel)
const bookingService = new BookingService(
  BusModel,
  TicketModel,
  userService,
  SeatModel
)

async function generateTicket(seats, bus, user) {
  const totalCost = seats.reduce((acc, seat) => acc + seat.cost, 0)

  const ticket = await TicketModel.create({
    user: user._id,
    bus: bus._id,
    seats: seats.map((seat) => ({ seat: seat._id })),
    totalCost,
    bookingDate: new Date(),
  })
  return ticket
}

async function bookTicket(req, res) {
  const { busId, seatDetails } = req.body
  const userId = req.userId
  checkParams(busId, seatDetails, userId)
  const ticket = await bookingService.bookNewTicket(busId, seatDetails, userId)
  return res.status(200).json({ status: "success", data: ticket })
}

async function payment(req, res) {
  const { ticketId } = req.body
  const ticket = await TicketModel.findById(ticketId)
    .populate("seats")
    .populate("bus")
    .populate("user")

  ticket.bus.bookedSeats += ticket.seats.length

  ticket.seats.forEach(async (seat) => {
    seat.status = "paid"
    await seat.save()
  })
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" })
  }

  if (ticket.status !== "reserved") {
    return res.status(400).json({ error: "Ticket already booked" })
  }

  ticket.status = "booked"
  await ticket.save()
  await ticket.bus.save()

  const returnObj = {
    message: "Ticket booked successfully",
    ticket,
  }
  return res.json(returnObj)
}

module.exports = { bookTicket, payment }
