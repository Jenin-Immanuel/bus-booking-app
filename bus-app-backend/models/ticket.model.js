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

const TicketModel = new mongoose.model("Ticket", TicketSchema)

module.exports = { TicketModel }
