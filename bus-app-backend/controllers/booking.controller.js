const { BusModel } = require("../models/bus.model")
const { SeatModel } = require("../models/seat.model")
const { TicketModel } = require("../models/ticket.model")
const { UserModel } = require("../models/user.model")

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

/**
 *
 * @param {import('../models/seat.model').SeatModel} seat
 */
function updateSeatDetails(seat, details) {}

/**
 * Book a ticket
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function bookTicket(req, res) {
  /**
   * @typedef {Object} RequestBody
   * @property {string} busId
   * @property {{seatNo: number, name: string, age: number, gender: string}[]} seatDetails
   */

  /**
   * @type {RequestBody}
   */
  const { busId, seatDetails } = req.body
  const email = req.email

  const user = await UserModel.findOne({ email: email })
  const bus = await BusModel.findById(busId).populate("seats")

  const seatNos = seatDetails.map((seat) => seat.seatNo)
  if (!bus) {
    return res.status(404).json({ error: "Bus not found" })
  }

  const seats = bus.seats.filter((seat) => seatNos.includes(seat.seatNo))

  // All seats are filtered
  if (
    !(
      seats.length === seatNos.length &&
      seatDetails.length === seatNos.length &&
      seats.length === seatDetails.length
    )
  ) {
    return res.status(400).json({ error: "Invalid seat numbers" })
  }

  // Serialize the details and objects
  seatDetails.sort((a, b) => a.seatNo - b.seatNo)
  seats.sort((a, b) => a.seatNo - b.seatNo)

  for (let i = 0; i < seatDetails.length; i++) {
    const { name, age, gender } = seatDetails[i]
    seats[i].pName = name
    seats[i].pAge = age
    seats[i].pGender = gender
    seats[i].status = "reserved"
    await seats[i].save()
  }

  const ticket = await generateTicket(seats, bus, user)

  return res.json(ticket)
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
