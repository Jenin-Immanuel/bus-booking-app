require("dotenv").config()

const express = require("express")
const cors = require("cors")

// Utility functions
const connectDB = require("./utils/connectDB")

// Helper functions
const loadInitialData = require("./helpers/loadInitialData")

// Routers
const userRouter = require("./routes/user.route")
const searchRouter = require("./routes/search.route")
const bookingRouter = require("./routes/booking.route")

const app = express()

const PORT = process.env.PORT || 8080

app.use(cors({ origin: "*" }))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

async function main() {
  connectDB()

  // await loadInitialData()
  app.use("/user", userRouter)
  app.use("/search", searchRouter)
  app.use("/booking", bookingRouter)
  app.get("/", (req, res) => {
    res.send("Hello world")
  })

  app.listen(PORT, () => {
    console.log(`Server connected at http://localhost:${PORT}/`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
