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


import joblib  # If using a saved model
from ocr import prediction_strand_cert  # If using a function-based approach
# print(dir(ocr.utils))  # Check if perform_ocr is listed





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


if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
