# def predict_grades_shs_tocollege(extracted_data):
#     """
#     Predicts suitable college courses based on SHS students' grades, considering only subjects.
#     Each required subject contributes a maximum of 25%.

#     :param extracted_data: List of dictionaries, each with keys "subject" and "final_grade".
#     :return: Dictionary with course categories and specific course predictions.
#     """
#     # Define course requirements based on subjects
#     COURSE_REQUIREMENTS = {
#         "Engineering & Technology": ["Pre-Calculus", "Basic Calculus", "General Physics 1", "General Physics 2"],
#         "Medical & Health Sciences": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
#         "Computer Science & IT": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
#         "Business & Finance": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
#         "Arts & Humanities": ["Creative Writing", "Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
#         "Law & Legal Studies": ["Philippine Politics and Governance", "Disciplines and Ideas in Applied Social Sciences"],
#         "Education & Teaching": ["Disciplines and Ideas in Social Sciences", "Creative Writing"],
#         "Science & Research": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
#         "Hospitality & Tourism": ["Cookery", "Bread and Pastry Production", "Entrepreneurship"],
#         "Agriculture & Environmental Studies": ["General Biology 1", "General Biology 2", "Entrepreneurship"]
#     }

#     # Specific courses under each category
#     SPECIFIC_COURSES = {
#         "Engineering & Technology": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
#         "Medical & Health Sciences": ["Medicine", "Nursing", "Pharmacy"],
#         "Computer Science & IT": ["Computer Science", "Information Technology", "Data Science"],
#         "Business & Finance": ["Business Administration", "Accountancy", "Marketing"],
#         "Arts & Humanities": ["Political Science", "Psychology", "Sociology"],
#         "Law & Legal Studies": ["Bachelor of Laws", "Criminology", "International Relations"],
#         "Education & Teaching": ["Elementary Education", "Secondary Education", "Special Education"],
#         "Science & Research": ["Biology", "Chemistry", "Physics"],
#         "Hospitality & Tourism": ["Hotel & Restaurant Management", "Tourism Management", "Culinary Arts"],
#         "Agriculture & Environmental Studies": ["Agriculture", "Forestry", "Environmental Management"],
#     }

#     predictions = {}

#     for category, req_subjects in COURSE_REQUIREMENTS.items():
#         total_contribution = 0
#         total_possible = len(req_subjects) * 25  # Maximum possible contribution

#         for subject in req_subjects:
#             grade = next((entry["final_grade"] for entry in extracted_data if entry["subject"].strip().lower() == subject.lower()), None)
#             contribution = (grade / 100) * 25 if grade is not None else 0
#             total_contribution += contribution

#         # Normalize percentage (max 25%)
#         percentage = (total_contribution / total_possible) * 25 if total_possible > 0 else 0

#         predictions[category] = {
#             "percentage": round(percentage, 2),
#             "specific_courses": SPECIFIC_COURSES.get(category, [])
#         }

#     return predictions

# # Example usage:
# if __name__ == "__main__":
#     extracted_data = [
#         {"subject": "Pre-Calculus", "final_grade": 92},
#         {"subject": "General Biology 1", "final_grade": 85},
#         {"subject": "General Chemistry 1", "final_grade": 88},
#         {"subject": "Applied Economics", "final_grade": 80},
#         {"subject": "Business Mathematics", "final_grade": 78},
#         {"subject": "Philippine Politics and Governance", "final_grade": 82},
#         {"subject": "Fundamentals of Accountancy, Business, and Management 1", "final_grade": 90},
#         {"subject": "Entrepreneurship", "final_grade": 89},
#         {"subject": "Computer Systems Servicing", "final_grade": 95}
#     ]

#     predictions = predict_grades_shs_tocollege(extracted_data)
#     print("College Course Predictions:", predictions)




def predict_grades_shs_tocollege(extracted_data):
    """
    Predicts suitable college courses based on SHS students' grades, considering only subjects.
    Each required subject contributes a maximum of 25%.

    :param extracted_data: List of dictionaries, each with keys "subject" and "final_grade".
    :return: Dictionary with course categories and specific course predictions.
    """
    # Define course requirements based on subjects
    COURSE_REQUIREMENTS = {
    "BS Civil Engineering": ["Pre-Calculus", "Basic Calculus", "General Physics 1", "General Physics 2"],
    "BS Mechanical Engineering": ["Pre-Calculus", "Basic Calculus", "General Physics 1", "General Physics 2"],
    "BS Electrical Engineering": ["Pre-Calculus", "Basic Calculus", "General Physics 1", "General Physics 2"],
    "BS Electronics Engineering": ["Pre-Calculus", "Basic Calculus", "General Physics 1", "General Physics 2"],
    "BS Industrial Engineering": ["Pre-Calculus", "Basic Calculus", "General Physics 1", "General Physics 2"],
    "BS Aerospace Engineering": ["Pre-Calculus", "Basic Calculus", "General Physics 1", "General Physics 2"],
    
    "Bachelor in Nursing": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    "Bachelor in Medical Technology": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    "Bachelor in Pharmacy": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    "Bachelor in Radiologic Technology": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    "Bachelor in Physical Therapy": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    "Doctor in Medicine": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    "Bachelor in Midwifery": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    "Bachelor in Nutrition and Dietetics": ["General Biology 1", "General Biology 2", "General Chemistry 1", "General Chemistry 2"],
    
    "Bachelor in Computer Science": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
    "Bachelor in Information Technology": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
    "Bachelor in Software Engineering": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
    "Bachelor in Data Science": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
    "Bachelor in Game Development": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
    "Bachelor in Cybersecurity": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
    "Bachelor in Artificial Intelligence": ["Business Mathematics", "Computer Systems Servicing", "Entrepreneurship"],
    
    "Bachelor in Business Administration": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
    "Bachelor in Accountancy": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
    "Bachelor in Marketing Management": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
    "Bachelor in Financial Management": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
    "Bachelor in Economics": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
    "Bachelor in Entrepreneurship": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
    "Bachelor in Human Resource Management": ["Business Mathematics", "Applied Economics", "Fundamentals of Accountancy, Business, and Management 1"],
    
    "Bachelor in Political Science": ["Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
    "Bachelor in Psychology": ["Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
    "Bachelor in Sociology": ["Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
    "Bachelor in Literature": ["Creative Writing", "Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
    "Bachelor in Philosophy": ["Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
    "Bachelor in Communication": ["Creative Writing", "Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
    "Bachelor in Creative Writing": ["Creative Writing", "Philippine Politics and Governance", "Disciplines and Ideas in Social Sciences"],
    
    "Bachelor in Laws (LLB)": ["Philippine Politics and Governance", "Disciplines and Ideas in Applied Social Sciences"],
    "Bachelor in Criminology": ["Philippine Politics and Governance", "Disciplines and Ideas in Applied Social Sciences"],
    "Bachelor in Legal Management": ["Philippine Politics and Governance", "Disciplines and Ideas in Applied Social Sciences"],
    "Bachelor in Public Administration": ["Philippine Politics and Governance", "Disciplines and Ideas in Applied Social Sciences"],
    "Bachelor in International Relations": ["Philippine Politics and Governance", "Disciplines and Ideas in Applied Social Sciences"],
    "Bachelor in Political Science (Pre-Law)": ["Philippine Politics and Governance", "Disciplines and Ideas in Applied Social Sciences"],
    
    "Bachelor in Elementary Education": ["Disciplines and Ideas in Social Sciences", "Creative Writing"],
    "Bachelor in Secondary Education Major in Mathematics": ["Disciplines and Ideas in Social Sciences", "Creative Writing"],
    "Bachelor in Secondary Education Major in Science": ["Disciplines and Ideas in Social Sciences", "Creative Writing"],
    "Bachelor in Special Education": ["Disciplines and Ideas in Social Sciences", "Creative Writing"],
    "Bachelor in Physical Education": ["Disciplines and Ideas in Social Sciences", "Creative Writing"],
    "Bachelor in Early Childhood Education": ["Disciplines and Ideas in Social Sciences", "Creative Writing"],
    
    "Bachelor in Biology": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
    "Bachelor in Chemistry": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
    "Bachelor in Physics": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
    "Bachelor in Environmental Science": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
    "Bachelor in Applied Mathematics": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
    "Bachelor in Statistics": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
    "Bachelor in Biochemistry": ["General Biology 1", "General Chemistry 1", "General Physics 1", "Basic Calculus"],
    
    "Bachelor in Hotel & Restaurant Management": ["Cookery", "Bread and Pastry Production", "Entrepreneurship"],
    "Bachelor in Tourism Management": ["Cookery", "Bread and Pastry Production", "Entrepreneurship"],
    "Bachelor in Culinary Arts": ["Cookery", "Bread and Pastry Production", "Entrepreneurship"],
    "Bachelor in Travel Management": ["Cookery", "Bread and Pastry Production", "Entrepreneurship"],
    "Bachelor in Hospitality Management": ["Cookery", "Bread and Pastry Production", "Entrepreneurship"],
    "Bachelor in Cruise Line Operations": ["Cookery", "Bread and Pastry Production", "Entrepreneurship"],
    
    "Bachelor in Agriculture": ["General Biology 1", "General Biology 2", "Entrepreneurship"],
    "Bachelor in Forestry": ["General Biology 1", "General Biology 2", "Entrepreneurship"],
    "Bachelor in Environmental Management": ["General Biology 1", "General Biology 2", "Entrepreneurship"],
    "Bachelor in Fisheries": ["General Biology 1", "General Biology 2", "Entrepreneurship"],
    "Bachelor in Agricultural Engineering": ["General Biology 1", "General Biology 2", "Entrepreneurship"],
    "Bachelor in Agribusiness": ["General Biology 1", "General Biology 2", "Entrepreneurship"]
}


    # Detailed specific courses under each category
    SPECIFIC_COURSES = {
    "BS Civil Engineering": [],
    "BS Mechanical Engineering": [],
    "BS Electrical Engineering": [],
    "BS Electronics Engineering": [],
    "BS Industrial Engineering": [],
    "BS Aerospace Engineering": [],
    
    "BS Nursing": [],
    "BS Medical Technology": [],
    "BS Pharmacy": [],
    "BS Radiologic Technology": [],
    "BS Physical Therapy": [],
    "Doctor of Medicine": [],
    "BS Midwifery": [],
    "BS Nutrition and Dietetics": [],
    
    "BS Computer Science": [],
    "BS Information Technology": [],
    "BS Software Engineering": [],
    "BS Data Science": [],
    "BS Game Development": [],
    "BS Cybersecurity": [],
    "BS Artificial Intelligence": [],
    
    "BS Business Administration": [],
    "BS Accountancy": [],
    "BS Marketing Management": [],
    "BS Financial Management": [],
    "BS Economics": [],
    "BS Entrepreneurship": [],
    "BS Human Resource Management": [],
    
    "BA Political Science": [],
    "BA Psychology": [],
    "BA Sociology": [],
    "BA Literature": [],
    "BA Philosophy": [],
    "BA Communication": [],
    "BA Creative Writing": [],
    
    "Bachelor of Laws (LLB)": [],
    "BS Criminology": [],
    "BS Legal Management": [],
    "BS Public Administration": [],
    "BA International Relations": [],
    "BA Political Science (Pre-Law)": [],
    
    "BS Elementary Education": [],
    "BS Secondary Education Major in Mathematics": [],
    "BS Secondary Education Major in Science": [],
    "BS Special Education": [],
    "BS Physical Education": [],
    "BS Early Childhood Education": [],
    
    "BS Biology": [],
    "BS Chemistry": [],
    "BS Physics": [],
    "BS Environmental Science": [],
    "BS Applied Mathematics": [],
    "BS Statistics": [],
    "BS Biochemistry": [],
    
    "BS Hotel & Restaurant Management": [],
    "BS Tourism Management": [],
    "BS Culinary Arts": [],
    "BS Travel Management": [],
    "BS Hospitality Management": [],
    "BS Cruise Line Operations": [],
    
    "BS Agriculture": [],
    "BS Forestry": [],
    "BS Environmental Management": [],
    "BS Fisheries": [],
    "BS Agricultural Engineering": [],
    "BS Agribusiness": []
    }


    predictions = {}

    for category, req_subjects in COURSE_REQUIREMENTS.items():
        total_contribution = 0
        total_possible = len(req_subjects) * 25  # Maximum possible contribution 

        for subject in req_subjects:
            grade = next((entry["final_grade"] for entry in extracted_data if entry["subject"].strip().lower() == subject.lower()), None)
            contribution = (grade / 100) * 25 if grade is not None else 0
            total_contribution += contribution

        # Normalize percentage (max 25%)
        percentage = (total_contribution / total_possible) * 25 if total_possible > 0 else 0

        predictions[category] = {
            "percentage": round(percentage, 2),
            "specific_courses": SPECIFIC_COURSES.get(category, [])
        }

    return predictions

# Example usage:
if __name__ == "__main__":
    extracted_data = [
        {"subject": "Pre-Calculus", "final_grade": 92},
        {"subject": "General Biology 1", "final_grade": 85},
        {"subject": "General Chemistry 1", "final_grade": 88},
        {"subject": "Applied Economics", "final_grade": 80},
        {"subject": "Business Mathematics", "final_grade": 78},
        {"subject": "Philippine Politics and Governance", "final_grade": 82},
        {"subject": "Fundamentals of Accountancy, Business, and Management 1", "final_grade": 90},
        {"subject": "Entrepreneurship", "final_grade": 89},
        {"subject": "Computer Systems Servicing", "final_grade": 95}
    ]

    predictions = predict_grades_shs_tocollege(extracted_data)
    print("College Course Predictions:", predictions)

