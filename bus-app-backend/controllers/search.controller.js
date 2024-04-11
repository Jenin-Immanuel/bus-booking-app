const { BusModel } = require("../models/bus.model")

const BookingService = require("../services/booking.service")
const bookingService = new BookingService(BusModel)

async function searchBus(req, res) {
  const { start, end, startTime } = req.body
  let buses
  if (start && end && startTime) {
    buses = await bookingService.getBusWithStartEndAndTime(
      start,
      end,
      startTime
    )
  } else if (start && end) {
    buses = await bookingService.getBusWithStartAndEnd(start, end)
  } else {
    buses = await bookingService.getBusWithoutFilter()
  }

  return res.status(200).json({ status: "success", data: buses })
}

module.exports = {
  searchBus,
}
