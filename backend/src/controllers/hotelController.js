const Hotel = require("../models/Hotel");

// GET /api/hotels
// Get all hotels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      error: error.message,
    });
  }
};

// GET /api/hotels/:id
// Get single hotel
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    res.json({
      success: true,
      hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
      error: error.message,
    });
  }
};

// POST /api/hotels
// Create hotel
const createHotel = async (req, res) => {
  try {
    const { name, location, price, rate, status, category } = req.body;

    if (!name || !location || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, location and price are required",
      });
    }

    // If an image was uploaded, create its API URL
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const hotel = await Hotel.create({
      name,
      location,
      price,
      rate,
      status,
      image,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create hotel",
      error: error.message,
    });
  }
};

// PATCH /api/hotels/:id
// Update hotel
const updateHotel = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // Only replace image if a new image was uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const hotel = await Hotel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    res.json({
      success: true,
      message: "Hotel updated successfully",
      hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update hotel",
      error: error.message,
    });
  }
};

// DELETE /api/hotels/:id
// Delete hotel
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    res.json({
      success: true,
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete hotel",
      error: error.message,
    });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
