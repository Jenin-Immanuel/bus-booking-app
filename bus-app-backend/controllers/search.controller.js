const { BusModel } = require("../models/bus.model")

async function searchBusWithoutFilter(req, res) {
  const buses = await BusModel.find()
  return res.json(buses)
}

async function searchBusWithStartAndEnd(req, res) {
  const { start, end } = req.query
  console.log(start, end)
  const buses = await BusModel.find({ start, end })
  return res.json(buses)
}

async function searchBusWithStartEndAndTime(req, res) {
  const { start, end, startTime } = req.query
  console.log(date)
  const buses = await BusModel.find({ start, end, startTime: { $gte: date } })
  return res.json(buses)
}

module.exports = {
  searchBusWithoutFilter,
  searchBusWithStartAndEnd,
  searchBusWithStartEndAndTime,
}
