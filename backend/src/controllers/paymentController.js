const crypto = require("crypto");

const Booking = require("../models/Booking");
const razorpay = require("../config/razorpay");

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // Find booking belonging to logged-in user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Prevent payment for cancelled/completed bookings
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled booking cannot be paid",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed booking cannot be paid",
      });
    }

    // Already paid
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking is already paid",
      });
    }

    // Amount comes from trusted MongoDB booking.
    // We do NOT trust amount sent by frontend.
    const amountInPaise = Math.round(Number(booking.amount) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user.id.toString(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Payment order created successfully",

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },

      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    // Find booking belonging to logged-in user
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Generate server-side signature.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Timing-safe comparison
    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature),
    );

    if (!signaturesMatch) {
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // Payment successfully verified
    booking.paymentStatus = "paid";
    booking.paymentId = razorpay_payment_id;

    await booking.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      booking: {
        id: booking._id,
        paymentStatus: booking.paymentStatus,
        paymentId: booking.paymentId,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
