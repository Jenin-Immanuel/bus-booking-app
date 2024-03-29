const mongoose = require("mongoose")

const { RouteSchema } = require("./route.model")
const { SeatSchema } = require("./seat.model")

const BusSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  maxSeats: {
    type: Number,
    required: true,
  },
  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
    },
  ],
  bookedSeats: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return v <= this.maxSeats
      },
      message: "Booked seats cannot exceed max seats",
    },
  },
})

const BusModel = new mongoose.model("Bus", BusSchema)

module.exports = { BusSchema, BusModel }
