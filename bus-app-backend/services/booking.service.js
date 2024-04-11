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

    const session = await mongoose.session()

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

    // for (let i = 0; i < seatDetails.length; i++) {
    //   const { name, age, gender } = seatDetails[i]
    //   seats[i].pName = name
    //   seats[i].pAge = age
    //   seats[i].pGender = gender
    //   seats[i].status = "reserved"
    //   await seats[i].save()
    // }
  }

  async bookNewTicket(busId, seatDetails, userId) {
    const user = await this.userService.getUserById(userId)
    const bus = await this.getBusById(busId)

    const seats = this.filterAndCreateSeats(seatDetails, bus)
  }
}

module.exports = { SearchService, BookingService }
