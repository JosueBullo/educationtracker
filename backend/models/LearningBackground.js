// const mongoose = require("mongoose");

// const LearningBackgroundSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   gradeLevel: {
//     type: String,
//     enum: ["Senior High School", "College"],
//     required: true,
//   },
//   strand: {
//     type: String,
//     required: function () {
//       return this.gradeLevel === "Senior High School";
//     },
//   },
//   course: {
//     type: String,
//     required: function () {
//       return this.gradeLevel === "College";
//     },
//   },
// });

// module.exports = mongoose.model("LearningBackground", LearningBackgroundSchema);
