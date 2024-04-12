const mongoose = require("mongoose")

const dbUrl = process.env.MONGO_URI || ""

const connectDB = async () => {
  if (dbUrl === "") {
    console.error(
      "DB_URL not found in .env file. Please add DB_URL to .env file. Exiting...."
    )
    process.exit(1)
  }
  try {
    console.log(dbUrl)
    await mongoose.connect(dbUrl)
  } catch (err) {
    console.error(err)
    return
  }

  console.log("Successfully connected to DB")
}

module.exports = connectDB
