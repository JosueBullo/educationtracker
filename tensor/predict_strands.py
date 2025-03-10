# def normalize_subject(text):
#     """
#     Normalize subject text by stripping extra spaces and converting to lowercase.
#     """
#     return text.strip().lower()


# def predict_strands(extracted_data, default_grade=50):
#     """
#     Compute the average grade for each senior high strand based on extracted subjects and grades.
    
#     For each strand, every required subject contributes equally. If a required subject's grade
#     is available, its grade is used; otherwise a default grade (default_grade, e.g., 50) is assumed.
    
#     Once each strand's average is computed, the function calculates the relative percentage
#     for each strand by taking (strand_average / sum of all strand averages) * 100.
    
#     :param extracted_data: List of dictionaries, each with keys "subject" and "final_grade"
#                            e.g., [{"subject": "Mathematics", "final_grade": 88}, ...]
#     :param default_grade: The grade to assume for any missing required subject (default is 50)
#     :return: A dictionary with strand names as keys and a dictionary as value.
#              The value contains:
#                - "strand_average": the computed average grade for that strand (0-100)
#                - "percentage": the relative percentage of the strand's average compared
#                                to the total of all strand averages, times 100.
#                - "missing_subjects": list of any required subjects not found (if any)
#     """
#     # Define the required subjects for each strand.
#     STRAND_REQUIREMENTS = {
#         "STEM": ["Mathematics", "Science", "TLE"],
#         "ABM": ["Mathematics", "English", "TLE"],
#         "HUMSS": ["Filipino", "Araling Panlipunan", "English"],
#         "GAS": ["Mathematics", "Science", "English", "Filipino", "Social Studies"],
#         "TVL": ["TLE", "Mathematics", "Science"]
#     }

#     # Compute the average for each strand.
#     strand_averages = {}
#     missing_subjects_all = {}
#     for strand, req_subjects in STRAND_REQUIREMENTS.items():
#         total = 0
#         missing = []
#         for subject in req_subjects:
#             normalized_req = normalize_subject(subject)
#             grade = None
#             for entry in extracted_data:
#                 if normalize_subject(entry.get("subject", "")) == normalized_req:
#                     try:
#                         grade = float(entry.get("final_grade", 0))
#                     except (ValueError, TypeError):
#                         grade = None
#                     break
#             if grade is None:
#                 missing.append(subject)
#                 total += default_grade
#             else:
#                 total += grade
#         average = total / len(req_subjects) if req_subjects else 0
#         strand_averages[strand] = average
#         missing_subjects_all[strand] = missing

#     # Sum of all strand averages.
#     total_avg_sum = sum(strand_averages.values())

#     # Calculate relative percentages.
#     predictions = {}
#     for strand, average in strand_averages.items():
#         percentage = (average / total_avg_sum) * 100 if total_avg_sum > 0 else 0

#         # Cap the maximum percentage to 25%
#         percentage = min(percentage, 25)

#         predictions[strand] = {
#             "strand_average": round(average, 2),
#             "percentage": round(percentage, 2)
#         }
#         if missing_subjects_all[strand]:
#             predictions[strand]["missing_subjects"] = missing_subjects_all[strand]

#     return predictions


# # Example usage for testing:
# if __name__ == "__main__":
#     extracted_data = [
#         {"subject": "Mathematics", "final_grade": 88},
#         {"subject": "SCIENCE", "final_grade": "89"},  # string value, now converted to float
#         {"subject": "English", "final_grade": 92},
#         {"subject": "Filipino", "final_grade": 87},
#         {"subject": "Social Studies", "final_grade": 90},
#         {"subject": "MAPEH", "final_grade": 95},
#         {"subject": "Values Education", "final_grade": 93},
#     ]
#     predictions = predict_strands(extracted_data)
#     print("Strand Predictions:", predictions)

def normalize_subject(text):
    """
    Normalize subject text by stripping extra spaces and converting to lowercase.
    """
    return text.strip().lower()


def predict_strands(extracted_data, default_grade=50):
    """
    Compute the average grade for each senior high strand based on extracted subjects and grades.

    This function now includes more specific strands within each track.

    :param extracted_data: List of dictionaries, each with keys "subject" and "final_grade"
                           e.g., [{"subject": "Mathematics", "final_grade": 88}, ...]
    :param default_grade: The grade to assume for any missing required subject (default is 50)
    :return: A dictionary with strand names as keys and a dictionary as value.
             The value contains:
               - "strand_average": the computed average grade for that strand (0-100)
               - "percentage": the relative percentage of the strand's average compared
                               to the total of all strand averages, times 100.
               - "missing_subjects": list of any required subjects not found (if any)
    """
    # Define the required subjects for each detailed strand.
    STRAND_REQUIREMENTS = {
        # Academic Track
        "STEM": ["Mathematics", "Science", "TLE"],
        "ABM": ["Mathematics", "English", "TLE"],
        "HUMSS": ["Filipino", "Araling Panlipunan", "English"],
        "GAS": ["Mathematics", "Science", "English", "Filipino", "Social Studies"],

        # TVL Track
        "Home Economics": ["TLE", "English", "Mathematics"],
        "ICT": ["TLE", "Mathematics", "Science",],
        "Industrial Arts": ["TLE", "Mathematics", "Science",],
        "Agri-Fishery Arts": ["TLE", "Science", "Biology"],
        "Cookery":["TLE"],

        # Arts and Design Track
        "Performing Arts": ["Music", "Arts", "Filipino", "English"],
        "Visual Arts": ["MAPEH", "English", "Mathematics"],
        "Media Arts": ["Arts", "English", "ICT"],
        "Literary Arts": ["English", "Filipino", "Social Studies"],

        # Sports Track
        "Sports": ["Physical Education", "Science", "Mathematics"]
    }

    # Compute the average for each strand.
    strand_averages = {}
    missing_subjects_all = {}

    for strand, req_subjects in STRAND_REQUIREMENTS.items():
        total = 0
        missing = []
        for subject in req_subjects:
            normalized_req = normalize_subject(subject)
            grade = None
            for entry in extracted_data:
                if normalize_subject(entry.get("subject", "")) == normalized_req:
                    try:
                        grade = float(entry.get("final_grade", 0))
                    except (ValueError, TypeError):
                        grade = None
                    break
            if grade is None:
                missing.append(subject)
                total += default_grade
            else:
                total += grade

        average = total / len(req_subjects) if req_subjects else 0
        strand_averages[strand] = average
        missing_subjects_all[strand] = missing

    # Sum of all strand averages.
    total_avg_sum = sum(strand_averages.values())

    # Calculate relative percentages.
    predictions = {}
    for strand, average in strand_averages.items():
        percentage = (average / total_avg_sum) * 100 if total_avg_sum > 0 else 0

        # Cap the maximum percentage to 25%
        percentage = min(percentage, 25)

        predictions[strand] = {
            "strand_average": round(average, 2),
            "percentage": round(percentage, 2)
        }
        if missing_subjects_all[strand]:
            predictions[strand]["missing_subjects"] = missing_subjects_all[strand]

    return predictions


# Example usage for testing:
if __name__ == "__main__":
    extracted_data = [
        {"subject": "Mathematics", "final_grade": 88},
        {"subject": "SCIENCE", "final_grade": "89"},  # string value, now converted to float
        {"subject": "English", "final_grade": 92},
        {"subject": "Filipino", "final_grade": 87},
        {"subject": "Social Studies", "final_grade": 90},
        {"subject": "MAPEH", "final_grade": 95},
        {"subject": "Values Education", "final_grade": 93},
        {"subject": "TLE", "final_grade": 85},
        {"subject": "Computer", "final_grade": 91},
        {"subject": "Physical Education", "final_grade": 94},
        {"subject": "Music", "final_grade": 88}
    ]

    predictions = predict_strands(extracted_data)
    print("Strand Predictions:", predictions)

