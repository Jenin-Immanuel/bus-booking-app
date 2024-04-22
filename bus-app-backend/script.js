const mongoose = require("mongoose")

require("dotenv").config()
// Models
const { BusModel } = require("./models/bus.model")
const { SeatModel } = require("./models/seat.model")
const connectDB = require("./utils/connectDB")

const loadInitialData = async () => {
  const maxSeats = 36
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
    provider: "NFT Travels",
    description: "This is a test bus",
    start: "Chennai",
    end: "Bangalore",
    startTime: new Date("2024-04-29T12:00:00"),
    endTime: new Date("2021-04-29T20:00:00"),
    maxSeats: maxSeats,
    seats: seats,
  })

  await bus.save()
  console.log("Initial data loaded")
}

async function main() {
  await connectDB()
  await loadInitialData()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
