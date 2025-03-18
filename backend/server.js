


// const express = require("express");
// const connectDB = require("./config/db"); // MongoDB connection
// const authRoutes = require("./routes/auth"); // Authentication routes
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const axios = require("axios");
// const multer = require("multer");
// const predictionRoutes = require("./routes/prediction");
// const bodyParser = require("body-parser");
// const predictionShs = require("./routes/prediction_shs");
// const predictionCollege = require("./routes/prediction_college");
// const app = express();
// app.use(cors());
// app.use(express.json());


// app.use(cors());


// app.use(express.json({ limit: "10mb" })); 
// app.use(express.urlencoded({ limit: "10mb", extended: true }));

// console.log("MongoDB URI:", process.env.MONGODB_URI);

// // Connect to MongoDB
// connectDB();

// // Set up file upload (for image processing)
// const upload = multer({ storage: multer.memoryStorage() });

// // ✅ Authentication Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/predictions", predictionRoutes);
// app.use("/api/prediction_shs", predictionShs);
// app.use("/api/prediction_college", predictionCollege);


// app.use("/api/prediction_college", predictionRoutes);


// // ✅ Quiz Prediction Route
// app.post("/api/predict-quiz", async (req, res) => {
//     try {
//         const response = await axios.post("http://localhost:5000/predict-quiz", req.body);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Error predicting quiz" });
//     }
// });

// // ✅ Image Prediction Route
// app.post("/api/predict-image", upload.single("file"), async (req, res) => {
//     try {
//         const formData = new FormData();
//         formData.append("file", req.file.buffer, req.file.originalname);

//         const response = await axios.post("http://localhost:5000/predict-image", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });

//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Error predicting image" });
//     }
// });

// // Start Server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // For handling cross-origin requests
const predictionRoutes = require("./routes/predictionRoutes"); // Import prediction routes

const app = express();
const PORT = 4000; // Port for the server

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/career_prediction", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Failed to connect to MongoDB", err));

// Routes
app.use("/api/prediction_college", predictionRoutes); // Register prediction routes

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Career Prediction API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});