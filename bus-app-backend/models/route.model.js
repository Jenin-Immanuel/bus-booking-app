const mongoose = require("mongoose")

const RouteSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
})

module.exports = { RouteSchema }
