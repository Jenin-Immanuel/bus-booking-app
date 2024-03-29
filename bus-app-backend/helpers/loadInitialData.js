const mongoose = require("mongoose")

// Models
const { BusModel } = require("../models/bus.model")
const { SeatModel } = require("../models/seat.model")

const loadInitialData = async () => {
  // Create Initial Bus Details
  const maxSeats = 12
  let seats = []
  for (let i = 0; i < maxSeats; i++) {
    const seat = await SeatModel.create({
      seatNo: i + 1,
      cost: 1000,
      isSleeper: false,
    })
    seats.push(seat._id)
  }

  const bus = new BusModel({
    provider: "NJK Travels",
    description: "This is a test bus",
    start: "Bangalore",
    end: "Chennai",
    startTime: new Date("2024-04-10T12:00:00"),
    endTime: new Date("2021-04-10T20:00:00"),
    maxSeats: maxSeats,
    seats: seats,
  })

  await bus.save()
  console.log("Initial data loaded")
}

module.exports = loadInitialData
