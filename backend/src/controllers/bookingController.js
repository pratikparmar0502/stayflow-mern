const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

// ==========================================
// GET ALL BOOKINGS
// ==========================================
// Admin can use this to see all bookings.
// Normal users will later get their own bookings
// through a separate user-specific API.
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("hotel", "name location price image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE BOOKING
// ==========================================
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("hotel", "name location price image");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY BOOKINGS
// ==========================================
// Returns bookings belonging only to the
// currently logged-in user.
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("hotel", "name location price image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your bookings",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE BOOKING
// ==========================================
const createBooking = async (req, res) => {
  try {
    const { hotel, hotelName, hotelImage, checkIn, checkOut, customerName } = req.body;

    // Basic validation
    if (!hotel || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Hotel, check-in and check-out are required",
      });
    }

    // Find the actual hotel from MongoDB
    const selectedHotel = await Hotel.findById(hotel);

    if (!selectedHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    // Validate booking dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Calculate number of nights
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil((checkOutDate - checkInDate) / millisecondsPerDay);

    // Calculate price from trusted database value
    const roomAmount = selectedHotel.price * nights;

    // 5% service fee
    const serviceFee = Math.round(roomAmount * 0.05);

    const finalAmount = roomAmount + serviceFee;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,

      hotel: selectedHotel._id,

      customerName: customerName || req.user.name || req.user.email || "Guest",

      hotelName: selectedHotel.name,

      hotelImage: selectedHotel.image || "",

      checkIn: checkInDate,
      checkOut: checkOutDate,

      amount: finalAmount,

      status: "pending",

      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE BOOKING
// ==========================================
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE BOOKING
// ==========================================
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

module.exports = {
  getBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
