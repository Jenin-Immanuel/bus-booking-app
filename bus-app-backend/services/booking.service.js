const checkParams = require("../helpers/checkParams")

class BookingService {
  constructor(busModel) {
    this.busModel = busModel
  }

  async getBusWithoutFilter() {
    const buses = await this.busModel.find()
    return buses
  }

  async getBusWithStartAndEnd(start, end) {
    const buses = await this.busModel.find({ start, end })
    return buses
  }

  async getBusWithStartEndAndTime(start, end, startTime) {
    const date = new Date(startTime)
    const buses = await this.busModel.find({
      start,
      end,
      startTime: { $gte: date },
    })
    return buses
  }
}

module.exports = BookingService
