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
      name: {
        type: String,
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
    enum: ["booked", "cancelled"],
    default: "booked",
  },
  bookingDate: {
    type: Date,
    required: true,
  },
})

const TicketModel = new mongoose.model("User", TicketSchema)

module.exports = TicketModel
