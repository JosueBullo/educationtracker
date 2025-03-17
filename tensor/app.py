import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from prediction_strand_cert import predict_shs_strand_cert

from ocr.infer_grades import extract_subjects_and_grades
from ocr.infer_certificates import extract_relevant_keywords
from ocr.preprocess_grades import extract_text as extract_text_grades
from ocr.preprocess_certificates import extract_text as extract_text_certificates
from ocr.utils import detect_document_type
from prediction_pq import predict_shs_strand  # Import the function from prediction_pq.py
from ocr.predict_grades_shs import predict_grades_shs_tocollege
from predict_cert_shs import predict_college_course_cert
from werkzeug.utils import secure_filename
from ocr.infer_colledge import extract_text_from_certificate





import joblib  # If using a saved model
from ocr import prediction_strand_cert  # If using a function-based approach
# print(dir(ocr.utils))  # Check if perform_ocr is listed

# for pq jhs

import numpy as np

# for prediction exam jhs

import re

import os
import random


# Import the prediction function from a separate module
from predict_strands import predict_strands


app = Flask(__name__)

# Enable CORS for all domains
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Global storage to simulate local storage for extracted grades
latest_extracted_grades = []

@app.route('/predict-strands-jhs', methods=['POST'])
def predict_strands_jhs():
    """
    Accepts a POST request with JSON containing 'extracted_data' and returns predictions.
    """
    try:
        data = request.get_json()
        if not data or 'extracted_data' not in data:
            return jsonify({'error': 'Missing extracted_data in the request.'}), 400
        extracted_data = data['extracted_data']
        predictions = predict_strands(extracted_data)
        # Print predictions in the terminal
        print("Predictions from /predict-strands-jhs:")
        for strand, result in predictions.items():
            print(f"{strand}: {result}")
        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/predict-college-courses', methods=['POST'])
def predict_college_courses():
    """
    Accepts a POST request with JSON containing 'extracted_data' and returns predicted college courses.
    """
    try:
        data = request.get_json()
        if not data or 'extracted_data' not in data:
            return jsonify({'error': 'Missing extracted_data in the request.'}), 400
        
        extracted_data = data['extracted_data']
        predictions = predict_grades_shs_tocollege(extracted_data)

        # Print predictions in the terminal for debugging
        print("Predictions from /predict-college-courses:")
        for category, result in predictions.items():
            print(f"{category}: {result}")

        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route("/process", methods=["POST"])

def process_files():
    """
    Process uploaded grade sheets and certificates, extracting data.
    This endpoint stores the extracted grades in a global variable.
    """
    try:
        grade_level = request.form.get("gradeLevel", "").strip().lower()
        print("Received gradeLevel:", grade_level)

        if "grades" not in request.files and "certificates" not in request.files:
            return jsonify({"error": "Missing files: Please upload grades or certificates."}), 400

        extracted_data = {"grades": [], "certificates": []}

        # Process Grade Sheets
        if "grades" in request.files:
            for file in request.files.getlist("grades"):
                file_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
                file.save(file_path)
                try:
                    text_data = extract_text_grades(file_path)
                    doc_type = detect_document_type(text_data)
                    print(f"File: {file.filename}, Detected Doc Type: {doc_type}")

                    if doc_type == "certificate":
                        extracted_data["grades"].append({
                            "filename": file.filename,
                            "warning": f"{file.filename} appears to be a certificate, not a grade sheet."
                        })
                    else:
                        subjects_grades_result = extract_subjects_and_grades(file_path, use_easyocr=True)
                        print("Extracted grade data:", subjects_grades_result)
                        predictions = {}

                        if "extracted_data" in subjects_grades_result:
                            global latest_extracted_grades
                            latest_extracted_grades = subjects_grades_result["extracted_data"]
                            
                            # Print each extracted subject and its grade in the terminal
                            print("Extracted Grades:")
                            for entry in latest_extracted_grades:
                                subject = entry.get("subject", "N/A")
                                final_grade = entry.get("final_grade", "N/A")
                                print(f"  Subject: {subject}, Final Grade: {final_grade}")

                            if grade_level == "jhs":
                                predictions = predict_strands(latest_extracted_grades)
                                print("Predictions:")
                                for strand, result in predictions.items():
                                    print(f"  {strand}: {result}")
                            elif grade_level == "shs":
                                predictions = predict_grades_shs_tocollege(latest_extracted_grades)
                                print("College Course Predictions:")
                                for category, result in predictions.items():
                                    print(f"  {category}: {result}")
                            else:
                                predictions = {"message": "Prediction for this grade level is not available yet."}

                        extracted_data["grades"].append({
                            "filename": file.filename,
                            "data": subjects_grades_result,
                            "predictions": predictions
                        })
                except Exception as e:
                    extracted_data["grades"].append({
                        "filename": file.filename,
                        "error": f"Failed to extract grades from {file.filename}: {str(e)}"
                    })
        

        # Process Certificates
        if "certificates" in request.files:
            for file in request.files.getlist("certificates"):
                file_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
                file.save(file_path)
                try:
                    # Extract keywords
                    keyword_result = extract_relevant_keywords(file_path)
                    
                    if "extracted_keywords" in keyword_result:
                        extracted_data["certificates"].append({
                            "filename": file.filename,
                            "extracted_keywords": keyword_result["extracted_keywords"]
                        })
                    else:
                        extracted_data["certificates"].append({
                            "filename": file.filename,
                            "error": f"Failed to extract keywords from {file.filename}"
                        })

                except Exception as e:
                    extracted_data["certificates"].append({
                        "filename": file.filename,
                        "error": f"Error processing {file.filename}: {str(e)}"
                    })

        return jsonify(extracted_data), 200

    except Exception as e:
        print("Error processing files:", str(e))
        return jsonify({"error": "An internal error occurred", "details": str(e)}), 500
    
@app.route("/update-grades", methods=["POST"])
def update_grades():
    """
    Update the global latest_extracted_grades with data received from the frontend.
    """
    try:
        global latest_extracted_grades
        data = request.json
        if not data or "extracted_data" not in data:
            return jsonify({"error": "Invalid request, missing 'extracted_data'"}), 400

        latest_extracted_grades = data["extracted_data"]
        # Print updated grades in terminal
        print("Updated Grades:")
        for entry in latest_extracted_grades:
            subject = entry.get("subject", "N/A")
            final_grade = entry.get("final_grade", "N/A")
            print(f"  Subject: {subject}, Final Grade: {final_grade}")
        return jsonify({"message": "Grades updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict-strands", methods=["GET"])
def predict_strands_api():
    """
    Return predictions based on the latest extracted grades.
    This endpoint always uses the most recent data from our global variable.
    """
    try:
        global latest_extracted_grades
        if not latest_extracted_grades:
            return jsonify({"error": "No extracted grades available. Please upload or update grades first."}), 400

        predictions = predict_strands(latest_extracted_grades)
        print("Predictions from /predict-strands API:")
        for strand, result in predictions.items():
            print(f"  {strand}: {result}")
        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/predict-college-courses", methods=["GET"])
def predict_college_courses_api():
    """
    Return predictions based on the latest extracted SHS grades.
    This endpoint always uses the most recent data from our global variable.
    """
    try:
        global latest_extracted_grades
        if not latest_extracted_grades:
            return jsonify({"error": "No extracted grades available. Please upload or update grades first."}), 400

        predictions = predict_grades_shs_tocollege(latest_extracted_grades)
        print("Predictions from /predict-college-courses API:")
        for category, result in predictions.items():
            print(f"  {category}: {result}")

        return jsonify(predictions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
    
# 🔹 Load the model (Ensure this points to your trained model file)
try:
    model = joblib.load("path/to/your/model.pkl")  # Adjust path accordingly
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None  # Fallback if model fails to load
    
    # CERTIFICATES CERTIFICATES  CERTIFICATES  CERTIFICATES  CERTIFICATES ----------------------------------------------------------

@app.route('/predict-strand-cert', methods=['POST'])
def predict_strand_cert():
    data = request.json
    keywords = data.get("keywords", [])

    print("Received keywords:", keywords)  # Debugging
    if not keywords:
        print("❌ No keywords received!")
        return jsonify({"error": "No keywords provided"}), 400

    prediction_result = predict_shs_strand_cert(keywords)

    print("Model Prediction:", prediction_result)  # Debugging
    return jsonify({"strand_prediction": prediction_result})

@app.route('/predict-college-cert', methods=['POST'])
def predict_college_cert():
    data = request.json
    keywords = data.get("keywords", [])

    print("Received keywords:", keywords)  # Debugging
    if not keywords:
        print("❌ No keywords received!")
        return jsonify({"error": "No keywords provided"}), 400

    prediction_result = predict_college_course_cert(keywords)

    print("Model Prediction:", prediction_result)  # Debugging
    return jsonify({"college_course_prediction": prediction_result})


# def predict_shs_strand(answers):
#     """
#     Predicts the Senior High School (SHS) strand based on the student's answers.
#     """
#     strand_scores = {
#         "STEM": 0, "ABM": 0, "HUMSS": 0,
#         "Arts and Design": 0, "TVL": 0, "Sports": 0
#     }

#     subject_to_strand = {
#         "Mathematics": "STEM", "Science": "STEM",
#         "English": "HUMSS", "Filipino": "HUMSS", "Social Studies": "HUMSS",
#         "Technology and Livelihood Education (TLE)": "TVL",
#         "Arts and Music": "Arts and Design",
#         "Physical Education and Sports": "Sports"
#     }

#     if answers.get("strongest-subject") in subject_to_strand:
#         strand_scores[subject_to_strand[answers["strongest-subject"]]] += 3

#     predicted_strand = max(strand_scores, key=strand_scores.get)
#     strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

#     return predicted_strand, strand_scores_list





@app.route('/predict', methods=['POST'])
def prediction_():
    """
    Predicts the SHS strand based on Junior High School student responses.
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request, no data received"}), 400

    if data.get("gradeLevel") != "jhs":
        return jsonify({"error": "Prediction is only available for Junior High School students"}), 400

    try:
        prediction_result = predict_shs_strand(data["answers"])
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

    return jsonify(prediction_result)

def predict_shs_strand(answers):
    strand_scores = {
        "STEM": 5, "ABM": 5, "HUMSS": 5, "GAS": 5, "Home Economics": 5, "ICT": 5,
        "Industrial Arts": 5, "Agri-Fishery Arts": 5, "Cookery": 5, "Performing Arts": 5,
        "Visual Arts": 5, "Media Arts": 5, "Literary Arts": 5, "Sports": 5
    }
    
    MAX_SCORE = 25

    mappings = {
        "best-subject": {
            "Mathematics": {"STEM": 10, "ABM": 5},
            "Science": {"STEM": 10, "HUMSS": 5},
            "English or Literature": {"HUMSS": 10, "Media Arts": 5, "Literary Arts": 5},
            "Business and Economics": {"ABM": 10, "HUMSS": 5},
            "Technology and Computer Science": {"STEM": 10, "ICT": 7},
            "Social Studies or Philosophy": {"HUMSS": 10, "GAS": 5},
            "Physical Education and Sports": {"Sports": 10, "GAS": 5}
        },
        "preferred-activity": {
            "Solving math problems and analyzing data": {"STEM": 10, "ABM": 5},
            "Conducting science experiments and research": {"STEM": 10, "HUMSS": 5},
            "Writing essays, stories, or public speaking": {"HUMSS": 10, "GAS": 5, "Literary Arts": 5},
            "Managing business, marketing, or finances": {"ABM": 10, "Home Economics": 5},
            "Working with technology, coding, or hands-on projects": {"STEM": 10, "ICT": 10, "Industrial Arts": 7},
            "Playing sports and engaging in physical activities": {"Sports": 10},
            "Helping others, teaching, or discussing social issues": {"HUMSS": 10, "GAS": 5},
            "Cooking, baking, or preparing food": {"Cookery": 10},
            "Working with plants, animals, or agricultural activities": {"Agri-Fishery Arts": 10}
        },
        "career-goal": {
            "Engineer, Scientist, or IT Professional": {"STEM": 10, "ICT": 5},
            "Doctor, Nurse, or Health Professional": {"STEM": 8, "HUMSS": 5},
            "Business Owner, Manager, or Accountant": {"ABM": 10, "Home Economics": 5},
            "Teacher, Psychologist, or Lawyer": {"HUMSS": 10, "GAS": 5},
            "Technician, Electrician, or Skilled Worker": {"Industrial Arts": 10, "STEM": 5},
            "Farmer, Fisherman, or Agricultural Worker": {"Agri-Fishery Arts": 10},
            "Chef, Baker, or Culinary Expert": {"Cookery": 10},
            "Artist, Designer, Filmmaker, or Musician": {"Performing Arts": 10, "Visual Arts": 10, "Media Arts": 5},
            "Athlete, Coach, or Sports Analyst": {"Sports": 10},
            "Media Professional (Journalist, Broadcaster, or Content Creator)": {"Media Arts": 10, "Literary Arts": 5}
        },
        "problem-solving": {
            "Using logic, numbers, and analysis": {"STEM": 10, "ABM": 5},
            "Experimenting and testing different solutions": {"STEM": 10, "ICT": 7, "Industrial Arts": 7},
            "Thinking creatively and coming up with unique ideas": {"HUMSS": 10, "GAS": 5, "Performing Arts": 5, "Visual Arts": 5},
            "Discussing and debating different viewpoints": {"HUMSS": 10, "ABM": 5},
            "Using hands-on skills and practical knowledge": {"Home Economics": 10, "ICT": 10, "Industrial Arts": 10, "Agri-Fishery Arts": 10},
            "Trying different artistic or design-based approaches": {"Visual Arts": 10, "Media Arts": 10},
            "Testing ideas in a business or entrepreneurial way": {"ABM": 10}
        }
    }

    def update_scores(mapping, answer):
        if not answer:
            return
        if isinstance(answer, list):
            answer = answer[0]
        if answer in mapping:
            for strand, score in mapping[answer].items():
                strand_scores[strand] += score

    for key, mapping in mappings.items():
        update_scores(mapping, answers.get(key))

    for strand in strand_scores:
        strand_scores[strand] = min(strand_scores[strand], MAX_SCORE)
    
    max_possible = max(strand_scores.values())
    if max_possible > 0:
        for strand in strand_scores:
            strand_scores[strand] = round((strand_scores[strand] / max_possible), 2)

    predicted_strand = max(strand_scores, key=strand_scores.get)
    strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

    return {
        "predicted_strand": predicted_strand,
        "prediction_scores": strand_scores_list
    }


# Define all 60 courses
SPECIFIC_COURSES = [
    "BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering",
    "BS Electronics Engineering", "BS Industrial Engineering", "BS Aerospace Engineering",
    "BS Nursing", "BS Medical Technology", "BS Pharmacy", "BS Radiologic Technology",
    "BS Physical Therapy", "Doctor of Medicine", "BS Midwifery", "BS Nutrition and Dietetics",
    "BS Computer Science", "BS Information Technology", "BS Software Engineering",
    "BS Data Science", "BS Game Development", "BS Cybersecurity", "BS Artificial Intelligence",
    "BS Business Administration", "BS Accountancy", "BS Marketing Management",
    "BS Financial Management", "BS Economics", "BS Entrepreneurship", "BS Human Resource Management",
    "BA Political Science", "BA Psychology", "BA Sociology", "BA Literature",
    "BA Philosophy", "BA Communication", "BA Creative Writing", "Bachelor of Laws (LLB)",
    "BS Criminology", "BS Legal Management", "BS Public Administration", "BA International Relations",
    "BA Political Science (Pre-Law)", "BS Elementary Education", "BS Secondary Education Major in Mathematics",
    "BS Secondary Education Major in Science", "BS Special Education", "BS Physical Education",
    "BS Early Childhood Education", "BS Biology", "BS Chemistry", "BS Physics",
    "BS Environmental Science", "BS Applied Mathematics", "BS Statistics", "BS Biochemistry",
    "BS Hotel & Restaurant Management", "BS Tourism Management", "BS Culinary Arts",
    "BS Travel Management", "BS Hospitality Management", "BS Cruise Line Operations",
    "BS Agriculture", "BS Forestry", "BS Environmental Management", "BS Fisheries",
    "BS Agricultural Engineering", "BS Agribusiness"
]

ANSWER_TO_COURSES = {
    # High grades subjects
    "Mathematics (Algebra, Calculus, Statistics)": [
        "BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering", 
        "BS Applied Mathematics", "BS Statistics", "BS Industrial Engineering"
    ],
    "Science (Biology, Chemistry, Physics)": [
        "BS Biology", "BS Chemistry", "BS Physics", "BS Environmental Science", "BS Biochemistry"
    ],
    "Information Technology (Programming, Computer Science)": [
        "BS Computer Science", "BS Information Technology", "BS Software Engineering", 
        "BS Data Science", "BS Cybersecurity", "BS Artificial Intelligence"
    ],
    "Business & Finance (Accounting, Economics, Marketing)": [
        "BS Business Administration", "BS Accountancy", "BS Marketing Management", 
        "BS Financial Management", "BS Economics", "BS Entrepreneurship"
    ],
    "Arts & Humanities (Literature, Communication, Creative Writing)": [
        "BA Literature", "BA Communication", "BA Creative Writing", "BA Philosophy"
    ],
    "Social Sciences (Psychology, Political Science, History, Sociology)": [
        "BA Psychology", "BA Sociology", "BA Political Science", "BS Public Administration", "BA International Relations"
    ],
    "Engineering & Technical subjects (Drafting, Robotics, Applied Sciences)": [
        "BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering", 
        "BS Industrial Engineering", "BS Electronics Engineering", "BS Aerospace Engineering"
    ],
    "Health & Medical subjects (Anatomy, Health Science, Nutrition)": [
        "BS Nursing", "BS Medical Technology", "BS Pharmacy", "BS Nutrition and Dietetics", 
        "BS Physical Therapy", "BS Radiologic Technology"
    ],
    "Hospitality & Tourism (Hotel Management, Travel)": [
        "BS Hotel & Restaurant Management", "BS Tourism Management", "BS Culinary Arts", 
        "BS Travel Management", "BS Hospitality Management", "BS Cruise Line Operations"
    ],
    "Education & Teaching": [
        "BS Elementary Education", "BS Secondary Education Major in Mathematics", 
        "BS Secondary Education Major in Science", "BS Special Education", "BS Physical Education"
    ],
    "Agriculture & Environmental Studies": [
        "BS Agriculture", "BS Forestry", "BS Environmental Management", "BS Fisheries", "BS Agricultural Engineering"
    ],

    # Favorite activities
    "Solving math and logic problems": [
        "BS Civil Engineering", "BS Applied Mathematics", "BS Statistics", "BS Data Science"
    ],
    "Experimenting in a science lab": [
        "BS Biology", "BS Chemistry", "BS Physics", "BS Biochemistry", "BS Environmental Science"
    ],
    "Coding, programming, or working with computers": [
        "BS Computer Science", "BS Information Technology", "BS Software Engineering", 
        "BS Cybersecurity", "BS Artificial Intelligence"
    ],
    "Managing money, business, or investments": [
        "BS Business Administration", "BS Accountancy", "BS Financial Management", "BS Economics"
    ],
    "Writing, storytelling, or public speaking": [
        "BA Communication", "BA Creative Writing", "BA Literature"
    ],
    "Designing, drawing, or creating things": [
        "BS Architecture", "BA Communication", "BS Industrial Design"
    ],
    "Analyzing data and statistics": [
        "BS Data Science", "BS Statistics", "BS Applied Mathematics", "BS Business Analytics"
    ],
    "Helping people through advice, teaching, or healthcare": [
        "BS Nursing", "BA Psychology", "BS Education", "BS Physical Therapy"
    ],
    "Exploring new places and interacting with different cultures": [
        "BS Tourism Management", "BS Travel Management", "BS Hospitality Management"
    ],

    # Career interests
    "Engineering (Civil, Mechanical, Electrical, etc.)": [
        "BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering", "BS Aerospace Engineering"
    ],
    "Medicine & Healthcare (Doctor, Nurse, Pharmacist, Medical Technologist)": [
        "BS Nursing", "BS Medical Technology", "Doctor of Medicine", "BS Pharmacy", "BS Physical Therapy"
    ],
    "Business & Management (Entrepreneur, Accountant, Marketing)": [
        "BS Business Administration", "BS Accountancy", "BS Marketing Management", "BS Economics", "BS Entrepreneurship"
    ],
    "IT & Technology (Software Developer, Data Scientist, Cybersecurity)": [
        "BS Computer Science", "BS Information Technology", "BS Software Engineering", "BS Cybersecurity", "BS Artificial Intelligence"
    ],
    "Law & Politics (Lawyer, Politician, Public Administrator)": [
        "Bachelor of Laws (LLB)", "BA Political Science", "BS Public Administration", "BA International Relations"
    ],
    "Arts & Media (Journalist, Filmmaker, Designer, Musician)": [
        "BA Communication", "BA Creative Writing", "BA Literature", "BS Industrial Design"
    ],
    "Social Sciences (Psychologist, Teacher, Human Resource Specialist)": [
        "BA Psychology", "BA Sociology", "BS Education", "BS Human Resource Management"
    ],
    "Science & Research (Biologist, Chemist, Environmental Scientist)": [
        "BS Biology", "BS Chemistry", "BS Environmental Science", "BS Fisheries"
    ],
    "Hospitality & Tourism (Hotel Manager, Travel Agent, Event Planner)": [
        "BS Hotel & Restaurant Management", "BS Tourism Management", "BS Travel Management"
    ],
    "Agriculture & Environmental Studies (Farmer, Ecologist, Environmental Planner)": [
        "BS Agriculture", "BS Forestry", "BS Environmental Management", "BS Agricultural Engineering"
    ],

    # College motivation
    "To follow my passion and interests": [
        "BA Communication", "BA Creative Writing", "BS Culinary Arts", "BS Industrial Design"
    ],
    "To have better job opportunities in the future": [
        "BS Computer Science", "BS Nursing", "BS Business Administration", "BS Civil Engineering"
    ],
    "Because my parents/guardians expect me to": [
        "Bachelor of Laws (LLB)", "BS Accountancy", "BS Medicine", "BS Engineering"
    ],  
    "To earn a high salary in the future": [
        "BS Computer Science", "BS Nursing", "BS Business Administration", "BS Civil Engineering", "BS Financial Management"
    ],

    # College course concerns
    "Difficulty of the course": [
        "BS Computer Science", "BS Accountancy", "BS Engineering"
    ],
    "Tuition fees and financial constraints": [
        "BS Public Administration", "BS Agribusiness", "BS Education"
    ],
    "Future job opportunities": [
        "BS Nursing", "BS Information Technology", "BS Civil Engineering", "BS Business Administration"
    ],
    "Family pressure to choose a specific course": [
        "BS Accountancy", "Bachelor of Laws (LLB)", "BS Medicine"
    ],
    "Uncertainty about my own interests and skills": [
        "BA Psychology", "BA Sociology", "BS General Studies"
    ]
}

def predict_college_course(answers):
    """Predicts the ideal college course based on user answers."""
    # Initialize course scores
    course_scores = {course: 0 for course in SPECIFIC_COURSES}

    # Helper function to update scores
    def update_scores(answer, weight):
        if answer in ANSWER_TO_COURSES:
            for course in ANSWER_TO_COURSES[answer]:
                if course in course_scores:
                    course_scores[course] += weight

    # Process answers
    for answer in answers.get("high-grades-subjects", []):
        update_scores(answer, 3)  # Higher weight for high grades

    for answer in answers.get("favorite-subjects", []):
        update_scores(answer, 2)  # Medium weight for favorite subjects

    for answer in answers.get("favorite-activities", []):
        update_scores(answer, 2)  # Medium weight for favorite activities

    for answer in answers.get("career-interests", []):
        update_scores(answer, 4)  # Highest weight for career interests

    motivation = answers.get("college-motivation")
    if motivation:
        update_scores(motivation, 3)  # Medium weight for motivation

    if answers.get("shs-course-relation") == "Yes, I want to continue in the same field.":
        for course in course_scores:
            course_scores[course] += 1  # Small bonus for continuity

    for concern in answers.get("college-course-concern", []):
        update_scores(concern, 1)  # Minimal weight for concerns

    # Normalize scores to a range of 0–25
    max_score = max(course_scores.values(), default=1)
    for course in course_scores:
        course_scores[course] = round((course_scores[course] / max_score) * 25, 2)

    # Get the top predicted course
    predicted_course = max(course_scores, key=course_scores.get)

    # Format scores for frontend
    prediction_scores = [{"strand": course, "score": score} for course, score in course_scores.items()]
    strand_scores_list = [{"strand": course, "score": score} for course, score in course_scores.items()]

    return predicted_course, prediction_scores, strand_scores_list

@app.route('/predict_college', methods=['POST'])
def prediction_college():
    """API endpoint for predicting college courses."""
    data = request.get_json()

    if not data or "answers" not in data:
        return jsonify({"error": "Invalid request, no data received"}), 400

    try:
        predicted_course, prediction_scores, strand_scores_list = predict_college_course(data["answers"])
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

    # Format response to match frontend expectations
    response = {
        "predicted_strand": predicted_course,
        "prediction_scores": prediction_scores,
        "strand_scores_list": strand_scores_list
    }
    return jsonify(response)
  
  
@app.route('/predict_exam_jhs', methods=['POST'])
def predict_exam_jhs():
    """Predict strand based on extracted scores from the frontend."""
    try:
        # Get the data sent from the frontend
        data = request.get_json()
        print("Received data:", data)  # Log the incoming data
        
        # Extract the scores from the request data, default to empty dict if not found
        scores = data.get("scores", {})
        print("Scores from frontend:", scores)  # Log the scores received from frontend
        
        # Extract numeric scores using the extract_numeric_score function
        math_score = extract_numeric_score(scores.get('Mathematics Section', '0'))
        science_score = extract_numeric_score(scores.get('Scientific Ability', '0'))
        verbal_score = extract_numeric_score(scores.get('Verbal_Ability', '0'))
        mechanical_score = extract_numeric_score(scores.get('Mechanical_and_Technical_Ability', '0'))
        entrepreneurial_score = extract_numeric_score(scores.get('Entrepreneurial_Skills', '0'))

        # Print extracted scores to debug
        print(f"Extracted Scores -> Math: {math_score}, Science: {science_score}, Verbal: {verbal_score}, Mechanical: {mechanical_score}, Entrepreneurial: {entrepreneurial_score}")

        # Initialize the dictionary to store strand percentages
        strand_percentages = {}

        # Define the maximum score per section
        max_section_score = 20  
        max_percentage = 25  # Maximum allowed percentage per strand

        # STEM strand condition (math and science contribute)
        strand_percentages['STEM'] = round(((math_score + science_score) / (2 * max_section_score)) * max_percentage, 2)
        
        # ABM strand condition (entrepreneurial contributes)
        strand_percentages['ABM'] = round((entrepreneurial_score / max_section_score) * max_percentage, 2)
        
        # HUMSS strand condition (verbal and mechanical contribute)
        strand_percentages['HUMSS'] = round(((verbal_score + mechanical_score) / (2 * max_section_score)) * max_percentage, 2)
        
        # GAS strand condition (math, science, and entrepreneurial contribute)
        strand_percentages['GAS'] = round(((math_score + science_score + entrepreneurial_score) / (3 * max_section_score)) * max_percentage, 2)
        
        # TVL detailed strands (mechanical contributes)
        strand_percentages['ICT'] = round((mechanical_score / max_section_score) * max_percentage, 2)
        strand_percentages['Home Economics'] = round((entrepreneurial_score / max_section_score) * max_percentage, 2)
        strand_percentages['Industrial Arts'] = round((mechanical_score / max_section_score) * max_percentage, 2)
        strand_percentages['Agri-Fishery Arts'] = round((science_score / max_section_score) * max_percentage, 2)

        # Log final results
        print(f"Final Calculated Strand Percentages: {strand_percentages}")

        # Return the result as a JSON response
        return jsonify({'strand_percentages': strand_percentages})

    except Exception as e:
        # Log any errors for debugging purposes
        print(f"Error in prediction: {e}")  # Log the error message
        return jsonify({'error': str(e)}), 500  # Return the error message in the response

def extract_numeric_score(score_string):
    """Extract numeric score from a string. If the string cannot be converted to a number, return 0."""
    try:
        match = re.match(r"(\d+(\.\d+)?)", score_string.strip())  # Allow decimal values
        if match:
            extracted_value = float(match.group(1))  # Convert to float
            print(f"Extracted numeric score from '{score_string}': {extracted_value}")  # Debug log
            return extracted_value
        else:
            print(f"Failed to extract numeric score from '{score_string}'")  # Debug log
            return 0
    except ValueError as e:
        print(f"ValueError: {e} while extracting from '{score_string}'")  # Debug log
        return 0


@app.route('/prediction_exam_shs', methods=['POST'])
def prediction_exam_shs():
    """Predict college course based on extracted scores from the frontend."""
    try:
        # Get the data sent from the frontend
        data = request.get_json()
        print("Received data:", data)  # Log the incoming data
        
        # Extract the scores from the request data, default to empty dict if not found
        scores = data.get("scores", {})
        print("Scores from frontend:", scores)  # Log the scores received from frontend
        
        # Extract numeric scores using the extract_numeric_score function
        math_score = extract_numeric_score(scores.get('Mathematics', '0'))
        science_score = extract_numeric_score(scores.get('Science', '0'))
        english_score = extract_numeric_score(scores.get('English Language Proficiency', '0'))
        engineering_score = extract_numeric_score(scores.get('Engineering & Technology', '0'))
        medicine_score = extract_numeric_score(scores.get('Medicine & Health Sciences', '0'))
        business_score = extract_numeric_score(scores.get('Business & Economics', '0'))
        it_score = extract_numeric_score(scores.get('Information Technology & Computer Science', '0'))

        # Print extracted scores to debug
        print(f"Extracted Scores -> Math: {math_score}, Science: {science_score}, English: {english_score}, Engineering: {engineering_score}, Medicine: {medicine_score}, Business: {business_score}, IT: {it_score}")

        # Initialize the dictionary to store course percentages
        course_percentages = {}

        # Define the maximum score per section
        max_section_score = 20  
        max_percentage = 25  # Maximum allowed percentage per course

        # Helper function to calculate percentage for a course
        def calculate_percentage(score1, score2, divisor=2):
            return round(((score1 + score2) / (divisor * max_section_score)) * max_percentage, 2)

        # Engineering Courses
        course_percentages['BS Civil Engineering'] = calculate_percentage(math_score, engineering_score)
        course_percentages['BS Mechanical Engineering'] = calculate_percentage(math_score, engineering_score)
        course_percentages['BS Electrical Engineering'] = calculate_percentage(math_score, engineering_score)
        course_percentages['BS Electronics Engineering'] = calculate_percentage(math_score, engineering_score)
        course_percentages['BS Industrial Engineering'] = calculate_percentage(math_score, engineering_score)
        course_percentages['BS Aerospace Engineering'] = calculate_percentage(math_score, engineering_score)

        # Health & Medical Courses
        course_percentages['BS Nursing'] = calculate_percentage(science_score, medicine_score)
        course_percentages['BS Medical Technology'] = calculate_percentage(science_score, medicine_score)
        course_percentages['BS Pharmacy'] = calculate_percentage(science_score, medicine_score)
        course_percentages['BS Radiologic Technology'] = calculate_percentage(science_score, medicine_score)
        course_percentages['BS Physical Therapy'] = calculate_percentage(science_score, medicine_score)
        course_percentages['Doctor of Medicine'] = calculate_percentage(science_score, medicine_score)
        course_percentages['BS Midwifery'] = calculate_percentage(science_score, medicine_score)
        course_percentages['BS Nutrition and Dietetics'] = calculate_percentage(science_score, medicine_score)

        # IT & Computer Science Courses
        course_percentages['BS Computer Science'] = calculate_percentage(math_score, it_score)
        course_percentages['BS Information Technology'] = calculate_percentage(math_score, it_score)
        course_percentages['BS Software Engineering'] = calculate_percentage(math_score, it_score)
        course_percentages['BS Data Science'] = calculate_percentage(math_score, it_score)
        course_percentages['BS Game Development'] = calculate_percentage(math_score, it_score)
        course_percentages['BS Cybersecurity'] = calculate_percentage(math_score, it_score)
        course_percentages['BS Artificial Intelligence'] = calculate_percentage(math_score, it_score)

        # Business & Economics Courses
        course_percentages['BS Business Administration'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Accountancy'] = calculate_percentage(business_score, math_score)
        course_percentages['BS Marketing Management'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Financial Management'] = calculate_percentage(business_score, math_score)
        course_percentages['BS Economics'] = calculate_percentage(business_score, math_score)
        course_percentages['BS Entrepreneurship'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Human Resource Management'] = calculate_percentage(business_score, english_score)

        # Social Sciences & Humanities Courses
        course_percentages['BA Political Science'] = calculate_percentage(english_score, business_score)
        course_percentages['BA Psychology'] = calculate_percentage(english_score, science_score)
        course_percentages['BA Sociology'] = calculate_percentage(english_score, science_score)
        course_percentages['BA Literature'] = round((english_score / max_section_score) * max_percentage, 2)
        course_percentages['BA Philosophy'] = round((english_score / max_section_score) * max_percentage, 2)
        course_percentages['BA Communication'] = round((english_score / max_section_score) * max_percentage, 2)
        course_percentages['BA Creative Writing'] = round((english_score / max_section_score) * max_percentage, 2)

        # Law & Public Administration Courses
        course_percentages['Bachelor of Laws (LLB)'] = calculate_percentage(english_score, business_score)
        course_percentages['BS Criminology'] = calculate_percentage(english_score, science_score)
        course_percentages['BS Legal Management'] = calculate_percentage(english_score, business_score)
        course_percentages['BS Public Administration'] = calculate_percentage(english_score, business_score)
        course_percentages['BA International Relations'] = calculate_percentage(english_score, business_score)
        course_percentages['BA Political Science (Pre-Law)'] = calculate_percentage(english_score, business_score)

        # Education Courses
        course_percentages['BS Elementary Education'] = calculate_percentage(english_score, science_score)
        course_percentages['BS Secondary Education Major in Mathematics'] = calculate_percentage(math_score, english_score)
        course_percentages['BS Secondary Education Major in Science'] = calculate_percentage(science_score, english_score)
        course_percentages['BS Special Education'] = calculate_percentage(english_score, science_score)
        course_percentages['BS Physical Education'] = calculate_percentage(english_score, science_score)
        course_percentages['BS Early Childhood Education'] = calculate_percentage(english_score, science_score)

        # Science & Research Courses
        course_percentages['BS Biology'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Chemistry'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Physics'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Environmental Science'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Applied Mathematics'] = round((math_score / max_section_score) * max_percentage, 2)
        course_percentages['BS Statistics'] = round((math_score / max_section_score) * max_percentage, 2)
        course_percentages['BS Biochemistry'] = calculate_percentage(science_score, math_score)

        # Hospitality & Tourism Courses
        course_percentages['BS Hotel & Restaurant Management'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Tourism Management'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Culinary Arts'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Travel Management'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Hospitality Management'] = calculate_percentage(business_score, english_score)
        course_percentages['BS Cruise Line Operations'] = calculate_percentage(business_score, english_score)

        # Agriculture & Environmental Courses
        course_percentages['BS Agriculture'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Forestry'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Environmental Management'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Fisheries'] = calculate_percentage(science_score, math_score)
        course_percentages['BS Agricultural Engineering'] = calculate_percentage(science_score, engineering_score)
        course_percentages['BS Agribusiness'] = calculate_percentage(business_score, science_score)

        # Log final results
        print(f"Final Calculated Course Percentages: {course_percentages}")

        # Return the result as a JSON response
        return jsonify({'course_percentages': course_percentages})

    except Exception as e:
        # Log any errors for debugging purposes
        print(f"Error in prediction: {e}")  # Log the error message
        return jsonify({'error': str(e)}), 500  # Return the error message in the response
    
    # FOR COLLEDGE PREDICT CARRER----------------------------------------------------------------------------------------------
    
    # Expanded career predictions mapped to 60+ courses
# Expanded career predictions mapped to 60+ courses
CAREER_PREDICTIONS = {
    "BS Civil Engineering": [
        "Structural Engineer", "Project Manager", "Construction Engineer", "Urban Planner"
    ],
    "BS Mechanical Engineering": [
        "Mechanical Engineer", "Automotive Engineer", "Robotics Engineer"
    ],
    "BS Electrical Engineering": [
        "Electrical Engineer", "Power Systems Engineer", "Telecommunications Engineer", "Embedded Systems Developer"
    ],
    "BS Electronics Engineering": [
        "Electronics Engineer", "Hardware Engineer", "Robotics Engineer"
    ],
    "BS Industrial Engineering": [
        "Process Engineer", "Operations Manager", "Supply Chain Analyst"
    ],
    "BS Aerospace Engineering": [
        "Aerospace Engineer", "Aircraft Designer", "Spacecraft Systems Engineer", "Propulsion Engineer"
    ],
    "BS Nursing": [
        "Registered Nurse", "Health Administrator", "Critical Care Nurse"
    ],
    "BS Medical Technology": [
        "Medical Technologist", "Clinical Analyst", "Pathology Specialist", "Research Scientist"
    ],
    "BS Pharmacy": [
        "Pharmacist", "Clinical Researcher", "Hospital Pharmacist"
    ],
    "BS Radiologic Technology": [
        "Radiologic Technologist", "MRI Technician", "Ultrasound Technician"
    ],
    "BS Physical Therapy": [
        "Physical Therapist", "Rehabilitation Specialist", "Sports Therapist", "Occupational Health Specialist"
    ],
    "Doctor of Medicine": [
        "Medical Doctor", "Surgeon", "Pediatrician"
    ],
    "BS Midwifery": [
        "Midwife", "Maternal Health Specialist", "Neonatal Nurse"
    ],
    "BS Nutrition and Dietetics": [
        "Dietitian", "Nutritionist", "Health Coach"
    ],
    "BS Computer Science": [
        "Software Developer", "Data Scientist", "Cybersecurity Analyst", "AI Specialist"
    ],
    "BS Information Technology": [
        "IT Specialist", "System Administrator", "Network Engineer"
    ],
    "BS Software Engineering": [
        "Software Engineer", "Mobile App Developer", "Game Developer"
    ],
    "BS Data Science": [
        "Data Scientist", "Machine Learning Engineer", "Big Data Specialist"
    ],
    "BS Game Development": [
        "Game Developer", "Game Designer", "VR/AR Developer"
    ],
    "BS Cybersecurity": [
        "Cybersecurity Analyst", "Ethical Hacker", "Security Engineer", "Cryptographer"
    ],
    "BS Artificial Intelligence": [
        "AI Engineer", "Machine Learning Specialist", "Robotics Engineer"
    ],
    "BS Business Administration": [
        "Business Consultant", "Operations Manager", "Marketing Manager"
    ],
    "BS Accountancy": [
        "Accountant", "Auditor", "Tax Consultant", "Chief Financial Officer (CFO)"
    ],
    "BS Marketing Management": [
        "Marketing Specialist", "Brand Manager", "Digital Marketing Manager"
    ],
    "BS Financial Management": [
        "Financial Analyst", "Investment Banker", "Risk Manager"
    ],
    "BS Economics": [
        "Economist", "Financial Analyst", "Market Researcher"
    ],
    "BS Entrepreneurship": [
        "Startup Founder", "Business Owner", "Venture Capitalist"
    ],
    "BS Human Resource Management": [
        "HR Manager", "Talent Acquisition Specialist", "Training and Development Manager"
    ],
    "BA Political Science": [
        "Policy Analyst", "Government Officer", "Diplomat", "Political Consultant"
    ],
    "BA Psychology": [
        "Psychologist", "Counselor", "Human Resource Specialist"
    ],
    "BA Sociology": [
        "Sociologist", "Community Development Officer", "Social Researcher"
    ],
    "BA Literature": [
        "Writer", "Editor", "Literary Critic"
    ],
    "BA Philosophy": [
        "Philosopher", "Ethicist", "Academic Researcher"
    ],
    "BA Communication": [
        "Journalist", "Public Relations Specialist", "Media Producer"
    ],
    "BA Creative Writing": [
        "Author", "Screenwriter", "Poet"
    ],
    "Bachelor of Laws (LLB)": [
        "Lawyer", "Judge", "Corporate Lawyer"
    ],
    "BS Criminology": [
        "Criminologist", "Police Officer", "Forensic Analyst"
    ],
    "BS Legal Management": [
        "Legal Consultant", "Corporate Legal Advisor", "Compliance Officer"
    ],
    "BS Public Administration": [
        "Government Administrator", "Policy Analyst", "Community Development Officer"
    ],
    "BA International Relations": [
        "Diplomat", "International Policy Analyst", "Foreign Service Officer"
    ],
    "BA Political Science (Pre-Law)": [
        "Legal Researcher", "Government Policy Analyst", "Lobbyist"
    ],
    "BS Elementary Education": [
        "Elementary Teacher", "Curriculum Developer", "Education Consultant", "School Administrator"
    ],
    "BS Secondary Education Major in Mathematics": [
        "Math Teacher", "Education Researcher", "Instructional Designer"
    ],
    "BS Secondary Education Major in Science": [
        "Science Teacher", "Lab Instructor", "STEM Curriculum Specialist"
    ],
    "BS Special Education": [
        "Special Education Teacher", "Therapeutic Instructor", "Inclusion Specialist"
    ],
    "BS Physical Education": [
        "PE Teacher", "Sports Coach", "Fitness Trainer"
    ],
    "BS Early Childhood Education": [
        "Preschool Teacher", "Child Development Specialist", "Montessori Educator"
    ],
    "BS Biology": [
        "Biologist", "Biomedical Researcher", "Wildlife Biologist"
    ],
    "BS Chemistry": [
        "Chemist", "Pharmaceutical Scientist", "Forensic Scientist"
    ],
    "BS Physics": [
        "Physicist", "Medical Physicist", "Astrophysicist"
    ],
    "BS Environmental Science": [
        "Environmental Consultant", "Sustainability Officer", "Climate Change Analyst"
    ],
    "BS Applied Mathematics": [
        "Mathematician", "Operations Research Analyst", "Quantitative Analyst"
    ],
    "BS Statistics": [
        "Statistician", "Data Analyst", "Survey Methodologist"
    ],
    "BS Biochemistry": [
        "Biochemist", "Pharmaceutical Researcher", "Geneticist"
    ],
    "BS Hotel & Restaurant Management": [
        "Hotel Manager", "Event Coordinator", "Food and Beverage Manager"
    ],
    "BS Tourism Management": [
        "Tourism Officer", "Travel Consultant", "Event Planner", "Cultural Tourism Specialist"
    ],
    "BS Culinary Arts": [
        "Chef", "Food & Beverage Manager", "Culinary Consultant"
    ],
    "BS Agriculture": [
        "Agricultural Scientist", "Farm Manager", "Agribusiness Consultant"
    ]
}

@app.route('/api/predict-career', methods=['POST'])
def predict_career():
    data = request.json
    course = data.get("course")

    careers = CAREER_PREDICTIONS.get(course, ["Career data unavailable"])

    return jsonify({"careers": careers})
  
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/college-grade', methods=['POST'])
def college_grade():
    """
    Handles image upload and extracts subjects & grades for college students.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    extracted_data = extract_subjects_and_grades(file_path)

    return jsonify(extracted_data)
  


UPLOAD_FOLDER = "certificate_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

career_mapping = {
    "computer": {
        "careers": [
            "Software Engineer", "Data Scientist", "Cybersecurity Analyst", "AI Specialist", 
            "Game Developer", "Network Engineer", "IT Specialist", "Mobile App Developer", 
            "System Administrator", "Big Data Specialist", "Machine Learning Engineer"
        ],
        "keywords": [
            "programming", "coding", "Python", "Java", "C++", "web development", "cloud computing", 
            "database management", "software development", "data analysis", "machine learning", 
            "artificial intelligence", "game programming", "blockchain", "IT security", "ethical hacking"
        ]
    },

    "business administration": {
        "careers": [
            "Marketing Manager", "Financial Analyst", "HR Specialist", "Operations Manager", 
            "Business Consultant", "Brand Manager", "Digital Marketing Manager", "Venture Capitalist"
        ],
        "keywords": [
            "marketing", "business strategy", "corporate finance", "advertising", "SEO", "e-commerce", 
            "supply chain", "leadership", "entrepreneurship", "human resources", "business analytics", 
            "customer relations", "brand management", "management consulting"
        ]
    },

    "mechanical engineering": {
        "careers": [
            "Mechanical Engineer", "Automotive Engineer", "Robotics Engineer", "Manufacturing Engineer"
        ],
        "keywords": [
            "mechanics", "thermodynamics", "CAD", "solid mechanics", "fluid dynamics", "automotive design", 
            "robotics", "manufacturing", "aerospace technology", "mechanical automation"
        ]
    },

    "nursing": {
        "careers": [
            "Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Critical Care Nurse"
        ],
        "keywords": [
            "first aid", "medical assistance", "patient care", "emergency response", "anatomy", "nursing procedures", 
            "clinical practice", "hospice care", "mental health nursing", "community health", "nursing"
        ]
    },

    "engineering": {
        "careers": [
            "Structural Engineer", "Aerospace Engineer", "Construction Engineer", "Power Systems Engineer", 
            "Telecommunications Engineer", "Process Engineer", "Embedded Systems Developer", "Electronics Engineer", 
            "Hardware Engineer", "Propulsion Engineer", "Aircraft Designer", "Spacecraft Systems Engineer"
        ],
        "keywords": [
            "civil engineering", "electrical systems", "infrastructure", "transportation", "renewable energy", 
            "robotics", "aerodynamics", "mechanical systems", "satellite technology", "bridge construction"
        ]
    },

    "medical": {
        "careers": [
            "Medical Doctor", "Surgeon", "Pediatrician", "Medical Technologist", "Clinical Analyst", 
            "Pathology Specialist", "Radiologic Technologist", "MRI Technician", "Ultrasound Technician", 
            "Rehabilitation Specialist", "Sports Therapist", "Occupational Health Specialist", 
            "Dietitian", "Nutritionist", "Health Coach", "Pharmacist", "Clinical Researcher", "Hospital Pharmacist",
        ],
        "keywords": [
            "healthcare", "medicine", "radiology", "anatomy", "pharmacology", "public health", 
            "physical therapy", "patient diagnostics", "clinical research", "surgery", "genetics"
        ]
    },

    "law": {
        "careers": [
            "Lawyer", "Judge", "Corporate Lawyer", "Legal Consultant", "Compliance Officer", 
            "Government Policy Analyst", "Lobbyist", "Legal Researcher", "Corporate Legal Advisor"
        ],
        "keywords": [
            "law", "jurisprudence", "legal studies", "court proceedings", "corporate law", 
            "criminal justice", "international law", "intellectual property", "business law", "ethics"
        ]
    },

    "education": {
        "careers": [
            "Elementary Teacher", "Curriculum Developer", "Education Consultant", "School Administrator", 
            "Math Teacher", "Science Teacher", "Lab Instructor", "STEM Curriculum Specialist", 
            "Special Education Teacher", "Therapeutic Instructor", "Inclusion Specialist", 
            "PE Teacher", "Sports Coach", "Fitness Trainer", "Preschool Teacher", "Child Development Specialist", 
            "Montessori Educator", "Instructional Designer"
        ],
        "keywords": [
            "teaching", "curriculum development", "early childhood education", "inclusive education", 
            "special education", "STEM education", "pedagogy", "instructional design", "education"
        ]
    },

    "science": {
        "careers": [
            "Biologist", "Biomedical Researcher", "Wildlife Biologist", "Chemist", "Pharmaceutical Scientist", 
            "Forensic Scientist", "Physicist", "Medical Physicist", "Astrophysicist", "Environmental Consultant", 
            "Sustainability Officer", "Climate Change Analyst", "Operations Research Analyst", "Quantitative Analyst", 
            "Statistician", "Survey Methodologist", "Geneticist"
        ],
        "keywords": [
            "biology", "physics", "chemistry", "biotechnology", "astronomy", "genetics", 
            "sustainability", "climate change", "forensic science", "data science"
        ]
    },

    "finance": {
        "careers": [
            "Accountant", "Auditor", "Tax Consultant", "Chief Financial Officer (CFO)", "Investment Banker", 
            "Risk Manager", "Economist", "Market Researcher"
        ],
        "keywords": [
            "accounting", "taxation", "auditing", "investment", "corporate finance", 
            "stock market", "financial modeling", "risk analysis"
        ]
    },

    "political": {
        "careers": [
            "Policy Analyst", "Government Officer", "Diplomat", "Lobbyist", "International Policy Analyst", 
            "Foreign Service Officer", "Community Development Officer"
        ],
        "keywords": [
            "public administration", "politics", "government policies", "international relations", 
            "diplomacy", "foreign affairs", "public service"
        ]
    },

    "media": {
        "careers": [
            "Journalist", "Public Relations Specialist", "Media Producer", "Author", "Screenwriter", 
            "Poet", "Literary Critic"
        ],
        "keywords": [
            "journalism", "mass communication", "public relations", "content writing", "film production", 
            "digital media", "creative writing", "scriptwriting"
        ]
    },

    "criminology": {
        "careers": [
            "Criminologist", "Police Officer", "Forensic Analyst"
        ],
        "keywords": [
            "criminal justice", "law enforcement", "forensic science", "investigation techniques", 
            "crime scene analysis", "public safety"
        ]
    },

    "hospitality": {
        "careers": [
            "Hotel Manager", "Event Coordinator", "Food and Beverage Manager", "Tourism Officer", 
            "Travel Consultant", "Event Planner", "Cultural Tourism Specialist", "Chef", 
            "Culinary Consultant", "Agribusiness Consultant"
        ],
        "keywords": [
            "hospitality", "tourism", "event planning", "hotel management", "food service", 
            "travel industry", "customer service"
        ]
    },

    "agriculture": {
        "careers": [
            "Agricultural Scientist", "Farm Manager", "Agribusiness Consultant", "Environmental Manager", 
            "Forestry Specialist", "Fisheries Specialist"
        ],
        "keywords": [
            "agriculture", "farming", "agribusiness", "sustainability", "environmental science", 
            "crop management", "forestry", "fisheries", "natural resource management"
        ]
    }
}
@app.route("/predict-career-cert", methods=["POST"])
def predict_career_from_certificate():
    """Handles multiple file uploads and predicts careers with scoring based on extracted text."""
    print("📥 Received request at /predict-career-cert")

    if "certificates" not in request.files:
        print("❌ No certificates found in request")
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("certificates")  # Get multiple files
    if not files:
        print("❌ No selected files")
        return jsonify({"error": "No selected files"}), 400

    career_scores = {}  # Dictionary to store scores for each career
    unmatched_keywords = set()  # Store keywords that were not found in the extracted text

    for file in files:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        print(f"✅ File saved at {filepath}")

        extracted_text = extract_text_from_certificate(filepath).lower().strip()
        if not extracted_text:
            print(f"⚠️ No readable text found in {filename}")
            continue  # Skip empty files

        print(f"🔍 Extracted Text from {filename}: {extracted_text}")

        match_found = False  # Track if at least one match is found

        # Loop through each career category
        for category, data in career_mapping.items():
            keywords = data.get("keywords", [])
            careers = data.get("careers", [])

            for keyword in keywords:
                keyword_pattern = r"\b" + re.escape(keyword.lower()) + r"\b"
                if re.search(keyword_pattern, extracted_text, re.IGNORECASE):
                    match_found = True  # A match is found
                    for career in careers:
                        career_scores[career] = career_scores.get(career, 0) + 5
                        career_scores[career] = min(career_scores[career], 25)  # Cap at 25
                else:
                    unmatched_keywords.add(keyword)  # Store unmatched keywords

    # Convert to sorted list [{career: "Career Name", score: Score}, ...]
    sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
    formatted_output = [{"career": career, "score": score} for career, score in sorted_careers]

    if not formatted_output:  # If no careers were matched
        print(f"📌 No career matches found. Unmatched keywords: {list(unmatched_keywords)}")
        return jsonify({
            "careers": [{"career": "No specific career matched.", "score": 0}],
            "unmatched_keywords": list(unmatched_keywords)
        })

    print(f"📌 Predicted Careers: {formatted_output}")
    return jsonify({"careers": formatted_output})
  
  
  # COLLEDGE PERSONAL QUESTIONS------------------------------------------------------------------------------------------------------


def predict_career_from_questionnaire(responses):
    question_mapping = {
        "Do you enjoy working with computers and technology?": {
            "Yes": {
                "Software Engineer": 5,
                "Data Scientist": 5,
                "Cybersecurity Analyst": 4,
                "AI Specialist": 4,
                "Game Developer": 3,
                "Network Engineer": 3,
                "IT Specialist": 3,
                "Mobile App Developer": 3,
                "System Administrator": 3,
                "Big Data Specialist": 3,
                "Machine Learning Engineer": 4
            },
            "No": {}
        },
        "Are you interested in managing businesses or finances?": {
            "Yes": {
                "Marketing Manager": 5,
                "Financial Analyst": 5,
                "HR Specialist": 4,
                "Operations Manager": 4,
                "Business Consultant": 4,
                "Brand Manager": 3,
                "Digital Marketing Manager": 3,
                "Venture Capitalist": 3
            },
            "No": {}
        },
        "Do you like helping people with medical needs?": {
            "Yes": {
                "Registered Nurse": 5,
                "Medical Assistant": 4,
                "Healthcare Administrator": 4,
                "Critical Care Nurse": 4,
                "Medical Doctor": 5,
                "Surgeon": 5,
                "Pediatrician": 4,
                "Medical Technologist": 3,
                "Clinical Analyst": 3,
                "Pathology Specialist": 3,
                "Radiologic Technologist": 3,
                "MRI Technician": 3,
                "Ultrasound Technician": 3,
                "Rehabilitation Specialist": 3,
                "Sports Therapist": 3,
                "Occupational Health Specialist": 3,
                "Dietitian": 3,
                "Nutritionist": 3,
                "Health Coach": 3,
                "Pharmacist": 4,
                "Clinical Researcher": 4,
                "Hospital Pharmacist": 4
            },
            "No": {}
        },
        "Are you passionate about teaching and education?": {
            "Yes": {
                "Elementary Teacher": 5,
                "Curriculum Developer": 4,
                "Education Consultant": 4,
                "School Administrator": 4,
                "Math Teacher": 4,
                "Science Teacher": 4,
                "Lab Instructor": 3,
                "STEM Curriculum Specialist": 3,
                "Special Education Teacher": 3,
                "Therapeutic Instructor": 3,
                "Inclusion Specialist": 3,
                "PE Teacher": 3,
                "Sports Coach": 3,
                "Fitness Trainer": 3,
                "Preschool Teacher": 3,
                "Child Development Specialist": 3,
                "Montessori Educator": 3,
                "Instructional Designer": 3
            },
            "No": {}
        },
        "Do you enjoy designing and building things?": {
            "Yes": {
                "Mechanical Engineer": 5,
                "Automotive Engineer": 4,
                "Robotics Engineer": 4,
                "Manufacturing Engineer": 4,
                "Structural Engineer": 4,
                "Aerospace Engineer": 4,
                "Construction Engineer": 4,
                "Power Systems Engineer": 3,
                "Telecommunications Engineer": 3,
                "Process Engineer": 3,
                "Embedded Systems Developer": 3,
                "Electronics Engineer": 3,
                "Hardware Engineer": 3,
                "Propulsion Engineer": 3,
                "Aircraft Designer": 3,
                "Spacecraft Systems Engineer": 3
            },
            "No": {}
        },
        "Are you interested in law and justice?": {
            "Yes": {
                "Lawyer": 5,
                "Judge": 4,
                "Corporate Lawyer": 4,
                "Legal Consultant": 4,
                "Compliance Officer": 3,
                "Government Policy Analyst": 3,
                "Lobbyist": 3,
                "Legal Researcher": 3,
                "Corporate Legal Advisor": 3
            },
            "No": {}
        },
        "Do you like working with numbers, investments, or economics?": {
            "Yes": {
                "Accountant": 5,
                "Auditor": 4,
                "Tax Consultant": 4,
                "Chief Financial Officer (CFO)": 4,
                "Investment Banker": 4,
                "Risk Manager": 3,
                "Economist": 3,
                "Market Researcher": 3
            },
            "No": {}
        },
        "Are you interested in journalism, writing, or public relations?": {
            "Yes": {
                "Journalist": 5,
                "Public Relations Specialist": 4,
                "Media Producer": 4,
                "Author": 3,
                "Screenwriter": 3,
                "Poet": 3,
                "Literary Critic": 3
            },
            "No": {}
        },
        "Do you enjoy working with plants, animals, or environmental sustainability?": {
            "Yes": {
                "Agricultural Scientist": 5,
                "Farm Manager": 4,
                "Agribusiness Consultant": 4,
                "Environmental Manager": 4,
                "Forestry Specialist": 3,
                "Fisheries Specialist": 3
            },
            "No": {}
        },
        "Do you prefer working in a hands-on, practical environment rather than theoretical work?": {
            "Yes": {
                "Mechanical Engineer": 5,
                "Automotive Engineer": 4,
                "Robotics Engineer": 4,
                "Manufacturing Engineer": 4,
                "Construction Engineer": 4,
                "Process Engineer": 3,
                "Embedded Systems Developer": 3,
                "Electronics Engineer": 3,
                "Hardware Engineer": 3
            },
            "No": {}
        },
        "Are you interested in scientific research and discovery?": {
            "Yes": {
                "Biologist": 5,
                "Biomedical Researcher": 4,
                "Wildlife Biologist": 4,
                "Chemist": 4,
                "Pharmaceutical Scientist": 4,
                "Forensic Scientist": 3,
                "Physicist": 3,
                "Medical Physicist": 3,
                "Astrophysicist": 3,
                "Environmental Consultant": 3,
                "Sustainability Officer": 3,
                "Climate Change Analyst": 3,
                "Operations Research Analyst": 3,
                "Quantitative Analyst": 3,
                "Statistician": 3,
                "Survey Methodologist": 3,
                "Geneticist": 3
            },
            "No": {}
        },
        "Do you enjoy creative activities like writing, art, or design?": {
            "Yes": {
                "Journalist": 5,
                "Public Relations Specialist": 4,
                "Media Producer": 4,
                "Author": 3,
                "Screenwriter": 3,
                "Poet": 3,
                "Literary Critic": 3
            },
            "No": {}
        },
        "Are you interested in politics or public service?": {
            "Yes": {
                "Policy Analyst": 5,
                "Government Officer": 4,
                "Diplomat": 4,
                "Lobbyist": 3,
                "International Policy Analyst": 3,
                "Foreign Service Officer": 3,
                "Community Development Officer": 3
            },
            "No": {}
        },
        "Do you enjoy working in hospitality or tourism?": {
            "Yes": {
                "Hotel Manager": 5,
                "Event Coordinator": 4,
                "Food and Beverage Manager": 4,
                "Tourism Officer": 4,
                "Travel Consultant": 3,
                "Event Planner": 3,
                "Cultural Tourism Specialist": 3,
                "Chef": 3,
                "Culinary Consultant": 3,
                "Agribusiness Consultant": 3
            },
            "No": {}
        },
        "Are you interested in solving crimes or working in law enforcement?": {
            "Yes": {
                "Criminologist": 5,
                "Police Officer": 4,
                "Forensic Analyst": 4
            },
            "No": {}
        }
    }

    
    career_scores = {field: 0 for field in {career for options in question_mapping.values() for career in options.get("Yes", {})}}
    
    for question, answer in responses.items():
        if question in question_mapping and answer in question_mapping[question]:
            for career, score in question_mapping[question][answer].items():
                career_scores[career] += score
    
    # Normalize scores to a max of 25
    max_score = max(career_scores.values(), default=1)
    for career in career_scores:
        career_scores[career] = round((career_scores[career] / max_score) * 25, 2)
    
    sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
    
    if sorted_careers[0][1] == 0:
        return {"message": "No clear career match found. Consider exploring various fields."}
    
    top_careers = [{"career": career[0], "score": career[1]} for career in sorted_careers if career[1] > 0]
    return top_careers  # Return top careers with scores

@app.route('/predict-career-pq', methods=['POST'])
def predict_career_pq():
    try:
        data = request.get_json()
        responses = data.get("responses", {})

        if not isinstance(responses, dict):
            return jsonify({"error": "Invalid data format. 'responses' must be a dictionary."}), 400

        predicted_careers = predict_career_from_questionnaire(responses)

        return jsonify({"predicted_careers": predicted_careers})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # COLLEGE EXAM--------------------------------------------------------------------------------------------------------------------
      
      
      # Career mapping dictionary
career_mapping = {
    "computer": {
        "careers": [
            "Software Engineer", "Data Scientist", "Cybersecurity Analyst", "AI Specialist", 
            "Game Developer", "Network Engineer", "IT Specialist", "Mobile App Developer", 
            "System Administrator", "Big Data Specialist", "Machine Learning Engineer"
        ],
        "keywords": [
            "programming", "coding", "Python", "Java", "C++", "web development", "cloud computing", 
            "database management", "software development", "data analysis", "machine learning", 
            "artificial intelligence", "game programming", "blockchain", "IT security", "ethical hacking"
        ]
    },
    "business administration": {
        "careers": [
            "Marketing Manager", "Financial Analyst", "HR Specialist", "Operations Manager", 
            "Business Consultant", "Brand Manager", "Digital Marketing Manager", "Venture Capitalist"
        ],
        "keywords": [
            "marketing", "business strategy", "corporate finance", "advertising", "SEO", "e-commerce", 
            "supply chain", "leadership", "entrepreneurship", "human resources", "business analytics", 
            "customer relations", "brand management", "management consulting"
        ]
    },
    "mechanical engineering": {
        "careers": [
            "Mechanical Engineer", "Automotive Engineer", "Robotics Engineer", "Manufacturing Engineer"
        ],
        "keywords": [
            "mechanics", "thermodynamics", "CAD", "solid mechanics", "fluid dynamics", "automotive design", 
            "robotics", "manufacturing", "aerospace technology", "mechanical automation"
        ]
    },
    "nursing": {
        "careers": [
            "Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Critical Care Nurse"
        ],
        "keywords": [
            "first aid", "medical assistance", "patient care", "emergency response", "anatomy", "nursing procedures", 
            "clinical practice", "hospice care", "mental health nursing", "community health", "nursing"
        ]
    },
    "engineering": {
        "careers": [
            "Structural Engineer", "Aerospace Engineer", "Construction Engineer", "Power Systems Engineer", 
            "Telecommunications Engineer", "Process Engineer", "Embedded Systems Developer", "Electronics Engineer", 
            "Hardware Engineer", "Propulsion Engineer", "Aircraft Designer", "Spacecraft Systems Engineer"
        ],
        "keywords": [
            "civil engineering", "electrical systems", "infrastructure", "transportation", "renewable energy", 
            "robotics", "aerodynamics", "mechanical systems", "satellite technology", "bridge construction"
        ]
    },
    "medical": {
        "careers": [
            "Medical Doctor", "Surgeon", "Pediatrician", "Medical Technologist", "Clinical Analyst", 
            "Pathology Specialist", "Radiologic Technologist", "MRI Technician", "Ultrasound Technician", 
            "Rehabilitation Specialist", "Sports Therapist", "Occupational Health Specialist", 
            "Dietitian", "Nutritionist", "Health Coach", "Pharmacist", "Clinical Researcher", "Hospital Pharmacist",
        ],
        "keywords": [
            "healthcare", "medicine", "radiology", "anatomy", "pharmacology", "public health", 
            "physical therapy", "patient diagnostics", "clinical research", "surgery", "genetics"
        ]
    },
    "law": {
        "careers": [
            "Lawyer", "Judge", "Corporate Lawyer", "Legal Consultant", "Compliance Officer", 
            "Government Policy Analyst", "Lobbyist", "Legal Researcher", "Corporate Legal Advisor"
        ],
        "keywords": [
            "law", "jurisprudence", "legal studies", "court proceedings", "corporate law", 
            "criminal justice", "international law", "intellectual property", "business law", "ethics"
        ]
    },
    "education": {
        "careers": [
            "Elementary Teacher", "Curriculum Developer", "Education Consultant", "School Administrator", 
            "Math Teacher", "Science Teacher", "Lab Instructor", "STEM Curriculum Specialist", 
            "Special Education Teacher", "Therapeutic Instructor", "Inclusion Specialist", 
            "PE Teacher", "Sports Coach", "Fitness Trainer", "Preschool Teacher", "Child Development Specialist", 
            "Montessori Educator", "Instructional Designer"
        ],
        "keywords": [
            "teaching", "curriculum development", "early childhood education", "inclusive education", 
            "special education", "STEM education", "pedagogy", "instructional design", "education"
        ]
    },
    "science": {
        "careers": [
            "Biologist", "Biomedical Researcher", "Wildlife Biologist", "Chemist", "Pharmaceutical Scientist", 
            "Forensic Scientist", "Physicist", "Medical Physicist", "Astrophysicist", "Environmental Consultant", 
            "Sustainability Officer", "Climate Change Analyst", "Operations Research Analyst", "Quantitative Analyst", 
            "Statistician", "Survey Methodologist", "Geneticist"
        ],
        "keywords": [
            "biology", "physics", "chemistry", "biotechnology", "astronomy", "genetics", 
            "sustainability", "climate change", "forensic science", "data science"
        ]
    },
    "finance": {
        "careers": [
            "Accountant", "Auditor", "Tax Consultant", "Chief Financial Officer (CFO)", "Investment Banker", 
            "Risk Manager", "Economist", "Market Researcher"
        ],
        "keywords": [
            "accounting", "taxation", "auditing", "investment", "corporate finance", 
            "stock market", "financial modeling", "risk analysis"
        ]
    },
    "political": {
        "careers": [
            "Policy Analyst", "Government Officer", "Diplomat", "Lobbyist", "International Policy Analyst", 
            "Foreign Service Officer", "Community Development Officer"
        ],
        "keywords": [
            "public administration", "politics", "government policies", "international relations", 
            "diplomacy", "foreign affairs", "public service"
        ]
    },
    "media": {
        "careers": [
            "Journalist", "Public Relations Specialist", "Media Producer", "Author", "Screenwriter", 
            "Poet", "Literary Critic"
        ],
        "keywords": [
            "journalism", "mass communication", "public relations", "content writing", "film production", 
            "digital media", "creative writing", "scriptwriting"
        ]
    },
    "criminology": {
        "careers": [
            "Criminologist", "Police Officer", "Forensic Analyst"
        ],
        "keywords": [
            "criminal justice", "law enforcement", "forensic science", "investigation techniques", 
            "crime scene analysis", "public safety"
        ]
    },
    "hospitality": {
        "careers": [
            "Hotel Manager", "Event Coordinator", "Food and Beverage Manager", "Tourism Officer", 
            "Travel Consultant", "Event Planner", "Cultural Tourism Specialist", "Chef", 
            "Culinary Consultant", "Agribusiness Consultant"
        ],
        "keywords": [
            "hospitality", "tourism", "event planning", "hotel management", "food service", 
            "travel industry", "customer service"
        ]
    },
    "agriculture": {
        "careers": [
            "Agricultural Scientist", "Farm Manager", "Agribusiness Consultant", "Environmental Manager", 
            "Forestry Specialist", "Fisheries Specialist"
        ],
        "keywords": [
            "agriculture", "farming", "agribusiness", "sustainability", "environmental science", 
            "crop management", "forestry", "fisheries", "natural resource management"
        ]
    }
}
# Helper function to extract numeric scores
def extract_numeric_score(score_str):
    """Extract numeric score from a string (e.g., '5/20' -> 5)."""
    if isinstance(score_str, str) and '/' in score_str:
        return int(score_str.split('/')[0])
    return 0

@app.route('/prediction_exam_college', methods=['POST'])
def prediction_exam_college():
    """Predict careers based on extracted scores from the frontend."""
    try:
        # Get the data sent from the frontend
        data = request.get_json()
        print("Received data:", data)  # Log the incoming data

        # Extract the scores from the request data, default to empty dict if not found
        scores = data.get("scores", {})
        print("Scores from frontend:", scores)  # Log the scores received from frontend

        # Extract numeric scores using the extract_numeric_score function
        doctoral_score = extract_numeric_score(scores.get('DOCTORAL', '0'))
        it_score = extract_numeric_score(scores.get('IT', '0'))
        engineer_score = extract_numeric_score(scores.get('ENGINEER', '0'))
        business_score = extract_numeric_score(scores.get('BUSINESS', '0'))
        media_score = extract_numeric_score(scores.get('Media', '0'))
        education_score = extract_numeric_score(scores.get('Education', '0'))
        law_score = extract_numeric_score(scores.get('Law', '0'))
        science_score = extract_numeric_score(scores.get('Science', '0'))
        aviation_score = extract_numeric_score(scores.get('Aviation', '0'))
        sports_score = extract_numeric_score(scores.get('Sports', '0'))
        entertainment_score = extract_numeric_score(scores.get('Entertainment', '0'))
        skill_trade_score = extract_numeric_score(scores.get('Skill Trade', '0'))

        # Print extracted scores to debug
        print(f"Extracted Scores -> DOCTORAL: {doctoral_score}, IT: {it_score}, ENGINEER: {engineer_score}, BUSINESS: {business_score}, Media: {media_score}, Education: {education_score}, Law: {law_score}, Science: {science_score}, Aviation: {aviation_score}, Sports: {sports_score}, Entertainment: {entertainment_score}, Skill Trade: {skill_trade_score}")

        # Initialize the dictionary to store career percentages
        career_percentages = {}

        # Define the maximum score per section
        max_section_score = 20
        max_percentage = 25  # Maximum allowed percentage per career

        # Helper function to calculate percentage for a career
        def calculate_percentage(score1, score2=0, divisor=2):
            return round(((score1 + score2) / (divisor * max_section_score)) * max_percentage, 2)

        # Map exam subjects to career categories and calculate percentages
        # Computer Careers (IT)
        for career in career_mapping["computer"]["careers"]:
            career_percentages[career] = calculate_percentage(it_score, engineer_score)

        # Business Administration Careers (BUSINESS)
        for career in career_mapping["business administration"]["careers"]:
            career_percentages[career] = calculate_percentage(business_score, 0)

        # Engineering Careers (ENGINEER)
        for career in career_mapping["engineering"]["careers"]:
            career_percentages[career] = calculate_percentage(engineer_score, science_score)

        # Medical Careers (DOCTORAL)
        for career in career_mapping["medical"]["careers"]:
            career_percentages[career] = calculate_percentage(doctoral_score, science_score)

        # Law Careers (Law)
        for career in career_mapping["law"]["careers"]:
            career_percentages[career] = calculate_percentage(law_score, 0)

        # Education Careers (Education)
        for career in career_mapping["education"]["careers"]:
            career_percentages[career] = calculate_percentage(education_score, 0)

        # Science Careers (Science)
        for career in career_mapping["science"]["careers"]:
            career_percentages[career] = calculate_percentage(science_score, 0)

        # Media Careers (Media)
        for career in career_mapping["media"]["careers"]:
            career_percentages[career] = calculate_percentage(media_score, 0)

        # Log final results
        print(f"Final Calculated Career Percentages: {career_percentages}")

        # Return the result as a JSON response
        return jsonify({'career_percentages': career_percentages})

    except Exception as e:
        # Log any errors for debugging purposes
        print(f"Error in prediction: {e}")  # Log the error message
        return jsonify({'error': str(e)}), 500  # Return the error message in the response
      
if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")







