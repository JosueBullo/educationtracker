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
                            else:
                                predictions = {"message": "Prediction for SHS is not available yet."}

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
    
    
# 🔹 Load the model (Ensure this points to your trained model file)
try:
    model = joblib.load("path/to/your/model.pkl")  # Adjust path accordingly
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None  # Fallback if model fails to load

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
    Predicts the SHS strand based on the strongest subject of a Junior High School student.
    """
    data = request.get_json()

    # Ensure data is received
    if not data:
        return jsonify({"error": "Invalid request, no data received"}), 400

    # Ensure the grade level is JHS
    if data.get("gradeLevel") != "jhs":
        return jsonify({"error": "Prediction is only available for Junior High School students"}), 400

    # Make the prediction using the function from prediction_pq.py
    try:
        predicted_strand, strand_scores = predict_shs_strand(data["answers"])
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

    # Return the prediction result as JSON
    return jsonify({
        "predicted_strand": predicted_strand,
        "prediction_scores": strand_scores
    })

def predict_shs_strand(answers):
    # Initialize strand scores
    strand_scores = {
        "STEM": 5, "ABM": 5, "HUMSS": 5, "GAS": 5, "TVL": 5
    }

    MAX_SCORE = 25  # Max score per strand

    # Subject Strength (25%)
    subject_to_strands = {
        "Mathematics": {"STEM": 10, "ABM": 5},
        "Science": {"STEM": 10, "HUMSS": 5},
        "English or Literature": {"HUMSS": 10, "ABM": 5},
        "Business and Economics": {"ABM": 10, "HUMSS": 5},
        "Technology and Computer Science": {"STEM": 10, "TVL": 7},
        "Social Studies or Philosophy": {"HUMSS": 10, "GAS": 5},
        "Physical Education and Sports": {"TVL": 7, "GAS": 5}
    }

    # Activity Preference (25%)
    activity_to_strands = {
        "Solving math problems and analyzing data": {"STEM": 10, "ABM": 5},
        "Conducting science experiments and research": {"STEM": 10, "HUMSS": 5},
        "Writing essays, stories, or public speaking": {"HUMSS": 10, "GAS": 5},
        "Managing business, marketing, or finances": {"ABM": 10, "TVL": 5},
        "Working with technology, coding, or hands-on projects": {"STEM": 10, "TVL": 7},
        "Helping others, teaching, or discussing social issues": {"HUMSS": 10, "GAS": 5}
    }

    # Career Goal (25%)
    career_to_strands = {
        "Engineer, Scientist, or IT professional": {"STEM": 10},
        "Doctor, Nurse, or Health professional": {"STEM": 8, "HUMSS": 5},
        "Business owner, Manager, or Accountant": {"ABM": 10, "TVL": 5},
        "Teacher, Psychologist, or Lawyer": {"HUMSS": 10, "GAS": 5},
        "Technician, Electrician, or Skilled worker": {"TVL": 10, "STEM": 5}
    }

    # Problem-Solving & Motivation (25%)
    problem_solving_to_strands = {
        "Using logic, numbers, and analysis": {"STEM": 10, "ABM": 5},
        "Experimenting and testing different solutions": {"STEM": 10, "TVL": 7},
        "Thinking creatively and coming up with unique ideas": {"HUMSS": 10, "GAS": 5},
        "Discussing and debating different viewpoints": {"HUMSS": 10, "ABM": 5},
        "Using hands-on skills and practical knowledge": {"TVL": 10, "GAS": 5}
    }

    career_motivation_to_strands = {
        "Earning a high salary": {"STEM": 5, "ABM": 5},
        "Doing something I love and enjoy": {"GAS": 5, "TVL": 5},
        "Helping others and making an impact": {"HUMSS": 5, "GAS": 3},
        "Having job security and stability": {"STEM": 5, "ABM": 3},
        "Being my own boss and having independence": {"ABM": 5, "TVL": 3}
    }

    # Helper function to update strand scores
    def update_scores(mapping, answer):
        if answer in mapping:
            for strand, score in mapping[answer].items():
                strand_scores[strand] += score

    # Apply mappings (update strand scores based on answers)
    update_scores(subject_to_strands, answers.get("best-subject"))
    update_scores(activity_to_strands, answers.get("preferred-activity"))
    update_scores(career_to_strands, answers.get("career-goal"))
    update_scores(problem_solving_to_strands, answers.get("problem-solving"))
    update_scores(career_motivation_to_strands, answers.get("career-motivation"))

    # Preferred SHS Strand (adds small weight to preference)
    preferred_strand = answers.get("shs-strand")
    if preferred_strand in strand_scores:
        strand_scores[preferred_strand] += 5  

    # Confidence in Career Choice (adjust impact)
    confidence_weight = {
        "Very confident – I already know my path": 5,
        "Somewhat confident – I have an idea but need more information": 3,
        "Unsure – I am still exploring my options": 2,
        "Not confident – I have no idea what I want to do yet": 0
    }
    career_confidence = answers.get("career-confidence")
    if career_confidence in confidence_weight:
        for strand in strand_scores:
            strand_scores[strand] += confidence_weight[career_confidence]

    # CAP THE MAX SCORE PER STRAND TO 25
    for strand in strand_scores:
        strand_scores[strand] = min(strand_scores[strand], MAX_SCORE)

    # Normalize scores (Convert to percentage out of 25)
    total_score = sum(strand_scores.values())
    if total_score > 0:
        for strand in strand_scores:
            strand_scores[strand] = round((strand_scores[strand] / total_score) * 25, 2)

    # Debugging: Print strand scores for better tracking
    print("Final Strand Scores:", strand_scores)

    # Predict based on highest score
    predicted_strand = max(strand_scores, key=strand_scores.get)
    strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

    # Print final result to terminal
    print(f"Predicted SHS Strand: {predicted_strand}")
    print(f"Strand Scores List: {strand_scores_list}")

    return predicted_strand, strand_scores_list



# PREDICTION EXAM JHS
# Load your trained prediction model (example)

# Function to extract numeric score from the string

def extract_numeric_score(score_string):
    """Extract numeric score from a string. If the string cannot be converted to a number, return 0."""
    try:
        # Use regular expression to match the numeric value before any non-numeric characters, allowing for extra spaces
        match = re.match(r"(\d+)", score_string.strip())  # Strip spaces before matching
        if match:
            extracted_value = float(match.group(1))  # Convert the matched group to a float
            print(f"Extracted numeric score from '{score_string}': {extracted_value}")  # Debug log
            return extracted_value
        else:
            print(f"Failed to extract numeric score from '{score_string}'")  # Debug log
            return 0  # Return 0 if no numeric value is found
    except ValueError as e:
        # If conversion fails, return 0
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

        # STEM strand condition (both math and science >= 15)
        if math_score >= 1 and science_score >= 1:
            stem_percentage = (math_score + science_score) / 40 * 100  # Assuming max score is 20 per section
            strand_percentages['STEM'] = min(round(stem_percentage, 2), 25)  # Cap the percentage at 25%
        else:
            strand_percentages['STEM'] = 0

        # ABM strand condition (entrepreneurial score >= 1)
        if entrepreneurial_score >= 1:
            abm_percentage = entrepreneurial_score / 20 * 100  # Assuming max score is 20
            strand_percentages['ABM'] = min(round(abm_percentage, 2), 25)  # Cap the percentage at 25%
        else:
            strand_percentages['ABM'] = 0

        # HUMSS strand condition (both verbal and mechanical scores >= 1)
        if verbal_score >= 1 and mechanical_score >= 1:
            humss_percentage = (verbal_score + mechanical_score) / 40 * 100  # Assuming max score is 20 per section
            strand_percentages['HUMSS'] = min(round(humss_percentage, 2), 25)  # Cap the percentage at 25%
        else:
            strand_percentages['HUMSS'] = 0

        # GAS strand condition (math, science, and entrepreneurial scores all >= 1)
        if math_score >= 1 and science_score >= 1 and entrepreneurial_score >= 1:
            gas_percentage = (math_score + science_score + entrepreneurial_score) / 60 * 100  # Assuming max score is 20 per section
            strand_percentages['GAS'] = min(round(gas_percentage, 2), 25)  # Cap the percentage at 25%
        else:
            strand_percentages['GAS'] = 0

        # TVL strand condition (mechanical score >= 1)
        if mechanical_score >= 1:
            tvl_percentage = mechanical_score / 20 * 100  # Assuming max score is 20
            strand_percentages['TVL'] = min(round(tvl_percentage, 2), 25)  # Cap the percentage at 25%
        else:
            strand_percentages['TVL'] = 0

        # Return the result as a JSON response
        print(f"Calculated strand percentages: {strand_percentages}")
        
        # Return the result as a JSON response with all the strand percentages
        return jsonify({'strand_percentages': strand_percentages})

    except Exception as e:
        # Log any errors for debugging purposes
        print(f"Error in prediction: {e}")  # Log the error message
        return jsonify({'error': str(e)}), 500  # Return the error message in the response


    
if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
