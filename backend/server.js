const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`StayFlow API running on port ${PORT}`);
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYmQxMmJkMzQ2NzJhZDEwZGYxN2E0NSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkwNzc2MDAyLCJleHAiOjE3OTEzODA4MDJ9.T54iqi_UWdISYibdy3LaHMB23b3mQmfNnBVISRI2QlE