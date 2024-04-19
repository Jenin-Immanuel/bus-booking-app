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

async function getTicketsOfUser(req, res) {
  const userId = req.userId
  const tickets = await bookingService.getTicketsOfUser(userId)
  return res.status(200).json({ status: "success", data: tickets })
}

async function getTicketById(req, res, next) {
  const userId = req.userId
  const ticketId = req.params.ticketId
  try {
    checkParams(userId, ticketId)
    const ticket = await bookingService.getTicketById(ticketId)
    return res.status(200).json({ status: "success", data: ticket })
  } catch (err) {
    next(err)
  }
}

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

async function bookTicket(req, res, next) {
  try {
    const { busId, seatDetails } = req.body
    const userId = req.userId
    checkParams(busId, seatDetails, userId)
    const ticket = await bookingService.bookNewTicket(
      busId,
      seatDetails,
      userId
    )
    return res.status(200).json({ status: "success", data: ticket })
  } catch (err) {
    next(err)
  }
}

async function payment(req, res) {
  const { ticketId } = req.body
  const ticket = await TicketModel.findById(ticketId)
    .populate("seats")
    .populate("bus")
    .populate("user")
  console.log("Ticket: ", ticket)
  const bus = await BusModel.findById(ticket.bus._id).populate("seats")
  console.log("Bus: ", bus)
  let bkdSeats = new Set()
  ticket.seats.forEach((seat) => bkdSeats.add(seat.seat.toString()))
  bus.seats.forEach((seat) =>
    seat.status === "paid" ? bkdSeats.add(seat._id.toString()) : null
  )

  await BusModel.findByIdAndUpdate(bus._id, { bookedSeats: bkdSeats.size })
  // Set Booked Seats
  ticket.seats.forEach(async (seat) => {
    await SeatModel.findByIdAndUpdate(seat.seat, { status: "paid" })
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

  // let bkdSeats = new Set()
  // ticket.seats.forEach((seat) => bkdSeats.add(seat.seat))
  // bus.seats.forEach((seat) =>
  //   seat.status === "booked" ? bkdSeats.add(seat.seat._id) : null
  // )
  // // Set Booked Seats
  // console.log("Booked Seats: ", bkdSeats)
  ticket.bus.bookedSeats = bkdSeats.size
  await ticket.bus.save()
  const returnObj = {
    message: "Ticket booked successfully",
    ticket,
  }
  return res.json(returnObj)
}

module.exports = { bookTicket, payment, getTicketsOfUser, getTicketById }
