const checkParams = require("../helpers/checkParams")
const mongoose = require("mongoose")

class SearchService {
  constructor(busModel) {
    this.busModel = busModel
  }

  async getBusWithoutFilter() {
    const buses = await this.busModel.find()
    return buses
  }

  async getBusWithStartAndEnd(start, end) {
    const buses = await this.busModel.find({ start, end })
    return buses
  }

  async getBusWithStartEndAndTime(start, end, startTime) {
    const date = new Date(startTime)
    const buses = await this.busModel.find({
      start,
      end,
      startTime: { $gte: date },
    })
    return buses
  }

  async getBusById(id) {
    const bus = await this.busModel.find({ _id: id }).populate("seats")
    if (!bus) {
      throw new Error("Bus not found")
    }
    return bus
  }
}

class BookingService {
  constructor(busModel, ticketModel, userService, seatModel) {
    this.busModel = busModel
    this.ticketModel = ticketModel
    this.seatModel = seatModel
    this.userService = userService
  }

  async getBusById(busId) {
    const bus = await this.busModel.findById(busId).populate("seats")
    if (!bus) {
      throw new Error("Bus not found")
    }
    return bus
  }

  async filterAndCreateSeats(seatDetails, bus) {
    const seatNos = seatDetails.map((seat) => seat.seatNo)

    const seats = bus.seats.filter((seat) => seatNos.includes(seat.seatNo))

    // All seats are filtered
    if (
      !(
        seats.length === seatNos.length &&
        seatDetails.length === seatNos.length &&
        seats.length === seatDetails.length
      )
    ) {
      throw new Error("Invalid seat numbers")
    }

    // Serialize the details and objects
    seatDetails.sort((a, b) => a.seatNo - b.seatNo)
    seats.sort((a, b) => a.seatNo - b.seatNo)

    const session = await mongoose.startSession()

    await session.withTransaction(async () => {
      const updatePromises = seats.map((seat, index) => {
        if (
          seatDetails[index].status === "reserved" ||
          seatDetails[index].status === "booked"
        ) {
          throw new Error("Seat is already booked")
        }
        return this.seatModel
          .findByIdAndUpdate(seat._id, {
            pName: seatDetails[index].name,
            pAge: seatDetails[index].age,
            pGender: seatDetails[index].gender,
            status: "reserved",
          })
          .session(session)
      })
      await Promise.all(updatePromises)
    })
  }

  async getSeatsBySeatNumber(seatsId) {
    return this.seatModel.find({ seatNo: { $in: seatsId } })
  }

  async getTicketsOfUser(userId) {
    const tickets = await this.ticketModel.find({ user: userId })
    return tickets
  }

  async generateTicket(seats, bus, user) {
    const totalCost = seats.reduce((acc, seat) => acc + seat.cost, 0)

    await this.busModel.findByIdAndUpdate(bus._id, {
      $inc: { bookedSeats: seats.length },
    })

    const ticket = await this.ticketModel.create({
      user: user._id,
      bus: bus._id,
      seats: seats.map((seat) => ({ seat: seat._id })),
      totalCost,
      bookingDate: new Date(),
    })
    await ticket.startExpirationTimer(ticket._id)
    return ticket
  }

  async bookNewTicket(busId, seatDetails, userId) {
    const user = await this.userService.getUserById(userId)
    const bus = await this.getBusById(busId)
    const seatIdList = seatDetails.map((seat) => seat.seatNo)
    await this.filterAndCreateSeats(seatDetails, bus)
    const seats = await this.getSeatsBySeatNumber(seatIdList)
    const ticket = await this.generateTicket(seats, bus, user)
    return ticket
  }
}

module.exports = { SearchService, BookingService }
