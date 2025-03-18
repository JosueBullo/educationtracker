// // import React, { useEffect, useState } from "react";
// // import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// // import Navbar from "../components/Navbar";  // Adjust the path if needed
// // import Footer from "../components/Footer";  // Adjust the path if needed
// // import "../components/css/OverallCollege.css";

// // const CareerPredictionDashboard = () => {
// //   const [sourceData, setSourceData] = useState({});
// //   const [combinedData, setCombinedData] = useState([]); // New state for combined data
// //   const [loading, setLoading] = useState(true);

// //   const sources = [
// //     { key: "college_course_predict", label: "College Course Assessment" },
// //     { key: "college_pq_predict", label: "Personality Assessment" },
// //     { key: "college_cert_predict", label: "Skills & Certifications" },
// //     { key: "prediction_exam_college", label: "Career Aptitude Test" }
// //   ];

// //   const safeParseJSON = (jsonString) => {
// //     try {
// //       return JSON.parse(jsonString);
// //     } catch (e) {
// //       console.error("Failed to parse JSON:", e);
// //       return null;
// //     }
// //   };

// //   const extractCareers = (parsedData) => {
// //     if (!parsedData) return [];
// //     let careersArray = [];
    
// //     if (Array.isArray(parsedData)) {
// //       careersArray = parsedData;
// //     } else if (parsedData.careers) {
// //       careersArray = parsedData.careers;
// //     } else if (typeof parsedData === 'object') {
// //       careersArray = Object.entries(parsedData)
// //         .filter(([key]) => !["id", "name", "email", "userId"].includes(key))
// //         .map(([career, score]) => ({ career, score: parseFloat(score) || 0 }));
// //     }
// //     return careersArray.filter(item => !isNaN(item.score));
// //   };

// //   useEffect(() => {
// //     const loadData = () => {
// //       const dataBySource = {};
// //       let combined = {}; // Object to store combined scores

// //       sources.forEach(({ key, label }) => {
// //         const storedData = localStorage.getItem(key);
// //         if (storedData) {
// //           const parsedData = safeParseJSON(storedData);
// //           const careers = extractCareers(parsedData);
// //           dataBySource[key] = {
// //             label,
// //             data: careers
// //               .map(({ career, score }) => ({ career, score: parseFloat(score.toFixed(2)) }))
// //               .sort((a, b) => b.score - a.score)
// //           };

// //           // Aggregate scores for combined data
// //           careers.forEach(({ career, score }) => {
// //             combined[career] = (combined[career] || 0) + score;
// //           });
// //         }
// //       });

// //       // Convert combined data to array and sort
// //       const sortedCombined = Object.entries(combined)
// //         .map(([career, score]) => ({ career, score: parseFloat(score.toFixed(2)) }))
// //         .sort((a, b) => b.score - a.score);

// //       setSourceData(dataBySource);
// //       setCombinedData(sortedCombined); // Set combined data
// //       setLoading(false);
// //     };
// //     loadData();
// //   }, []);

// //   return (
    
// //     <div className="career-dashboard-container">
// //       <Navbar />
// //       <div style={{ height: "100px" }}></div>
// //       <div className="content-wrapper">
// //         <div className="container bg-white shadow-lg rounded-xl p-6">
// //           <h2 className="text-2xl font-bold mb-4">Your Career Prediction Results</h2>
// //           {loading ? (
// //             <p className="text-center">Loading career data...</p>
// //           ) : (
// //             <>
// //               {/* Overall Graph Section */}
// //               <div className="mb-8">
// //                 <h3 className="text-lg font-semibold mb-2">Overall Career Match Scores</h3>
// //                 <div className="mb-6">
// //                   <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
// //                   <ul className="space-y-2">
// //                     {combinedData.slice(0, 5).map((career, index) => (
// //                       <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
// //                         <span className="font-medium">{index + 1}. {career.career}</span>
// //                         <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //                 <div className="mt-6">
// //                   <h4 className="text-md font-medium mb-2">Combined Career Match Scores</h4>
// //                   <ResponsiveContainer width="100%" height={300}>
// //                     <BarChart data={combinedData.slice(0, 10)} layout="vertical">
// //                       <CartesianGrid strokeDasharray="3 3" horizontal={false} />
// //                       <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
// //                       <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
// //                       <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
// //                       <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </div>

// //               {/* Individual Source Graphs */}
// //               {sources.map(({ key, label }) => (
// //                 sourceData[key] && (
// //                   <div key={key} className="mb-8">
// //                     <h3 className="text-lg font-semibold mb-2">{label}</h3>
// //                     <div className="mb-6">
// //                       <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
// //                       <ul className="space-y-2">
// //                         {sourceData[key].data.slice(0, 5).map((career, index) => (
// //                           <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
// //                             <span className="font-medium">{index + 1}. {career.career}</span>
// //                             <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                     <div className="mt-6">
// //                       <h4 className="text-md font-medium mb-2">Career Match Scores</h4>
// //                       <ResponsiveContainer width="100%" height={300}>
// //                         <BarChart data={sourceData[key].data.slice(0, 10)} layout="vertical">
// //                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
// //                           <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
// //                           <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
// //                           <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
// //                           <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
// //                         </BarChart>
// //                       </ResponsiveContainer>
// //                     </div>
// //                   </div>
// //                 )
// //               ))}

// //               {/* Interpretation Section */}
// //               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
// //                 <h3 className="text-lg font-semibold mb-2">How to Interpret Your Results</h3>
// //                 <p className="text-gray-600">
// //                   The scores represent how well your skills, personality, and preferences align with each career. 
// //                   Higher scores indicate a stronger match. Use this information to explore careers that best suit you!
// //                 </p>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default CareerPredictionDashboard;

// // -----------------------------------------------------------------------------------------------------------------

// // import React, { useEffect, useState } from "react";
// // import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// // import Navbar from "../components/Navbar";  // Adjust the path if needed
// // import Footer from "../components/Footer";  // Adjust the path if needed
// // import "../components/css/OverallCollege.css";
// // import axios from "axios";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const CareerPredictionDashboard = () => {
// //   const [sourceData, setSourceData] = useState({});
// //   const [combinedData, setCombinedData] = useState([]); // New state for combined data
// //   const [loading, setLoading] = useState(true);
// //   const [saveStatus, setSaveStatus] = useState(""); // To track save status
// //   const [user, setUser] = useState(null);
// //   const [topChoices, setTopChoices] = useState([]);


// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       const token = localStorage.getItem("auth-token");
// //       if (!token) return;
// //       try {
// //         const res = await axios.post("http://localhost:4000/api/auth/user", { token });
// //         setUser(res.data.user);
// //       } catch (error) {
// //         console.error("User fetch failed", error);
// //       }
// //     };
// //     fetchUser();
// //   }, []);


// //   const sources = [
// //     { key: "college_course_predict", label: "College Course Assessment" },
// //     { key: "college_pq_predict", label: "Personality Assessment" },
// //     { key: "college_cert_predict", label: "Skills & Certifications" },
// //     { key: "prediction_exam_college", label: "Career Aptitude Test" }
// //   ];

// //   const safeParseJSON = (jsonString) => {
// //     try {
// //       return JSON.parse(jsonString);
// //     } catch (e) {
// //       console.error("Failed to parse JSON:", e);
// //       return null;
// //     }
// //   };

// //   const extractCareers = (parsedData) => {
// //     if (!parsedData) return [];
// //     let careersArray = [];
    
// //     if (Array.isArray(parsedData)) {
// //       careersArray = parsedData;
// //     } else if (parsedData.careers) {
// //       careersArray = parsedData.careers;
// //     } else if (typeof parsedData === 'object') {
// //       careersArray = Object.entries(parsedData)
// //         .filter(([key]) => !["id", "name", "email", "userId"].includes(key))
// //         .map(([career, score]) => ({ career, score: parseFloat(score) || 0 }));
// //     }
// //     return careersArray.filter(item => !isNaN(item.score));
// //   };

// //   useEffect(() => {
// //     const loadData = () => {
// //       const dataBySource = {};
// //       let combined = {}; // Object to store combined scores

// //       sources.forEach(({ key, label }) => {
// //         const storedData = localStorage.getItem(key);
// //         if (storedData) {
// //           const parsedData = safeParseJSON(storedData);
// //           const careers = extractCareers(parsedData);
// //           dataBySource[key] = {
// //             label,
// //             data: careers
// //               .map(({ career, score }) => ({ career, score: parseFloat(score.toFixed(2)) }))
// //               .sort((a, b) => b.score - a.score)
// //           };

// //           // Aggregate scores for combined data
// //           careers.forEach(({ career, score }) => {
// //             combined[career] = (combined[career] || 0) + score;
// //           });
// //         }
// //       });

// //       // Convert combined data to array and sort
// //       const sortedCombined = Object.entries(combined)
// //         .map(([career, score]) => ({ career, score: parseFloat(score.toFixed(2)) }))
// //         .sort((a, b) => b.score - a.score);

// //       setSourceData(dataBySource);
// //       setCombinedData(sortedCombined); // Set combined data
// //       setLoading(false);
// //     };
// //     loadData();
// //   }, []);

// //   useEffect(() => {
// //     if (!user || !user._id) return;

// //     const payload = {
// //       userId: user._id,
// //       college_cert_predict: JSON.parse(localStorage.getItem("college_cert_predict")) || {},
// //       college_course_prediction: JSON.parse(localStorage.getItem("college_course_predict")) || {},
// //       college_pq_predict: JSON.parse(localStorage.getItem("college_pq_predict")) || {},
// //       prediction_exam_college: JSON.parse(localStorage.getItem("prediction_exam_college")) || {},
// //       examScores: JSON.parse(localStorage.getItem("examScores")) || {},
// //     };

// //     axios
// //       .post("http://localhost:4000/api/prediction_college/save", payload)
// //       .then((res) => {
// //         console.log("College predictions saved successfully:", res.data);
// //         toast.success("✅ Successfully saved to database!");
// //       })
// //       .catch((error) => {
// //         console.error("Failed to save college predictions", error);
// //         toast.error("❌ Failed to save data. Please try again.");
// //       });
// //   }, [user]);

// //   return (
    
// //     <div className="career-dashboard-container">
// //       <Navbar />
// //       <div style={{ height: "100px" }}></div>
// //       <div className="content-wrapper">
// //         <div className="container bg-white shadow-lg rounded-xl p-6">
// //           <h2 className="text-2xl font-bold mb-4">Your Career Prediction Results</h2>
// //           {loading ? (
// //             <p className="text-center">Loading career data...</p>
// //           ) : (
// //             <>
// //               {/* Overall Graph Section */}
// //               <div className="mb-8">
// //                 <h3 className="text-lg font-semibold mb-2">Overall Career Match Scores</h3>
// //                 <div className="mb-6">
// //                   <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
// //                   <ul className="space-y-2">
// //                     {combinedData.slice(0, 5).map((career, index) => (
// //                       <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
// //                         <span className="font-medium">{index + 1}. {career.career}</span>
// //                         <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //                 <div className="mt-6">
// //                   <h4 className="text-md font-medium mb-2">Combined Career Match Scores</h4>
// //                   <ResponsiveContainer width="100%" height={300}>
// //                     <BarChart data={combinedData.slice(0, 10)} layout="vertical">
// //                       <CartesianGrid strokeDasharray="3 3" horizontal={false} />
// //                       <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
// //                       <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
// //                       <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
// //                       <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </div>

// //               {/* Individual Source Graphs */}
// //               {sources.map(({ key, label }) => (
// //                 sourceData[key] && (
// //                   <div key={key} className="mb-8">
// //                     <h3 className="text-lg font-semibold mb-2">{label}</h3>
// //                     <div className="mb-6">
// //                       <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
// //                       <ul className="space-y-2">
// //                         {sourceData[key].data.slice(0, 5).map((career, index) => (
// //                           <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
// //                             <span className="font-medium">{index + 1}. {career.career}</span>
// //                             <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                     <div className="mt-6">
// //                       <h4 className="text-md font-medium mb-2">Career Match Scores</h4>
// //                       <ResponsiveContainer width="100%" height={300}>
// //                         <BarChart data={sourceData[key].data.slice(0, 10)} layout="vertical">
// //                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
// //                           <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
// //                           <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
// //                           <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
// //                           <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
// //                         </BarChart>
// //                       </ResponsiveContainer>
// //                     </div>
// //                   </div>

                  
// //                 )
// //               ))}

// //               {/* Interpretation Section */}
// //               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
// //                 <h3 className="text-lg font-semibold mb-2">How to Interpret Your Results</h3>
// //                 <p className="text-gray-600">
// //                   The scores represent how well your skills, personality, and preferences align with each career. 
// //                   Higher scores indicate a stronger match. Use this information to explore careers that best suit you!
// //                 </p>
// //               </div>
// //               <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} />
// //             </>
// //           )}
// //         </div>
// //       </div>
// //       <Footer />
      
// //     </div>
// //   );
// // };

// // export default CareerPredictionDashboard;


// // ---------------------------------------------------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// import { useNavigate } from "react-router-dom"; // Import useNavigate hook
// import Navbar from "../components/Navbar";  // Adjust the path if needed
// import Footer from "../components/Footer";  // Adjust the path if needed
// import "../components/css/OverallCollege.css";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CareerPredictionDashboard = () => {
//   const [sourceData, setSourceData] = useState({});
//   const [combinedData, setCombinedData] = useState([]); // New state for combined data
//   const [loading, setLoading] = useState(true);
//   const [saveStatus, setSaveStatus] = useState(""); // To track save status
//   const [user, setUser] = useState(null);
//   const [topChoices, setTopChoices] = useState([]);
//   const navigate = useNavigate(); // Initialize navigate hook

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("auth-token");
//       if (!token) return;
//       try {
//         const res = await axios.post("http://localhost:4000/api/auth/user", { token });
//         setUser(res.data.user);
//       } catch (error) {
//         console.error("User fetch failed", error);
//       }
//     };
//     fetchUser();
//   }, []);

//   const sources = [
//     { key: "college_course_predict", label: "College Course Assessment" },
//     { key: "college_pq_predict", label: "Personality Assessment" },
//     { key: "college_cert_predict", label: "Skills & Certifications" },
//     { key: "prediction_exam_college", label: "Career Aptitude Test" }
//   ];

//   const safeParseJSON = (jsonString) => {
//     try {
//       return JSON.parse(jsonString);
//     } catch (e) {
//       console.error("Failed to parse JSON:", e);
//       return null;
//     }
//   };

//   const extractCareers = (parsedData) => {
//     if (!parsedData) return [];
//     let careersArray = [];
    
//     if (Array.isArray(parsedData)) {
//       careersArray = parsedData;
//     } else if (parsedData.careers) {
//       careersArray = parsedData.careers;
//     } else if (typeof parsedData === 'object') {
//       careersArray = Object.entries(parsedData)
//         .filter(([key]) => !["id", "name", "email", "userId"].includes(key))
//         .map(([career, score]) => ({ career, score: parseFloat(score) || 0 }));
//     }
//     return careersArray.filter(item => !isNaN(item.score));
//   };

//   useEffect(() => {
//     const loadData = () => {
//       const dataBySource = {};
//       let combined = {}; // Object to store combined scores

//       sources.forEach(({ key, label }) => {
//         const storedData = localStorage.getItem(key);
//         if (storedData) {
//           const parsedData = safeParseJSON(storedData);
//           const careers = extractCareers(parsedData);
//           dataBySource[key] = {
//             label,
//             data: careers
//               .map(({ career, score }) => ({ career, score: parseFloat(score.toFixed(2)) }))
//               .sort((a, b) => b.score - a.score)
//           };

//           // Aggregate scores for combined data
//           careers.forEach(({ career, score }) => {
//             combined[career] = (combined[career] || 0) + score;
//           });
//         }
//       });

//       // Convert combined data to array and sort
//       const sortedCombined = Object.entries(combined)
//         .map(([career, score]) => ({ career, score: parseFloat(score.toFixed(2)) }))
//         .sort((a, b) => b.score - a.score);

//       setSourceData(dataBySource);
//       setCombinedData(sortedCombined); // Set combined data
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (!user || !user._id) return;

//     const payload = {
//       userId: user._id,
//       college_cert_predict: JSON.parse(localStorage.getItem("college_cert_predict")) || {},
//       college_course_prediction: JSON.parse(localStorage.getItem("college_course_predict")) || {},
//       college_pq_predict: JSON.parse(localStorage.getItem("college_pq_predict")) || {},
//       prediction_exam_college: JSON.parse(localStorage.getItem("prediction_exam_college")) || {},
//       examScores: JSON.parse(localStorage.getItem("examScores")) || {},
//     };

//     axios
//       .post("http://localhost:4000/api/prediction_college/save", payload)
//       .then((res) => {
//         console.log("College predictions saved successfully:", res.data);
//         toast.success("✅ Successfully saved to database!");
//       })
//       .catch((error) => {
//         console.error("Failed to save college predictions", error);
//         toast.error("❌ Failed to save data. Please try again.");
//       });
//   }, [user]);

//   // Function to handle generating report
//   const handleGenerateReport = () => {
//     // You can add logic here to determine which page to navigate to
//     // For example, based on certain conditions or user preferences
//     // For now, let's just navigate to FinalResultCOLLEGE
//     navigate("/FinalResultCOLLEGE");
//     // Or use this line instead if you want to navigate to OverallCollegegraph
//     // navigate("/OverallCollegegraph");
//   };

//   return (
//     <div className="career-dashboard-container">
//       <Navbar />
//       <div style={{ height: "100px" }}></div>
//       <div className="content-wrapper">
//         <div className="container bg-white shadow-lg rounded-xl p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">Your Career Prediction Results</h2>
//             <button 
//               onClick={handleGenerateReport}
//               className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
//             >
//               Generate Detailed Report
//             </button>
//           </div>
          
//           {loading ? (
//             <p className="text-center">Loading career data...</p>
//           ) : (
//             <>
//               {/* Overall Graph Section */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold mb-2">Overall Career Match Scores</h3>
//                 <div className="mb-6">
//                   <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
//                   <ul className="space-y-2">
//                     {combinedData.slice(0, 5).map((career, index) => (
//                       <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
//                         <span className="font-medium">{index + 1}. {career.career}</span>
//                         <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="mt-6">
//                   <h4 className="text-md font-medium mb-2">Combined Career Match Scores</h4>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={combinedData.slice(0, 10)} layout="vertical">
//                       <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//                       <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
//                       <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
//                       <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
//                       <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Individual Source Graphs */}
//               {sources.map(({ key, label }) => (
//                 sourceData[key] && (
//                   <div key={key} className="mb-8">
//                     <h3 className="text-lg font-semibold mb-2">{label}</h3>
//                     <div className="mb-6">
//                       <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
//                       <ul className="space-y-2">
//                         {sourceData[key].data.slice(0, 5).map((career, index) => (
//                           <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
//                             <span className="font-medium">{index + 1}. {career.career}</span>
//                             <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                     <div className="mt-6">
//                       <h4 className="text-md font-medium mb-2">Career Match Scores</h4>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={sourceData[key].data.slice(0, 10)} layout="vertical">
//                           <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//                           <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
//                           <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
//                           <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
//                           <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 )
//               ))}

//               {/* Interpretation Section */}
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-2">How to Interpret Your Results</h3>
//                 <p className="text-gray-600">
//                   The scores represent how well your skills, personality, and preferences align with each career. 
//                   Higher scores indicate a stronger match. Use this information to explore careers that best suit you!
//                 </p>
//                 <p className="text-gray-600 mt-2">
//                   <span className="font-medium">Need more details?</span> Generate a comprehensive report to get deeper insights into your career matches and personalized recommendations.
//                 </p>
//               </div>
//               <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} />
//             </>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default CareerPredictionDashboard;

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/css/OverallCollege.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CareerPredictionDashboard = () => {
  const [sourceData, setSourceData] = useState({});
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) return;
      try {
        const res = await axios.post("http://localhost:4000/api/auth/user", { token });
        setUser(res.data.user);
      } catch (error) {
        console.error("User fetch failed", error);
      }
    };
    fetchUser();
  }, []);

  const sources = [
    { key: "college_course_predict", label: "College Course Assessment" },
    { key: "college_pq_predict", label: "Personality Assessment" },
    { key: "college_cert_predict", label: "Skills & Certifications" },
    { key: "prediction_exam_college", label: "Career Aptitude Test" }
  ];

  const safeParseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return null;
    }
  };

  const extractCareers = (parsedData) => {
    if (!parsedData) return [];
    let careersArray = [];
    
    if (Array.isArray(parsedData)) {
      careersArray = parsedData;
    } else if (parsedData.careers) {
      careersArray = parsedData.careers;
    } else if (typeof parsedData === 'object') {
      careersArray = Object.entries(parsedData)
        .filter(([key]) => !["id", "name", "email", "userId"].includes(key))
        .map(([career, score]) => ({ career, score: parseFloat(score) || 0 }));
    }
    return careersArray.filter(item => !isNaN(item.score));
  };

  useEffect(() => {
    const loadData = () => {
      const dataBySource = {};
      let combined = {};

      sources.forEach(({ key, label }) => {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          const parsedData = safeParseJSON(storedData);
          const careers = extractCareers(parsedData);
          dataBySource[key] = {
            label,
            data: careers
              .map(({ career, score }) => ({ career, score: parseFloat(score.toFixed(2)) }))
              .sort((a, b) => b.score - a.score)
          };

          careers.forEach(({ career, score }) => {
            combined[career] = (combined[career] || 0) + score;
          });
        }
      });

      const sortedCombined = Object.entries(combined)
        .map(([career, score]) => ({ career, score: parseFloat(score.toFixed(2)) }))
        .sort((a, b) => b.score - a.score);

      setSourceData(dataBySource);
      setCombinedData(sortedCombined);
      localStorage.setItem("combined_scores", JSON.stringify(sortedCombined));
      setLoading(false);
    };

    const storedCombinedData = localStorage.getItem("combined_scores");
    if (storedCombinedData) {
      const parsedCombinedData = safeParseJSON(storedCombinedData);
      setCombinedData(parsedCombinedData);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!user || !user._id) return;

    const payload = {
      userId: user._id,
      college_cert_predict: JSON.parse(localStorage.getItem("college_cert_predict")) || {},
      college_course_prediction: JSON.parse(localStorage.getItem("college_course_predict")) || {},
      college_pq_predict: JSON.parse(localStorage.getItem("college_pq_predict")) || {},
      prediction_exam_college: JSON.parse(localStorage.getItem("prediction_exam_college")) || {},
      examScores: JSON.parse(localStorage.getItem("examScores")) || {},
      combined_scores: combinedData,
    };

    axios
      .post("http://localhost:4000/api/prediction_college/save", payload)
      .then((res) => {
        console.log("College predictions saved successfully:", res.data);
        toast.success("✅ Successfully saved to database!");
      })
      .catch((error) => {
        console.error("Failed to save college predictions", error);
        toast.error("❌ Failed to save data. Please try again.");
      });
  }, [user, combinedData]);

  const handleGenerateReport = () => {
    navigate("/FinalResultCOLLEGE");
  };

  return (
    <div className="career-dashboard-container">
      <Navbar />
      <div style={{ height: "100px" }}></div>
      <div className="content-wrapper">
        <div className="container bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Career Prediction Results</h2>
            <button 
              onClick={handleGenerateReport}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Generate Detailed Report
            </button>
          </div>
          
          {loading ? (
            <p className="text-center">Loading career data...</p>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Overall Career Match Scores</h3>
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
                  <ul className="space-y-2">
                    {combinedData.slice(0, 5).map((career, index) => (
                      <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">{index + 1}. {career.career}</span>
                        <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-2">Combined Career Match Scores</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={combinedData.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
                      <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
                      <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {sources.map(({ key, label }) => (
                sourceData[key] && (
                  <div key={key} className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">{label}</h3>
                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-2">Top Recommended Careers</h4>
                      <ul className="space-y-2">
                        {sourceData[key].data.slice(0, 5).map((career, index) => (
                          <li key={career.career} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium">{index + 1}. {career.career}</span>
                            <span className="text-indigo-600 font-semibold">{career.score.toFixed(1)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-md font-medium mb-2">Career Match Scores</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sourceData[key].data.slice(0, 10)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[0, 'dataMax * 1.1']} tickFormatter={(value) => value.toFixed(1)} />
                          <YAxis dataKey="career" type="category" width={150} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${value}`, 'Score']} contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
                          <Bar name="Career Match Score" dataKey="score" fill="#4F46E5" label={{ position: 'right', formatter: (value) => value.toFixed(1) }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )
              ))}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">How to Interpret Your Results</h3>
                <p className="text-gray-600">
                  The scores represent how well your skills, personality, and preferences align with each career. 
                  Higher scores indicate a stronger match. Use this information to explore careers that best suit you!
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Need more details?</span> Generate a comprehensive report to get deeper insights into your career matches and personalized recommendations.
                </p>
              </div>
              <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareerPredictionDashboard;