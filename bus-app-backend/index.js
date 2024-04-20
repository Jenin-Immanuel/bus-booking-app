require("dotenv").config()

const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

// Utility functions
const connectDB = require("./utils/connectDB")

// Helper functions
const loadInitialData = require("./helpers/loadInitialData")

// Routers
const userRouter = require("./routes/user.route")
const searchRouter = require("./routes/search.route")
const bookingRouter = require("./routes/booking.route")

// Middlewares
const errorHandler = require("./middlewares/errorHandler")

const app = express()

const PORT = process.env.PORT || 8080
const PRODUCTION_URL = process.env.PRODUCTION_FRONTEND_URL
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())
app.use(
  cors({ origin: [PRODUCTION_URL, "http://localhost:5173"], credentials: true })
)

async function main() {
  connectDB()

  // app.use((err, req, res, next) => {
  //   console.error(err.stack)
  //   next(err)
  // })

  // await loadInitialData()
  app.use("/user", userRouter)
  app.use("/search", searchRouter)
  app.use("/booking", bookingRouter)
  app.get("/", (req, res) => {
    res.send("Hello world")
  })

  app.use(errorHandler)
  app.listen(PORT, () => {
    console.log(`Server connected at http://localhost:${PORT}/`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
