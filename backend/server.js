// const express = require('express');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const cors = require('cors');
// const dotenv = require("dotenv").config();
// const app = express();


// app.use(cors());
// app.use(express.json());

// console.log("MongoDB URI:", process.env.MONGO_URI);


// connectDB();

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// app.use('/api/auth', authRoutes);


// const express = require("express");
// const connectDB = require("./config/db"); // MongoDB connection
// const authRoutes = require("./routes/auth"); // Authentication routes
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const axios = require("axios");
// const multer = require("multer");
// // app.js or server.js
// const learningBackgroundRoutes = require("./routes/learningBackground");
// const prediction = require("./routes/prediction")


// const app = express();
// app.use(cors());
// app.use(express.json());



// console.log("MongoDB URI:", process.env.MONGODB_URI);

// // Connect to MongoDB
// connectDB();

// // Set up file upload (for image processing)
// const upload = multer({ storage: multer.memoryStorage() });

// app.use("/api/learning-background", learningBackgroundRoutes);
// console.log("Imported Prediction Route:", prediction);

// // ✅ Authentication Routes
// app.use("/api/auth", authRoutes);
// // app.use("/api/prediction", prediction);

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

// const express = require('express');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const cors = require('cors');
// const dotenv = require("dotenv").config();
// const app = express();


// app.use(cors());
// app.use(express.json());

// console.log("MongoDB URI:", process.env.MONGO_URI);


// connectDB();

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// app.use('/api/auth', authRoutes);
// -----------------------------------------------------------------------------------------------------------------------

// const express = require("express");
// const connectDB = require("./config/db"); // MongoDB connection
// const authRoutes = require("./routes/auth"); // Authentication routes
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const axios = require("axios");
// const multer = require("multer");
// const predictionRoutes = require("./routes/prediction");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use(bodyParser.json({ limit: "50mb" })); // JSON requests
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // Form submissions

// app.use(cors());


// app.use(bodyParser.json({ limit: "50mb" })); // Increase limit for JSON payload
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// console.log("MongoDB URI:", process.env.MONGODB_URI);

// // Connect to MongoDB
// connectDB();

// // Set up file upload (for image processing)
// const upload = multer({ storage: multer.memoryStorage() });

// // ✅ Authentication Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/predictions", predictionRoutes);

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

// const express = require('express');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const cors = require('cors');
// const dotenv = require("dotenv").config();
// const app = express();


// app.use(cors());
// app.use(express.json());

// console.log("MongoDB URI:", process.env.MONGO_URI);


// connectDB();

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// app.use('/api/auth', authRoutes);


// const express = require("express");
// const connectDB = require("./config/db"); // MongoDB connection
// const authRoutes = require("./routes/auth"); // Authentication routes
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const axios = require("axios");
// const multer = require("multer");
// // app.js or server.js
// const learningBackgroundRoutes = require("./routes/learningBackground");
// const prediction = require("./routes/prediction")


// const app = express();
// app.use(cors());
// app.use(express.json());



// console.log("MongoDB URI:", process.env.MONGODB_URI);

// // Connect to MongoDB
// connectDB();

// // Set up file upload (for image processing)
// const upload = multer({ storage: multer.memoryStorage() });

// app.use("/api/learning-background", learningBackgroundRoutes);
// console.log("Imported Prediction Route:", prediction);

// // ✅ Authentication Routes
// app.use("/api/auth", authRoutes);
// // app.use("/api/prediction", prediction);

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

// const express = require('express');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const cors = require('cors');
// const dotenv = require("dotenv").config();
// const app = express();


// app.use(cors());
// app.use(express.json());

// console.log("MongoDB URI:", process.env.MONGO_URI);


// connectDB();

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// app.use('/api/auth', authRoutes);


const express = require("express");
const connectDB = require("./config/db"); // MongoDB connection
const authRoutes = require("./routes/auth"); // Authentication routes
const cors = require("cors");
const dotenv = require("dotenv").config();
const axios = require("axios");
const multer = require("multer");
const predictionRoutes = require("./routes/prediction");
const bodyParser = require("body-parser");
const predictionShs = require("./routes/prediction_shs");
const app = express();
app.use(cors());
app.use(express.json());


app.use(cors());


app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

console.log("MongoDB URI:", process.env.MONGODB_URI);

// Connect to MongoDB
connectDB();

// Set up file upload (for image processing)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/prediction_shs", predictionShs);


// ✅ Quiz Prediction Route
app.post("/api/predict-quiz", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:5000/predict-quiz", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error predicting quiz" });
    }
});

// ✅ Image Prediction Route
app.post("/api/predict-image", upload.single("file"), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, req.file.originalname);

        const response = await axios.post("http://localhost:5000/predict-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error predicting image" });
    }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
