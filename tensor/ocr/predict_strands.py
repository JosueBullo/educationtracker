def predict_strands(extracted_data):
    """
    Compute prediction percentages for each senior high strand based on extracted subjects and grades.
    Each required subject contributes a maximum of 20% (i.e., if a subject's grade is 100, it contributes 20%).
    
    The final strand percentage is computed as:
       final_percentage = (sum over required subjects: (grade/100)*20) / (number of required subjects * 20) * 100
       
    This effectively normalizes the combined contributions to a percentage score.
    
    :param extracted_data: List of dictionaries, each with keys "subject" and "final_grade"
                             e.g., [{"subject": "Mathematics", "final_grade": 88}, ...]
    :return: A dictionary with strand names as keys and prediction percentages as values.
    """
    # Define the required subjects for each strand
    STRAND_REQUIREMENTS = {
        "STEM": ["Mathematics", "Science", "English"],
        "ABM": ["Mathematics", "English", "Accountancy", "Business"],
        "HUMSS": ["Filipino", "Social Studies", "English"],
        "GAS": ["Mathematics", "Science", "English", "Filipino", "Social Studies"],
        "TVL": ["MAPEH", "Values Education", "Technical Drawing"]
    }
    
    predictions = {}
    
    for strand, req_subjects in STRAND_REQUIREMENTS.items():
        total_contribution = 0
        total_possible = len(req_subjects) * 20  # Maximum possible contribution for this strand
        for subject in req_subjects:
            # Look for the subject in the extracted data (case-insensitive)
            grade = None
            for entry in extracted_data:
                if entry["subject"].strip().lower() == subject.lower():
                    grade = entry["final_grade"]
                    break
            if grade is not None:
                # Each subject's contribution is capped at 20% (if grade is 100, contribution is 20)
                contribution = (grade / 100) * 20
            else:
                contribution = 0
            total_contribution += contribution
        
        # Normalize the total contribution to a percentage (0-100%)
        percentage = (total_contribution / total_possible) * 100 if total_possible > 0 else 0
        predictions[strand] = round(percentage, 2)
    
    return predictions

# Example usage:
if __name__ == "__main__":
    # Sample extracted data from OCR/inference (adjust as needed)
    extracted_data = [
        {"subject": "Mathematics", "final_grade": 88},
        {"subject": "Science", "final_grade": 89},
        {"subject": "English", "final_grade": 92},
        {"subject": "Filipino", "final_grade": 87},
        {"subject": "Social Studies", "final_grade": 90},
        {"subject": "MAPEH", "final_grade": 95},
        {"subject": "Values Education", "final_grade": 93},
    ]
    predictions = predict_strands(extracted_data)
    print("Strand Predictions:", predictions)
