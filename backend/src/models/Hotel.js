const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    status: {
      type: String,
      default: "Available",
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "nature",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Hotel", hotelSchema);
