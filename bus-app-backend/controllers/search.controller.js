const checkParams = require("../helpers/checkParams")
const { BusModel } = require("../models/bus.model")

const { SearchService } = require("../services/booking.service")
const searchService = new SearchService(BusModel)

async function searchBus(req, res) {
  const { start, end, startTime } = req.body
  let buses
  if (start && end && startTime) {
    buses = await searchService.getBusWithStartEndAndTime(start, end, startTime)
  } else if (start && end) {
    buses = await searchService.getBusWithStartAndEnd(start, end)
  } else {
    buses = await searchService.getBusWithoutFilter()
  }

  return res.status(200).json({ status: "success", data: buses })
}

async function getBusById(req, res, next) {
  const { id } = req.query
  console.log(id)
  checkParams(id)
  try {
    const bus = await searchService.getBusById(id)
    return res.status(200).json({ status: "success", data: bus })
  } catch (err) {
    err.message = "Bus not found"
    next(err)
  }
}

module.exports = {
  searchBus,
  getBusById,
}
