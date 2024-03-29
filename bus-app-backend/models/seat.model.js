const mongoose = require("mongoose")

const SeatSchema = new mongoose.Schema({
  seatNo: {
    type: Number,
    required: true,
    unique: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  isSleeper: {
    type: Boolean,
    required: true,
  },
})

const SeatModel = new mongoose.model("Seat", SeatSchema)
module.exports = { SeatSchema, SeatModel }
