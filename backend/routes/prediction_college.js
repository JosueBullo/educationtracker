// const express = require("express");
// const mongoose = require("mongoose");
// const PredictionCollege = require("../models/prediction_college");

// const router = express.Router();

// // Save or update college predictions
// router.post("/save", async (req, res) => {
//   try {
//     const { 
//       userId, 
//       college_cert_predict, 
//       college_course_prediction, 
//       college_pq_predict, 
//       prediction_exam_college, 
//       examScores 
//     } = req.body;

//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ success: false, message: "Invalid or missing user ID" });
//     }

//     const updateFields = {};
//     if (college_cert_predict) updateFields.college_cert_predict = college_cert_predict;
//     if (college_course_prediction) updateFields.college_course_prediction = college_course_prediction;
//     if (college_pq_predict) updateFields.college_pq_predict = college_pq_predict;
//     if (prediction_exam_college) updateFields.prediction_exam_college = prediction_exam_college;
//     if (examScores) updateFields.examScores = examScores;

//     updateFields.updatedAt = new Date();

//     const updatedPrediction = await PredictionCollege.findOneAndUpdate(
//       { userId: new mongoose.Types.ObjectId(userId) },
//       { $set: updateFields },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({ success: true, message: "College predictions updated successfully.", data: updatedPrediction });
//   } catch (error) {
//     console.error("Error saving college predictions:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// });

// router.get("/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ success: false, message: "Invalid user ID format" });
//     }

//     const userPrediction = await PredictionCollege.findOne({ userId: new mongoose.Types.ObjectId(userId) });

//     if (!userPrediction) {
//       return res.status(404).json({ success: false, message: "No predictions found" });
//     }

//     // Assuming you want to sort based on college_course_prediction or any other field
//     const sortedPredictions = {
//       college_cert_predict: userPrediction.college_cert_predict,
//       college_course_prediction: userPrediction.college_course_prediction,
//       college_pq_predict: userPrediction.college_pq_predict
//     };

//     res.json({ success: true, data: sortedPredictions });
//   } catch (error) {
//     console.error("Error fetching user predictions for college:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// });



// module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const PredictionCollege = require("../models/prediction_college");

const router = express.Router();

// Save or update college predictions
router.post("/save", async (req, res) => {
  try {
    const { 
      userId, 
      college_cert_predict, 
      college_course_prediction, 
      college_pq_predict, 
      prediction_exam_college, 
      examScores,
      combined_scores // Add combined_scores to the request body
    } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing user ID" });
    }

    const updateFields = {};
    if (college_cert_predict) updateFields.college_cert_predict = college_cert_predict;
    if (college_course_prediction) updateFields.college_course_prediction = college_course_prediction;
    if (college_pq_predict) updateFields.college_pq_predict = college_pq_predict;
    if (prediction_exam_college) updateFields.prediction_exam_college = prediction_exam_college;
    if (examScores) updateFields.examScores = examScores;
    if (combined_scores) updateFields.combined_scores = combined_scores; // Add combined_scores to updateFields

    updateFields.updatedAt = new Date();

    const updatedPrediction = await PredictionCollege.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "College predictions updated successfully.", data: updatedPrediction });
  } catch (error) {
    console.error("Error saving college predictions:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// Fetch predictions for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    const userPrediction = await PredictionCollege.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!userPrediction) {
      return res.status(404).json({ success: false, message: "No predictions found" });
    }

    // Return all prediction fields, including combined_scores
    const sortedPredictions = {
      college_cert_predict: userPrediction.college_cert_predict,
      college_course_prediction: userPrediction.college_course_prediction,
      college_pq_predict: userPrediction.college_pq_predict,
      prediction_exam_college: userPrediction.prediction_exam_college,
      examScores: userPrediction.examScores,
      combined_scores: userPrediction.combined_scores // Include combined_scores in the response
    };

    res.json({ success: true, data: sortedPredictions });
  } catch (error) {
    console.error("Error fetching user predictions for college:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

module.exports = router;