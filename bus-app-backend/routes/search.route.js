const express = require("express")

// Middlewares
const verifyToken = require("../middlewares/verifyToken")
const logger = require("../middlewares/logger")

// Business Logic
const { searchBus, getBusById } = require("../controllers/search.controller")

const router = express.Router()

router.use(logger, verifyToken)

router.route("/").post(searchBus)
router.route("/bus").get(getBusById)

// router.route("/no-filter").get(searchBusWithoutFilter)
// router.route("/loc").get(searchBusWithStartAndEnd)
// router.route("/loc-time").get(searchBusWithStartEndAndTime)

module.exports = router
