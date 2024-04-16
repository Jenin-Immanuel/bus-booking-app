const { SeatModel } = require("../models/seat.model")
const { BusModel } = require("../models/bus.model")

const mongoose = require("mongoose")

const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  seats: [
    {
      seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
      },
    },
  ],
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["reserved", "booked", "cancelled"],
    default: "reserved",
  },
  bookingDate: {
    type: Date,
    required: true,
  },
})

TicketSchema.methods.startExpirationTimer = async (ticketId) => {
  let timeoutId
  // Set expirationDuration for 10 minutes which should be then used in a setTimeout
  const expirationDuration = 10 * 1000

  async function expireLogic() {
    try {
      const r = await TicketModel.findById(ticketId).populate("bus")

      if (r.status === "reserved") {
        // Revert the seats booked
        const seatIds = r.seats.map((seat) => seat.seat)

        await SeatModel.updateMany(
          { _id: { $in: seatIds } },
          { $set: { status: "unreserved" } }
        )

        await SeatModel.updateMany(
          { _id: { $in: seatIds } },
          { $unset: { pName: 1, pAge: 1, pGender: 1 } }
        )

        await BusModel.updateOne(
          { _id: r.bus._id },
          { bookedSeats: r.bus.bookedSeats - seatIds.length }
        )

        await TicketModel.deleteOne({ _id: ticketId })
        console.log("Reservation successfully deleted")
      }
    } catch (e) {
      console.log("Error: ", e.message)
    }
  }

  const wrapperFunction = async () => {
    await expireLogic()
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(wrapperFunction, expirationDuration)
}

const TicketModel = new mongoose.model("Ticket", TicketSchema)

module.exports = { TicketModel }
