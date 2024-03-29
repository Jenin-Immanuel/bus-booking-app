const mongoose = require("mongoose")

const SeatSchema = new mongoose.Schema({
  seatNo: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["unreserved", "reserved", "paid"],
    required: true,
    default: "unreserved",
  },
  pName: {
    type: String,
  },
  pGender: {
    type: String,
    enum: ["M", "F", "O"],
  },
  pAge: {
    type: Number,
    validate: {
      validator: (v) => v > 0,
      message: "Age must be greater than 0",
    },
  },
  cost: {
    type: Number,
    required: true,
  },
  isSleeper: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const SeatModel = new mongoose.model("Seat", SeatSchema)
module.exports = { SeatSchema, SeatModel }
