const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
})

const UserModel = new mongoose.model("User", UserSchema)

module.exports = { UserModel }
