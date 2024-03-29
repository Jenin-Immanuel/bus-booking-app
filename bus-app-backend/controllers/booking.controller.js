const { BusModel } = require("../models/bus.model")
const { SeatModel } = require("../models/seat.model")

async function bookTicket(req, res) {
  const { busId, seatNos } = req.body

  const bus = await BusModel.findById(busId)
  if (!bus) {
    return res.status(404).json({ error: "Bus not found" })
  }
  const seats = bus.seats.filter((seat) => seatNos.includes(seat.seatNo))

  console.log(seats)
}
