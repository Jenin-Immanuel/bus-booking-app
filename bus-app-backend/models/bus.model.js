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
  seats: [SeatSchema],
})

const BusModel = new mongoose.model("Bus", BusSchema)

module.exports = { BusSchema, BusModel }
