// const mongoose = require("mongoose");

// // Sub-schema for career predictions
// const careerPredictionSchema = new mongoose.Schema(
//   {
//     career: { type: String, required: true },
//     score: { type: Number, required: true, min: 0, max: 100 },
//   },
//   { _id: false }
// );

// // Sub-schema for exam-based predictions
// const examPredictionSchema = new mongoose.Schema(
//   {
//     career: { type: String, required: true },
//     score: { type: Number, required: true },
//   },
//   { _id: false }
// );

// // Sub-schema for exam scores
// const examScoresSchema = new mongoose.Schema({}, { strict: false });

// // Define the main College Prediction schema
// const predictionCollegeSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
//     college_cert_predict: { type: [careerPredictionSchema], default: [] },
//     college_course_prediction: { type: [careerPredictionSchema], default: [] },
//     college_pq_predict: { type: [careerPredictionSchema], default: [] },
//     prediction_exam_college: { type: Map, of: Number, default: {} }, // Stores key-value pairs
//     examScores: { type: examScoresSchema, default: {} }, // Flexible schema for scores
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("PredictionCollege", predictionCollegeSchema, "prediction_college");

const mongoose = require("mongoose");

// Sub-schema for career predictions
const careerPredictionSchema = new mongoose.Schema(
  {
    career: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

// Sub-schema for exam-based predictions
const examPredictionSchema = new mongoose.Schema(
  {
    career: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }
);

// Sub-schema for exam scores
const examScoresSchema = new mongoose.Schema({}, { strict: false });

// Define the main College Prediction schema
const predictionCollegeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    college_cert_predict: { type: [careerPredictionSchema], default: [] },
    college_course_prediction: { type: [careerPredictionSchema], default: [] },
    college_pq_predict: { type: [careerPredictionSchema], default: [] },
    prediction_exam_college: { type: Map, of: Number, default: {} }, // Stores key-value pairs
    examScores: { type: examScoresSchema, default: {} }, // Flexible schema for scores
    combined_scores: { type: [careerPredictionSchema], default: [] }, // New field for combined scores
  },
  { timestamps: true }
);

module.exports = mongoose.model("PredictionCollege", predictionCollegeSchema, "prediction_college");