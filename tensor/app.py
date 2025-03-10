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



import joblib  # If using a saved model
from ocr import prediction_strand_cert  # If using a function-based approach
# print(dir(ocr.utils))  # Check if perform_ocr is listed

# for pq jhs

import numpy as np

# for prediction exam jhs

import re



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


def predict_shs_strand(answers):
    """
    Predicts the Senior High School (SHS) strand based on the student's answers.
    """
    strand_scores = {
        "STEM": 0, "ABM": 0, "HUMSS": 0,
        "Arts and Design": 0, "TVL": 0, "Sports": 0
    }

    subject_to_strand = {
        "Mathematics": "STEM", "Science": "STEM",
        "English": "HUMSS", "Filipino": "HUMSS", "Social Studies": "HUMSS",
        "Technology and Livelihood Education (TLE)": "TVL",
        "Arts and Music": "Arts and Design",
        "Physical Education and Sports": "Sports"
    }

    if answers.get("strongest-subject") in subject_to_strand:
        strand_scores[subject_to_strand[answers["strongest-subject"]]] += 3

    predicted_strand = max(strand_scores, key=strand_scores.get)
    strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

    return predicted_strand, strand_scores_list





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
            strand_scores[strand] = round((strand_scores[strand] / max_possible) * 25, 2)

    predicted_strand = max(strand_scores, key=strand_scores.get)
    strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

    return {
        "predicted_strand": predicted_strand,
        "prediction_scores": strand_scores_list
    }


@app.route('/predict_college', methods=['POST'])
def prediction_college():
    """
    Predicts the ideal college course based on answers to college-related questions.
    """
    data = request.get_json()

    # Ensure data is received
    if not data:
        return jsonify({"error": "Invalid request, no data received"}), 400

    # Make the prediction using the function from prediction_college.py
    try:
        predicted_course, course_scores = predict_college_course(data["answers"])
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

    # Return the prediction result as JSON
    return jsonify({
        "predicted_course": predicted_course,
        "prediction_scores": course_scores
    })

# Define all 60 courses
SPECIFIC_COURSES = {
    "BS Civil Engineering": [], "BS Mechanical Engineering": [], "BS Electrical Engineering": [],
    "BS Electronics Engineering": [], "BS Industrial Engineering": [], "BS Aerospace Engineering": [],
    
    "BS Nursing": [], "BS Medical Technology": [], "BS Pharmacy": [], "BS Radiologic Technology": [],
    "BS Physical Therapy": [], "Doctor of Medicine": [], "BS Midwifery": [], "BS Nutrition and Dietetics": [],
    
    "BS Computer Science": [], "BS Information Technology": [], "BS Software Engineering": [],
    "BS Data Science": [], "BS Game Development": [], "BS Cybersecurity": [], "BS Artificial Intelligence": [],
    
    "BS Business Administration": [], "BS Accountancy": [], "BS Marketing Management": [],
    "BS Financial Management": [], "BS Economics": [], "BS Entrepreneurship": [], "BS Human Resource Management": [],
    
    "BA Political Science": [], "BA Psychology": [], "BA Sociology": [], "BA Literature": [],
    "BA Philosophy": [], "BA Communication": [], "BA Creative Writing": [],
    
    "Bachelor of Laws (LLB)": [], "BS Criminology": [], "BS Legal Management": [],
    "BS Public Administration": [], "BA International Relations": [], "BA Political Science (Pre-Law)": [],
    
    "BS Elementary Education": [], "BS Secondary Education Major in Mathematics": [],
    "BS Secondary Education Major in Science": [], "BS Special Education": [],
    "BS Physical Education": [], "BS Early Childhood Education": [],
    
    "BS Biology": [], "BS Chemistry": [], "BS Physics": [], "BS Environmental Science": [],
    "BS Applied Mathematics": [], "BS Statistics": [], "BS Biochemistry": [],
    
    "BS Hotel & Restaurant Management": [], "BS Tourism Management": [], "BS Culinary Arts": [],
    "BS Travel Management": [], "BS Hospitality Management": [], "BS Cruise Line Operations": [],
    
    "BS Agriculture": [], "BS Forestry": [], "BS Environmental Management": [],
    "BS Fisheries": [], "BS Agricultural Engineering": [], "BS Agribusiness": []
}

def predict_college_course(answers):
    # Initialize course scores (all courses start with a base score of 5)
    course_scores = {course: 5 for course in SPECIFIC_COURSES}

    MAX_SCORE = 25  # Maximum possible score for a course

    # Mapping subjects to relevant courses
    subject_to_courses = {
        "Mathematics": ["BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering",
                        "BS Electronics Engineering", "BS Industrial Engineering", "BS Applied Mathematics",
                        "BS Statistics"],
        "Science": ["BS Biology", "BS Chemistry", "BS Physics", "BS Environmental Science", "BS Biochemistry",
                    "Doctor of Medicine", "BS Nursing", "BS Pharmacy", "BS Medical Technology"],
        "Information Technology": ["BS Computer Science", "BS Information Technology", "BS Software Engineering",
                                   "BS Data Science", "BS Game Development", "BS Cybersecurity", "BS Artificial Intelligence"],
        "Business & Finance": ["BS Business Administration", "BS Accountancy", "BS Marketing Management",
                               "BS Financial Management", "BS Economics", "BS Entrepreneurship",
                               "BS Human Resource Management"],
        "Arts & Humanities": ["BA Literature", "BA Communication", "BA Creative Writing", "BA Philosophy"],
        "Social Sciences": ["BA Psychology", "BA Sociology", "BA Political Science", "BS Public Administration"],
        "Engineering & Technical": ["BS Civil Engineering", "BS Mechanical Engineering", "BS Aerospace Engineering",
                                    "BS Industrial Engineering", "BS Electrical Engineering"],
        "Health & Medical": ["BS Nursing", "BS Medical Technology", "Doctor of Medicine", "BS Pharmacy",
                             "BS Radiologic Technology", "BS Physical Therapy", "BS Midwifery", "BS Nutrition and Dietetics"]
    }

    # Helper function to update course scores
    def update_scores(mapping, answer, weight=5):
        if answer in mapping:
            for course in mapping[answer]:
                if course in course_scores:
                    course_scores[course] += weight

    # Process answers
    for subject in answers.get("high-grades-subjects", []):
        update_scores(subject_to_courses, subject, 10)  # Increased weight

    for subject in answers.get("favorite-subjects", []):
        update_scores(subject_to_courses, subject, 5)

    # Career Interests
    career_to_courses = {
        "Engineering": ["BS Civil Engineering", "BS Mechanical Engineering", "BS Electrical Engineering",
                        "BS Industrial Engineering", "BS Aerospace Engineering"],
        "Medicine & Healthcare": ["BS Nursing", "BS Medical Technology", "Doctor of Medicine", "BS Pharmacy",
                                  "BS Radiologic Technology", "BS Physical Therapy", "BS Midwifery"],
        "Business & Management": ["BS Business Administration", "BS Accountancy", "BS Marketing Management",
                                  "BS Financial Management", "BS Economics", "BS Entrepreneurship",
                                  "BS Human Resource Management"],
        "IT & Technology": ["BS Computer Science", "BS Information Technology", "BS Software Engineering",
                            "BS Data Science", "BS Game Development", "BS Cybersecurity", "BS Artificial Intelligence"],
        "Law & Politics": ["Bachelor of Laws (LLB)", "BA Political Science", "BS Legal Management",
                           "BS Public Administration", "BA International Relations", "BA Political Science (Pre-Law)"],
        "Arts & Media": ["BA Communication", "BA Creative Writing", "BS Culinary Arts"],
        "Social Sciences": ["BA Psychology", "BA Sociology", "BS Criminology"],
        "Science & Research": ["BS Biology", "BS Chemistry", "BS Physics", "BS Environmental Science", "BS Biochemistry"]
    }

    for career in answers.get("career-interests", []):
        update_scores(career_to_courses, career, 15)  # Increased weight

    # College Motivation
    motivation_to_courses = {
        "To follow my passion and interests": ["BA Communication", "BA Creative Writing", "BS Culinary Arts"],
        "To have better job opportunities": ["BS Civil Engineering", "BS Business Administration", "BS Information Technology"],
        "Because my parents expect me to": ["Bachelor of Laws (LLB)", "BS Accountancy"],
        "To earn a high salary": ["BS Computer Science", "BS Nursing", "BS Business Administration"]
    }

    update_scores(motivation_to_courses, answers.get("college-motivation"), 7)

    # SHS Strand Relation
    if answers.get("shs-course-relation") == "Yes, I want to continue in the same field.":
        for course in course_scores:
            course_scores[course] += 5

    # College Course Concerns
    concern_to_courses = {
        "Difficulty of the course": ["BS Business Administration", "BS Accountancy"],
        "Tuition fees and financial constraints": ["BS Public Administration", "BS Agribusiness"],
        "Future job opportunities": ["BS Nursing", "BS Information Technology", "BS Civil Engineering"],
        "Family pressure": ["BS Accountancy", "Bachelor of Laws (LLB)"],
        "Uncertainty about my interests": ["BA Psychology", "BA Sociology"]
    }

    for concern in answers.get("college-course-concern", []):
        update_scores(concern_to_courses, concern, 5)

    # Ensure all courses have a minimum score of 5
    for course in course_scores:
        if course_scores[course] < 5:
            course_scores[course] = 5

    # Normalize scores so that the highest score is 25
    max_score = max(course_scores.values())
    if max_score > 0:
        for course in course_scores:
            course_scores[course] = round((course_scores[course] / max_score) * MAX_SCORE, 2)

    # Get the course with the highest score
    predicted_course = max(course_scores, key=course_scores.get)

    # Create a list of courses with their normalized scores
    course_scores_list = [{"course": key, "score": value} for key, value in course_scores.items()]

    # Print final result to terminal
    print(f"Predicted College Course: {predicted_course}")
    print(f"Course Scores List: {course_scores_list}")

    return predicted_course, course_scores_list


# PREDICTION EXAM JHS
# Load your trained prediction model (example)

# Function to extract numeric score from the string

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
    "Structural Engineer", "Project Manager", "Construction Engineer",
    "Geotechnical Engineer", "Transportation Engineer", "Urban Planner",
    "Water Resources Engineer", "Environmental Engineer"
  ],
  "BS Mechanical Engineering": [
    "Mechanical Engineer", "Manufacturing Engineer", "Automotive Engineer",
    "HVAC Engineer", "Robotics Engineer", "Aerospace Engineer",
    "Energy Systems Engineer", "Product Design Engineer"
  ],
  "BS Electrical Engineering": [
    "Electrical Engineer", "Power Systems Engineer", "Electronics Technician",
    "Control Systems Engineer", "Telecommunications Engineer", "Renewable Energy Engineer",
    "Embedded Systems Developer", "Instrumentation Engineer"
  ],
  "BS Electronics Engineering": [
    "Electronics Engineer", "Embedded Systems Developer", "Robotics Engineer",
    "Telecommunications Engineer", "Hardware Engineer", "IoT Specialist",
    "Signal Processing Engineer", "Consumer Electronics Designer"
  ],
  "BS Industrial Engineering": [
    "Process Engineer", "Quality Control Specialist", "Operations Manager",
    "Supply Chain Analyst", "Logistics Manager", "Production Planner",
    "Ergonomics Consultant", "Manufacturing Systems Engineer"
  ],
  "BS Aerospace Engineering": [
    "Aerospace Engineer", "Flight Test Engineer", "Aviation Consultant",
    "Aircraft Designer", "Satellite Engineer", "Spacecraft Systems Engineer",
    "Aerodynamics Specialist", "Propulsion Engineer"
  ],
  "BS Nursing": [
    "Registered Nurse", "Health Administrator", "Clinical Researcher",
    "Nurse Educator", "Pediatric Nurse", "Critical Care Nurse",
    "Public Health Nurse", "Nurse Practitioner"
  ],
  "BS Medical Technology": [
    "Medical Technologist", "Laboratory Technician", "Clinical Analyst",
    "Pathology Specialist", "Blood Bank Technologist", "Microbiology Technologist",
    "Molecular Diagnostics Specialist", "Research Scientist"
  ],
  "BS Pharmacy": [
    "Pharmacist", "Clinical Researcher", "Regulatory Affairs Specialist",
    "Pharmaceutical Sales Representative", "Drug Safety Officer",
    "Hospital Pharmacist", "Clinical Pharmacist", "Pharmacy Manager"
  ],
  "BS Radiologic Technology": [
    "Radiologic Technologist", "MRI Technician", "Diagnostic Imaging Specialist",
    "Radiation Therapist", "Nuclear Medicine Technologist", "Ultrasound Technician",
    "CT Scan Technologist", "Medical Imaging Consultant"
  ],
  "BS Physical Therapy": [
    "Physical Therapist", "Rehabilitation Specialist", "Sports Therapist",
    "Orthopedic Therapist", "Pediatric Therapist", "Geriatric Therapist",
    "Neurological Therapist", "Occupational Health Specialist"
  ],
  "Doctor of Medicine": [
    "Medical Doctor", "Surgeon", "General Practitioner",
    "Pediatrician", "Cardiologist", "Dermatologist",
    "Psychiatrist", "Oncologist"
  ],
  "BS Midwifery": [
    "Midwife", "Maternal Health Specialist", "Birth Consultant",
    "Lactation Consultant", "Women's Health Nurse", "Community Health Worker",
    "Reproductive Health Educator", "Prenatal Care Specialist"
  ],
  "BS Nutrition and Dietetics": [
    "Nutritionist", "Dietitian", "Health Consultant",
    "Clinical Dietitian", "Sports Nutritionist", "Public Health Nutritionist",
    "Food Service Manager", "Wellness Coach"
  ],
  "BS Computer Science": [
    "Software Developer", "Data Scientist", "Cybersecurity Analyst",
    "Machine Learning Engineer", "AI Specialist", "Cloud Architect",
    "DevOps Engineer", "Blockchain Developer"
  ],
  "BS Information Technology": [
    "IT Specialist", "System Administrator", "Cloud Engineer",
    "Network Engineer", "Database Administrator", "IT Project Manager",
    "Cybersecurity Analyst", "IT Consultant"
  ],
  "BS Software Engineering": [
    "Software Engineer", "Full Stack Developer", "QA Engineer",
    "Mobile App Developer", "Game Developer", "Embedded Systems Engineer",
    "UI/UX Designer", "Technical Lead"
  ],
  "BS Data Science": [
    "Data Scientist", "Machine Learning Engineer", "Business Intelligence Analyst",
    "Data Engineer", "Data Analyst", "Big Data Specialist",
    "AI Researcher", "Predictive Modeler"
  ],
  "BS Game Development": [
    "Game Developer", "Game Designer", "Graphics Programmer",
    "Gameplay Programmer", "VR/AR Developer", "Game Producer",
    "Level Designer", "Game Tester"
  ],
  "BS Cybersecurity": [
    "Cybersecurity Analyst", "Penetration Tester", "Security Engineer",
    "Information Security Manager", "Ethical Hacker", "Security Architect",
    "Incident Responder", "Cryptographer"
  ],
  "BS Artificial Intelligence": [
    "AI Engineer", "Machine Learning Specialist", "AI Researcher",
    "Natural Language Processing Engineer", "Computer Vision Engineer",
    "Robotics Engineer", "AI Consultant", "Data Scientist"
  ],
  "BS Business Administration": [
    "Business Consultant", "Operations Manager", "Entrepreneur",
    "Marketing Manager", "Financial Analyst", "Human Resources Manager",
    "Project Manager", "Supply Chain Manager"
  ],
  "BS Accountancy": [
    "Accountant", "Auditor", "Tax Consultant",
    "Financial Analyst", "Forensic Accountant", "Management Accountant",
    "Budget Analyst", "Chief Financial Officer (CFO)"
  ],
  "BS Marketing Management": [
    "Marketing Specialist", "Brand Manager", "Market Research Analyst",
    "Digital Marketing Manager", "Advertising Executive", "Public Relations Specialist",
    "Social Media Manager", "Content Strategist"
  ],
  "BS Financial Management": [
    "Financial Analyst", "Investment Banker", "Risk Manager",
    "Wealth Manager", "Portfolio Manager", "Corporate Treasurer",
    "Credit Analyst", "Financial Planner"
  ],
  "BS Economics": [
    "Economist", "Policy Analyst", "Financial Consultant",
    "Data Analyst", "Market Research Analyst", "Economic Researcher",
    "Investment Analyst", "International Trade Specialist"
  ],
  "BS Entrepreneurship": [
    "Startup Founder", "Business Consultant", "Venture Capitalist",
    "Innovation Manager", "Small Business Owner", "Product Manager",
    "Business Development Manager", "Social Entrepreneur"
  ],
  "BS Human Resource Management": [
    "HR Manager", "Recruitment Specialist", "Training Coordinator",
    "Compensation and Benefits Manager", "Employee Relations Specialist",
    "Talent Acquisition Specialist", "Organizational Development Consultant",
    "HR Business Partner"
  ],
  "BA Political Science": [
    "Policy Analyst", "Government Officer", "Diplomat",
    "Political Consultant", "Legislative Assistant", "Public Affairs Specialist",
    "International Relations Specialist", "Political Campaign Manager"
  ],
  "BA Psychology": [
    "Psychologist", "Counselor", "Human Resource Specialist",
    "Clinical Psychologist", "School Psychologist", "Industrial-Organizational Psychologist",
    "Behavioral Therapist", "Mental Health Advocate"
  ],
  "BA Sociology": [
    "Sociologist", "Community Development Officer", "Research Analyst",
    "Social Worker", "Urban Planner", "Policy Analyst",
    "Demographer", "Criminologist"
  ],
  "BA Literature": [
    "Writer", "Editor", "Literary Critic",
    "Content Creator", "Journalist", "Copywriter",
    "Publishing Specialist", "Academic Researcher"
  ],
  "BA Philosophy": [
    "Philosopher", "Ethics Consultant", "Professor",
    "Policy Analyst", "Legal Consultant", "Public Intellectual",
    "Ethics Officer", "Think Tank Researcher"
  ],
  "BA Communication": [
    "Journalist", "Public Relations Specialist", "Media Producer",
    "Broadcast Journalist", "Content Strategist", "Social Media Manager",
    "Corporate Communications Specialist", "Event Planner"
  ],
  "BA Creative Writing": [
    "Author", "Screenwriter", "Content Creator",
    "Copywriter", "Editor", "Literary Agent",
    "Publishing Consultant", "Storyteller"
  ],
  "Bachelor of Laws (LLB)": [
    "Lawyer", "Judge", "Legal Consultant",
    "Corporate Lawyer", "Criminal Defense Attorney", "Public Prosecutor",
    "Legal Advisor", "Human Rights Advocate"
  ],
  "BS Criminology": [
    "Criminologist", "Police Officer", "Forensic Analyst",
    "Crime Scene Investigator", "Probation Officer", "Private Investigator",
    "Security Consultant", "Juvenile Justice Specialist"
  ],
  "BS Legal Management": [
    "Legal Consultant", "Corporate Lawyer", "Paralegal",
    "Compliance Officer", "Legal Operations Manager", "Contract Administrator",
    "Legal Analyst", "Court Administrator"
  ],
  "BS Public Administration": [
    "Government Administrator", "Public Policy Analyst", "City Planner",
    "Nonprofit Manager", "Public Affairs Consultant", "Urban Development Specialist",
    "Policy Advisor", "Community Development Officer"
  ],
  "BA International Relations": [
    "Diplomat", "Foreign Affairs Specialist", "International Trade Consultant",
    "Policy Analyst", "Global Development Specialist", "International NGO Worker",
    "Cultural Affairs Officer", "Intelligence Analyst"
  ],
  "BA Political Science (Pre-Law)": [
    "Legislative Analyst", "Political Consultant", "Attorney",
    "Legal Researcher", "Policy Advisor", "Public Defender",
    "Corporate Counsel", "Human Rights Lawyer"
  ],
  "BS Elementary Education": [
    "Elementary Teacher", "Curriculum Developer", "Education Consultant",
    "School Administrator", "Special Education Teacher", "Literacy Coach",
    "Educational Therapist", "Child Development Specialist"
  ],
  "BS Secondary Education Major in Mathematics": [
    "Math Teacher", "Education Researcher", "School Administrator",
    "Curriculum Specialist", "Tutor", "Educational Consultant",
    "Instructional Designer", "Test Prep Instructor"
  ],
  "BS Secondary Education Major in Science": [
    "Science Teacher", "STEM Coordinator", "Lab Instructor",
    "Curriculum Developer", "Educational Consultant", "Science Communicator",
    "Environmental Educator", "Science Writer"
  ],
  "BS Special Education": [
    "Special Education Teacher", "Behavioral Therapist", "Child Development Specialist",
    "Inclusion Specialist", "Educational Psychologist", "Speech-Language Pathologist",
    "Occupational Therapist", "Autism Specialist"
  ],
  "BS Physical Education": [
    "PE Teacher", "Fitness Trainer", "Sports Coach",
    "Athletic Director", "Recreation Coordinator", "Health Educator",
    "Sports Psychologist", "Personal Trainer"
  ],
  "BS Early Childhood Education": [
    "Kindergarten Teacher", "Childcare Director", "Educational Therapist",
    "Preschool Teacher", "Child Development Specialist", "Early Intervention Specialist",
    "Curriculum Developer", "Parent Educator"
  ],
  "BS Biology": [
    "Biologist", "Biomedical Researcher", "Environmental Scientist",
    "Microbiologist", "Geneticist", "Wildlife Biologist",
    "Marine Biologist", "Conservation Scientist"
  ],
  "BS Chemistry": [
    "Chemist", "Pharmaceutical Scientist", "Materials Researcher",
    "Analytical Chemist", "Forensic Scientist", "Environmental Chemist",
    "Food Scientist", "Quality Control Chemist"
  ],
  "BS Physics": [
    "Physicist", "Research Scientist", "Medical Physicist",
    "Astrophysicist", "Nuclear Physicist", "Data Scientist",
    "Optics Engineer", "Acoustics Engineer"
  ],
  "BS Environmental Science": [
    "Environmental Consultant", "Sustainability Officer", "Ecologist",
    "Climate Change Analyst", "Environmental Policy Analyst", "Conservation Scientist",
    "Waste Management Specialist", "Renewable Energy Consultant"
  ],
  "BS Applied Mathematics": [
    "Mathematician", "Operations Research Analyst", "Cryptographer",
    "Data Scientist", "Financial Analyst", "Actuary",
    "Quantitative Analyst", "Statistical Consultant"
  ],
  "BS Statistics": [
    "Statistician", "Data Analyst", "Market Researcher",
    "Biostatistician", "Econometrician", "Quality Control Analyst",
    "Risk Analyst", "Sports Statistician"
  ],
  "BS Biochemistry": [
    "Biochemist", "Geneticist", "Clinical Laboratory Scientist",
    "Pharmaceutical Researcher", "Molecular Biologist", "Biotechnology Specialist",
    "Forensic Scientist", "Toxicologist"
  ],
  "BS Hotel & Restaurant Management": [
    "Hotel Manager", "Event Coordinator", "Resort Manager",
    "Food and Beverage Manager", "Front Office Manager", "Revenue Manager",
    "Catering Manager", "Hospitality Consultant"
  ],
  "BS Tourism Management": [
    "Tourism Officer", "Travel Consultant", "Hospitality Director",
    "Tour Operator", "Destination Manager", "Event Planner",
    "Travel Writer", "Cultural Tourism Specialist"
  ],
  "BS Culinary Arts": [
    "Chef", "Food & Beverage Manager", "Culinary Consultant",
    "Pastry Chef", "Catering Manager", "Food Stylist",
    "Recipe Developer", "Restaurant Owner"
  ],
  "BS Travel Management": [
    "Travel Agent", "Airline Operations Manager", "Tour Manager",
    "Travel Consultant", "Cruise Director", "Destination Specialist",
    "Travel Blogger", "Adventure Tour Guide"
  ],
  "BS Hospitality Management": [
    "Resort Manager", "Front Office Manager", "Casino Manager",
    "Event Planner", "Guest Relations Manager", "Revenue Manager",
    "Hospitality Trainer", "Luxury Brand Manager"
  ],
  "BS Cruise Line Operations": [
    "Cruise Director", "Onboard Manager", "Hospitality Supervisor",
    "Entertainment Manager", "Guest Services Manager", "Cruise Sales Manager",
    "Catering Manager", "Cruise Operations Specialist"
  ],
  "BS Agriculture": [
    "Agricultural Scientist", "Farm Manager", "Agribusiness Consultant",
    "Soil Scientist", "Crop Consultant", "Agricultural Economist",
    "Sustainable Agriculture Specialist", "Agricultural Extension Officer"
  ],
  "BS Forestry": [
    "Forester", "Environmental Conservationist", "Wildlife Manager",
    "Forest Ecologist", "Timber Manager", "Park Ranger",
    "Conservation Scientist", "Forest Policy Analyst"
  ],
  "BS Environmental Management": [
    "Sustainability Consultant", "Environmental Officer", "Waste Management Specialist",
    "Climate Change Analyst", "Environmental Auditor", "Renewable Energy Consultant",
    "Environmental Educator", "Corporate Sustainability Manager"
  ],
  "BS Fisheries": [
    "Fisheries Scientist", "Marine Biologist", "Aquaculture Manager",
    "Fisheries Consultant", "Fish Health Specialist", "Marine Conservationist",
    "Aquatic Ecologist", "Fisheries Policy Analyst"
  ],
  "BS Agricultural Engineering": [
    "Agricultural Engineer", "Irrigation Specialist", "Soil Scientist",
    "Farm Equipment Designer", "Food Process Engineer", "Renewable Energy Engineer",
    "Precision Agriculture Specialist", "Agricultural Automation Engineer"
  ],
  "BS Agribusiness": [
    "Agribusiness Manager", "Food Supply Chain Analyst", "Farm Entrepreneur",
    "Agricultural Economist", "Commodity Trader", "Rural Development Specialist",
    "Agricultural Marketing Specialist", "Agri-Tech Consultant"
  ]
}

@app.route('/api/predict-career', methods=['POST'])
def predict_career():
    data = request.json
    course = data.get("course")

    careers = CAREER_PREDICTIONS.get(course, ["Career data unavailable"])

    return jsonify({"careers": careers})

if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
