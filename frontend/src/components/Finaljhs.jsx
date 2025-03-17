import React, { useEffect, useState, useRef } from "react";
import { Bar, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from "chart.js";
import { useNavigate } from "react-router-dom";
import Nav2 from "./Nav2";
import "../components/css/Final1.css";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title, 
  Tooltip, 
  Legend
);

const strandDescriptions = {
  STEM: "Science, Technology, Engineering, and Mathematics (STEM) is for students interested in scientific innovations, engineering, and technological advancements. It prepares students for careers in medicine, architecture, engineering, data science, and research by focusing on subjects like physics, calculus, biology, and computer science.",
  
  ABM: "The Accountancy, Business, and Management (ABM) strand is designed for students who aspire to become entrepreneurs, corporate professionals, and financial experts. It covers subjects like business ethics, marketing strategies, economics, accounting, and corporate management, providing a solid foundation for business and commerce-related courses in college.",

  HUMSS: "The Humanities and Social Sciences (HUMSS) strand is perfect for students passionate about history, culture, communication, and public service. It leads to careers in law, journalism, political science, psychology, sociology, and education by focusing on subjects like philosophy, literature, public speaking, and social sciences.",

  GAS: "The General Academic Strand (GAS) is for students who are still exploring their career path. It offers a flexible curriculum that includes a mix of subjects from STEM, ABM, and HUMSS, preparing students for various college courses and professions in administration, liberal arts, education, and government.",

  "Home Economics": "The Home Economics (HE) strand under the Technical-Vocational-Livelihood (TVL) track focuses on skills-based training in hospitality, culinary arts, fashion design, and caregiving. It prepares students for careers in tourism, hotel and restaurant management, food services, and entrepreneurship.",

  ICT: "The Information and Communications Technology (ICT) strand under TVL is ideal for tech-savvy students. It covers programming, networking, cybersecurity, web development, and software engineering, equipping students with skills for careers in IT, animation, game development, and digital arts.",

  "Industrial Arts": "The Industrial Arts strand prepares students for careers in technical trades and engineering. It includes training in welding, carpentry, electrical installation, plumbing, and automotive mechanics, providing job-ready skills for the construction and manufacturing industries.",

  "Agri-Fishery Arts": "The Agri-Fishery Arts strand focuses on agricultural technology, animal husbandry, fisheries, and organic farming. It equips students with knowledge in sustainable agriculture, farm mechanics, aquaculture, and agro-forestry, preparing them for careers in agribusiness and environmental management.",

  Cookery: "The Cookery strand under Home Economics provides in-depth training in culinary arts, baking, food safety, and international cuisine. It is designed for students who want to pursue careers as chefs, bakers, or restaurant owners.",

  "Performing Arts": "The Performing Arts strand under the Arts and Design track is for students passionate about dance, theater, music, and acting. It covers stage performance, choreography, vocal training, and drama, preparing students for careers in entertainment and live productions.",

  "Visual Arts": "The Visual Arts strand focuses on painting, sculpture, digital art, and illustration. It provides students with creative and technical skills needed for careers in graphic design, animation, fine arts, and advertising.",

  "Media Arts": "The Media Arts strand teaches students film production, cinematography, photography, video editing, and digital storytelling. It is ideal for those interested in filmmaking, multimedia arts, and broadcast media.",

  "Literary Arts": "The Literary Arts strand is designed for students who have a passion for writing, poetry, fiction, and journalism. It focuses on creative writing, literature, and publishing, preparing students for careers as writers, editors, and communication professionals.",

  Sports: "The Sports strand is for students interested in athletics, physical education, and sports science. It covers coaching, sports management, health and fitness, and competitive sports training, leading to careers in professional sports, coaching, and physical therapy."
};

const careerPathways = {
  STEM: ["Medicine", "Engineering", "Architecture", "Data Science", "Research Scientist", "Mathematician", "IT Professional", "Environmental Scientist"],
  ABM: ["Entrepreneur", "Accountant", "Business Manager", "Financial Analyst", "Marketing Executive", "Human Resources", "Economist", "Investment Banker"],
  HUMSS: ["Lawyer", "Journalist", "Psychologist", "Teacher", "Social Worker", "Political Scientist", "Diplomat", "Public Relations"],
  GAS: ["Public Administrator", "Liberal Arts", "Education", "Government Service", "General Management", "Customer Service", "Administrative Assistant"],
  "Home Economics": ["Chef", "Hotel Manager", "Fashion Designer", "Interior Designer", "Nutritionist", "Caregiver", "Tourism Officer", "Event Planner"],
  ICT: ["Software Developer", "Web Designer", "Network Administrator", "Game Developer", "Cybersecurity Specialist", "IT Support", "Digital Artist", "Database Administrator"],
  "Industrial Arts": ["Civil Engineer", "Mechanical Engineer", "Electrician", "Automotive Mechanic", "Construction Manager", "HVAC Technician", "Welder", "Carpenter"],
  "Agri-Fishery Arts": ["Farm Manager", "Agricultural Scientist", "Aquaculture Specialist", "Food Technologist", "Environmental Consultant", "Landscape Designer", "Forestry Technician"],
  Cookery: ["Executive Chef", "Pastry Chef", "Restaurant Owner", "Food Critic", "Food Service Manager", "Caterer", "Food Stylist", "Culinary Instructor"],
  "Performing Arts": ["Actor", "Dancer", "Singer", "Theater Director", "Choreographer", "Music Producer", "Voice Coach", "Talent Manager"],
  "Visual Arts": ["Graphic Designer", "Illustrator", "Sculptor", "Painter", "Art Director", "Animator", "Fashion Illustrator", "Museum Curator"],
  "Media Arts": ["Film Director", "Cinematographer", "Video Editor", "Photographer", "Sound Engineer", "Broadcasting Professional", "Social Media Manager"],
  "Literary Arts": ["Author", "Editor", "Journalist", "Copywriter", "Literary Agent", "Publisher", "Screenwriter", "Content Creator"],
  Sports: ["Athletic Coach", "Sports Manager", "Physical Therapist", "Fitness Instructor", "Sports Nutritionist", "Sports Analyst", "Recreation Director", "Professional Athlete"]
};

const getPersonalizedMessage = (topStrand, secondStrand, thirdStrand) => {
  return `
  # Your Academic and Career Path: A Personalized Analysis

  ## Understanding Your Results
  
  Your assessment results indicate that your primary strength lies in the **${topStrand}** strand, with significant aptitude also showing in **${secondStrand}** and **${thirdStrand}**. This unique combination reflects your diverse talents and interests, creating a promising foundation for your academic journey.
  
  ## Your Primary Path: ${topStrand}
  
  Your high alignment with the ${topStrand} strand suggests that you possess the core traits and abilities valued in this field. Students who excel in ${topStrand} typically demonstrate ${getTraitsForStrand(topStrand)}.
  
  The curriculum will challenge and develop your ${getSkillsForStrand(topStrand)}. These skills are highly transferable and will serve you well regardless of your ultimate career choice.
  
  ## Complementary Strengths
  
  Your secondary alignment with ${secondStrand} adds valuable versatility to your profile. This complementary strength means you can approach ${topStrand} challenges with insights from the ${secondStrand} perspective, potentially leading to innovative solutions and approaches that purely ${topStrand}-focused students might miss.
  
  Similarly, your tertiary strength in ${thirdStrand} provides yet another dimension to your skill set. This multi-faceted capability is increasingly valued in today's interconnected world.
  
  ## Career Possibilities
  
  With your ${topStrand} foundation, career paths such as ${getTopCareersForStrand(topStrand).join(", ")} would be natural fits for your abilities. Your ${secondStrand} aptitude opens additional possibilities in ${getTopCareersForStrand(secondStrand).slice(0, 3).join(", ")}.
  
  ## Recommendations for Success
  
  1. **Core Focus**: Fully engage with the ${topStrand} curriculum to build your fundamental knowledge and skills.
  2. **Strategic Electives**: Consider electives that leverage your ${secondStrand} and ${thirdStrand} strengths.
  3. **Experiential Learning**: Seek internships, projects, or volunteer opportunities that let you apply your ${topStrand} skills in real-world settings.
  4. **Mentorship**: Connect with professionals who have successfully combined ${topStrand} with other interests.
  5. **Continuous Self-Assessment**: Your interests and goals may evolve; remain open to adjusting your path accordingly.
  
  Remember that this assessment is a starting point for exploration, not a rigid determination of your capabilities. Your unique combination of strengths gives you advantages that extend beyond any single strand classification.
  `;
};

const getTraitsForStrand = (strand) => {
  const traits = {
    STEM: "analytical thinking, problem-solving aptitude, and systematic approach to challenges",
    ABM: "business acumen, financial literacy, and leadership potential",
    HUMSS: "strong communication skills, empathy, and social awareness",
    GAS: "adaptability, balanced capabilities across multiple disciplines, and a holistic perspective",
    "Home Economics": "practical creativity, attention to detail, and service orientation",
    ICT: "technical problem-solving, digital literacy, and logical thinking",
    "Industrial Arts": "spatial awareness, practical problem-solving, and technical precision",
    "Agri-Fishery Arts": "environmental awareness, resource management skills, and practical scientific understanding",
    Cookery: "creativity with precision, sensory awareness, and attention to detail",
    "Performing Arts": "expressive capabilities, kinesthetic intelligence, and emotional depth",
    "Visual Arts": "visual creativity, aesthetic sensibility, and innovative thinking",
    "Media Arts": "visual storytelling ability, technical creativity, and communication skills",
    "Literary Arts": "verbal fluency, narrative thinking, and analytical reading skills",
    Sports: "physical coordination, team leadership, and performance under pressure"
  };
  return traits[strand] || "diverse skills and interests";
};

const getSkillsForStrand = (strand) => {
  const skills = {
    STEM: "quantitative reasoning, scientific methodology, and analytical capabilities",
    ABM: "financial analysis, organizational management, and strategic planning",
    HUMSS: "critical thinking, cultural competence, and effective communication",
    GAS: "interdisciplinary thinking, adaptability, and foundational knowledge across domains",
    "Home Economics": "service management, design thinking, and practical implementation",
    ICT: "computational thinking, technical problem-solving, and digital creation",
    "Industrial Arts": "technical drawing, mechanical reasoning, and hands-on construction",
    "Agri-Fishery Arts": "sustainable practices, biological systems management, and practical ecology",
    Cookery: "culinary techniques, food science principles, and sensory evaluation",
    "Performing Arts": "performance techniques, bodily-kinesthetic awareness, and emotional expression",
    "Visual Arts": "design principles, visual composition, and creative expression",
    "Media Arts": "multimedia storytelling, production techniques, and digital composition",
    "Literary Arts": "rhetorical skills, narrative construction, and critical analysis",
    Sports: "physical conditioning, strategic thinking, and teamwork dynamics"
  };
  return skills[strand] || "various academic and practical abilities";
};

const getTopCareersForStrand = (strand) => {
  return careerPathways[strand] || ["Various professional roles"];
};

const OverallResult = () => {
  const [chartData, setChartData] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [individualCharts, setIndividualCharts] = useState([]);
  const [topChoices, setTopChoices] = useState([]);
  const [user, setUser] = useState(null);
  const [personalizedMessage, setPersonalizedMessage] = useState("");
  const navigate = useNavigate();
  const reportRef = useRef(null);

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

  useEffect(() => {
    const sources = {
      "Overall Prediction": ["predictions", "certprediction", "pqprediction", "prediction_exam_jhs"],
      "From Grades": ["predictions"],
      "From Certificate": ["certprediction"],
      "From Personal Questionnaire": ["pqprediction"],
      "From Exam Results": ["prediction_exam_jhs"]
    };

    const allStrands = {};
    const individualData = [];
    const colorPalette = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(40, 159, 64, 0.7)',
      'rgba(210, 99, 132, 0.7)',
      'rgba(30, 162, 235, 0.7)',
      'rgba(230, 206, 86, 0.7)',
      'rgba(50, 192, 192, 0.7)',
      'rgba(180, 102, 255, 0.7)'
    ];

    Object.entries(sources).forEach(([label, keys]) => {
      const strandScores = {};

      keys.forEach((key) => {
        const storedData = localStorage.getItem(key);
        if (!storedData) return;

        let data;
        try {
          data = JSON.parse(storedData);
        } catch (error) {
          console.error(`Error parsing localStorage data for ${key}:`, error);
          return;
        }

        if (key === "predictions") {
          Object.entries(data).forEach(([strand, values]) => {
            if (values.percentage !== undefined) {
              const numericPercentage = parseFloat(values.percentage) || 0;
              strandScores[strand] = (strandScores[strand] || 0) + numericPercentage;
              allStrands[strand] = (allStrands[strand] || 0) + numericPercentage;
            }
          });
        } else if (key === "pqprediction" && data.predictionScores) {
          data.predictionScores.forEach(({ strand, score }) => {
            const numericScore = parseFloat(score) || 0;
            strandScores[strand] = (strandScores[strand] || 0) + numericScore;
            allStrands[strand] = (allStrands[strand] || 0) + numericScore;
          });
        } else {
          Object.entries(data).forEach(([strand, value]) => {
            const numericValue = parseFloat(value) || 0;
            strandScores[strand] = (strandScores[strand] || 0) + numericValue;
            allStrands[strand] = (allStrands[strand] || 0)

            allStrands[strand] = (allStrands[strand] || 0) + numericValue;
          });
        }
      });

      if (label !== "Overall Prediction" && Object.keys(strandScores).length > 0) {
        individualData.push({
          label,
          chart: {
            labels: Object.keys(strandScores),
            datasets: [{
              label: "Percentage",
              data: Object.values(strandScores),
              backgroundColor: colorPalette.slice(0, Object.keys(strandScores).length),
              borderColor: colorPalette.slice(0, Object.keys(strandScores).length).map(color => color.replace('0.7', '1')),
              borderWidth: 1
            }]
          }
        });
      }
    });

    const sortedStrands = Object.entries(allStrands).sort((a, b) => b[1] - a[1]);

    if (sortedStrands.length > 0) {
      setTopChoices(sortedStrands);
      
      // Create bar chart data
      setChartData({
        labels: sortedStrands.map(([strand]) => strand),
        datasets: [{
          label: "Strand Compatibility",
          data: sortedStrands.map(([_, percentage]) => percentage),
          backgroundColor: colorPalette.slice(0, sortedStrands.length),
          borderColor: colorPalette.slice(0, sortedStrands.length).map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      });
      
      // Create radar chart data for top 5 strands
      const topFiveStrands = sortedStrands.slice(0, 5);
      setRadarData({
        labels: topFiveStrands.map(([strand]) => strand),
        datasets: [{
          label: "Compatibility Score",
          data: topFiveStrands.map(([_, percentage]) => percentage),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)',
          fill: true
        }]
      });
      
      // Create personalized message if we have at least 3 strands
      if (sortedStrands.length >= 3) {
        const topStrand = sortedStrands[0][0];
        const secondStrand = sortedStrands[1][0];
        const thirdStrand = sortedStrands[2][0];
        setPersonalizedMessage(getPersonalizedMessage(topStrand, secondStrand, thirdStrand));
      }
    }

    setIndividualCharts(individualData);
  }, []);

  
  const downloadPDF = () => {
    if (!reportRef.current) {
      alert("Report not found!");
      return;
    }
    
    const opt = {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    };
    
    html2canvas(reportRef.current, opt).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Calculate dimensions to maintain aspect ratio
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let position = 10;
      
      pdf.setFontSize(16);
      pdf.text("Senior High School Strand Prediction Report", pdfWidth / 2, position, { align: "center" });
      position += 10;
      
      // Add student name if available
      if (user && user.name) {
        pdf.setFontSize(12);
        pdf.text(`Student: ${user.name}`, 10, position);
        position += 10;
      }
      
      // Add date
      pdf.setFontSize(12);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 10, position);
      position += 10;
      
      // Add the image, handling pagination if needed
      let heightLeft = imgHeight;
      let pageHeight = pdfHeight - 20;
      let pageData = canvas;
      let positionY = position;
      
      // First page
      pdf.addImage(imgData, "PNG", 10, positionY, imgWidth, imgHeight);
      heightLeft -= pageHeight - positionY;
      
      // Additional pages if needed
      while (heightLeft > 0) {
        positionY = 10;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          10,
          positionY - (imgHeight - heightLeft),
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }
      
      pdf.save("SHS_Strand_Prediction_Report.pdf");
    });
  };
  
  const sendEmail = async () => {
    try {
      // Retrieve user data from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("User information not found. Please log in again.");
        return;
      }
  
      // Parse stored user data
      const user = JSON.parse(storedUser);
  
      // Ensure user object and email exist
      if (!user || !user.email) {
        alert("User email not found!");
        return;
      }
  
      // Ensure report reference is available
      if (!reportRef.current) {
        alert("Report not found!");
        return;
      }
  
      // Convert report to image and send email
      html2canvas(reportRef.current, { scale: 0.3 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.3  ); // JPEG format with 50% quality
  
        await axios.post("http://localhost:4000/api/auth/send-graph-email", {
          image: imgData,
          email: user.email, // Correctly accessing email inside user
        });
  
        alert("Your college course prediction report has been sent to your email successfully!");
      });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };
  

  const printReport = () => {
    if (!reportRef.current) {
      alert("Report not found!");
      return;
    }
    html2canvas(reportRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const win = window.open("", "_blank");
      win.document.write(`
        <html>
          <head>
            <title>SHS Strand Prediction Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; }
                @page { margin: 0.5cm; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="Strand Prediction Report"/>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      win.document.close();
    });
  };
  
  const redirectTodashborad = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Nav2 />
      <div style={{ height: "100px" }}></div>
      <div className="report-page">
        <div className="report-container" ref={reportRef}>
          <div className="report-header">
            <h1>Senior High School Strand Prediction Report</h1>
            {user && <h2>Student: {user.name || "Anonymous Student"}</h2>}
            <p className="report-date">Generated on: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="report-summary">
            <h2>Executive Summary</h2>
            <div className="summary-content">
              {topChoices.length > 0 && (
                <div className="top-recommendations">
                  <h3>Recommended Strands Based on Your Assessment</h3>
                  <div className="recommendation-cards">
                    {topChoices.slice(0, 3).map(([strand, score], index) => (
                      <div key={strand} className={`recommendation-card ${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'tertiary'}`}>
                        <div className="card-header">
                          <span className="rank-badge">{index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}</span>
                          <h4>{strand}</h4>
                          <div className="compatibility-score">
                            <span className="score-value">{score.toFixed(1)}%</span>
                            <span className="score-label">Compatibility</span>
                          </div>
                        </div>
                        <div className="card-body">
                          <p className="strand-description">{strandDescriptions[strand]}</p>
                          <div className="career-paths">
                            <h5>Potential Career Paths:</h5>
                            <ul>
                              {careerPathways[strand]?.slice(0, 5).map(career => (
                                <li key={career}>{career}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="report-visualizations">
            <h2>Assessment Results</h2>
            <div className="charts-row">
              {chartData && (
                <div className="chart-wrapper large-chart">
                  <h3>Overall Strand Compatibility</h3>
                  <Bar 
                    data={chartData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: true,
                      indexAxis: 'y',
                      scales: { 
                        x: { 
                          beginAtZero: true, 
                          max: 100,
                          title: {
                            display: true,
                            text: 'Compatibility Score (%)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'SHS Strands'
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `Compatibility: ${context.raw.toFixed(1)}%`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
              
              {radarData && (
                <div className="chart-wrapper radar-chart">
                  <h3>Top 5 Strands Comparison</h3>
                  <Radar 
                    data={radarData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: true,
                      scales: {
                        r: {
                          angleLines: {
                            display: true
                          },
                          suggestedMin: 0,
                          suggestedMax: 100
                        }
                      },
                      plugins: {
                        legend: {
                          display: false,
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="individual-assessments">
              <h3>Individual Assessment Results</h3>
              <div className="assessment-charts">
                {individualCharts.map(({ label, chart }) => (
                  <div key={label} className="individual-chart-wrapper">
                    <h4>{label}</h4>
                    <Bar 
                      data={chart} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: true,
                        scales: { 
                          y: { 
                            beginAtZero: true, 
                            max: 100,
                            title: {
                              display: true,
                              text: 'Score (%)'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false,
                          }
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="personalized-analysis">
            <h2>Your Personalized Analysis</h2>
            <div className="analysis-content">
              {personalizedMessage ? (
                <div className="markdown-content" dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(personalizedMessage) }} />
              ) : (
                <p>We're preparing your personalized analysis. Please wait a moment...</p>
              )}
            </div>
          </div>
          
          <div className="next-steps">
            <h2>Recommended Next Steps</h2>
            <div className="steps-content">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-info">
                  <h4>Review Your Results</h4>
                  <p>Take time to carefully review and reflect on your strand compatibility results. Consider how they align with your personal interests and long-term goals.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-info">
                  <h4>Research Each Strand</h4>
                  <p>Learn more about the curriculum, subjects, and requirements for your top three recommended strands.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-info">
                  <h4>Speak with Guidance Counselors</h4>
                  <p>Schedule a meeting with your school's guidance counselor to discuss your results and get personalized advice.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-info">
                  <h4>Talk to Industry Professionals</h4>
                  <p>If possible, connect with professionals working in fields related to your top strands to understand real-world applications.</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">5</div>
                <div className="step-info">
                  <h4>Make Your Decision</h4>
                  <p>Use all the information gathered to make an informed decision about which SHS strand aligns best with your goals, abilities, and interests.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="disclaimer">
            <h3>Important Note</h3>
            <p>This assessment is based on your responses to our questionnaires, academic records, and exam results. While our prediction system is designed to provide accurate guidance, it should be considered as one of many factors in your decision-making process. Your personal interests, career aspirations, and strengths should also weigh heavily in your final decision.</p>
          </div>
        </div>
        
        <div className="report-actions">
          <div className="action-buttons">
            <button onClick={downloadPDF} className="action-btn primary">
              <span className="btn-icon">📥</span>
              <span className="btn-text">Download PDF Report</span>
            </button>
            <button onClick={sendEmail} className="action-btn secondary">
              <span className="btn-icon">📧</span>
              <span className="btn-text">Send to My Email</span>
            </button>
            <button onClick={printReport} className="action-btn tertiary">
              <span className="btn-icon">🖨️</span>
              <span className="btn-text">Print Report</span>
            </button>
            <button onClick={redirectTodashborad} className="action-btn">
              <span className="btn-icon">📊</span>
              <span className="btn-text">Return to Dashboard</span>
            </button>
          </div>
  
        </div>
      </div>
      
    
    </>
  );
};

// Helper function to convert markdown to HTML
const convertMarkdownToHtml = (markdown) => {
  // Very basic markdown conversion - in a real app, use a proper markdown library
  return markdown
    .replace(/# (.*)/g, '<h1>$1</h1>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
};

export default OverallResult;