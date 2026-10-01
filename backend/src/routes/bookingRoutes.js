const express = require("express");

const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
} = require("../controllers/bookingController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

const router = express.Router();

// ==========================================
// USER ROUTES
// ==========================================

// User route
router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);


// Admin routes
router.get("/", protect, adminOnly, getBookings);

router.get("/:id", protect, adminOnly, getBookingById);

router.patch("/:id", protect, adminOnly, updateBooking);

router.delete("/:id", protect, adminOnly, deleteBooking);

module.exports = router;
