const express = require("express");
const { createAdmin } = require("../controllers/adminController");

const router = express.Router();

// Temporary setup route for creating the first admin
router.post("/create", createAdmin);

module.exports = router;
