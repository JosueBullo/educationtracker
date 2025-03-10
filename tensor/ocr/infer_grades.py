# import re
# from ocr.preprocess_grades import extract_text

# def is_subject_name(text):
#     """
#     Returns True if the given text is likely a subject name.
#     Filters out lines that contain unwanted keywords or digits,
#     and limits the number of words.
#     """
#     text_lower = text.lower()
#     # Define keywords that indicate the line is not a subject name.
#     forbidden_keywords = ["remarks", "passed", "total", "average", "final", "grade", "score"]
#     if any(word in text_lower for word in forbidden_keywords):
#         return False
#     # Ignore text that contains digits (to filter out grades and numbers)
#     if re.search(r'\d', text):
#         return False
#     # If the line has more than 3 words, it's probably not just a subject name.
#     if len(text.split()) > 3:
#         return False
#     return True

# def extract_subjects_and_grades(image_path, use_easyocr=True):
#     """
#     Extract subjects and their final grade from the image.
    
#     This function uses OCR text extracted from the image and processes it line by line:
#       - Lines that are purely numeric are considered as grade values.
#       - Lines that pass is_subject_name() are captured as subject names.
#     Only the last numeric value found for each subject is kept.
#     """
#     # Step 1: Perform OCR on the image
#     text_data = extract_text(image_path, use_easyocr)
    
#     if not text_data:
#         return {"error": "No text detected in the grade sheet."}
    
#     subjects_grades = {}
#     temp_subject = None

#     print("\n🔍 Extracted Text Data for Grades:", text_data)

#     # Process each extracted text line
#     for text in text_data:
#         text = text.strip()
        
#         # If the text is purely a number (grade)
#         if re.match(r'^\d{1,3}(\.\d+)?$', text):
#             if temp_subject:
#                 # Overwrite with the most recent (final) grade for this subject
#                 subjects_grades[temp_subject] = float(text)
#         # Otherwise, check if the text qualifies as a subject name
#         elif text and is_subject_name(text):
#             # Clean the subject name by removing stray leading characters or digits
#             subject = re.sub(r'^[I|i]', '', text)
#             subject = re.sub(r'\d.*', '', subject)
#             temp_subject = subject.strip()
    
#     # Format the output as a list of dictionaries
#     formatted_output = [{"subject": subject, "final_grade": grade} for subject, grade in subjects_grades.items()]
#     return {"extracted_data": formatted_output}







# import re
# from ocr.preprocess_grades import extract_text

# def is_subject_name(text):
#     """
#     Determines if a given text is likely to be a subject name.
#     Filters out unwanted keywords, numbers, and long phrases.
#     """
#     text_lower = text.lower()
#     forbidden_keywords = [
#         "remarks", "passed", "total", "average", "final", "grade", "score",
#         "learning areas", "quarter", "final grade", "remarks", "adviser", "section",
#         "student", "name", "school year", "subject", "teacher", "units"
#     ]
    
#     if any(word in text_lower for word in forbidden_keywords):
#         return False
    
#     # Ignore lines containing digits (likely to be grades)
#     if re.search(r'\d', text):
#         return False
    
#     # Allow longer subject names (up to 7 words)
#     if len(text.split()) > 7:
#         return False
    
#     return True

# def extract_subjects_and_grades(image_path, use_easyocr=True):
#     """
#     Extracts subjects and their corresponding final grades from the given image.
#     Uses OCR text extraction and processes text line by line.
#     """
#     text_data = extract_text(image_path, use_easyocr)
    
#     if not text_data:
#         return {"error": "No text detected in the grade sheet."}
    
#     subjects_grades = {}
#     temp_subject = None

#     print("\n🔍 Extracted OCR Text for Grades:", text_data)

#     for text in text_data:
#         text = text.strip()
        
#         # Check if text is purely numeric (grade)
#         if re.match(r'^\d{1,3}(\.\d+)?$', text):
#             if temp_subject:
#                 subjects_grades[temp_subject] = float(text)
        
#         # Check if text qualifies as a subject name
#         elif text and is_subject_name(text):
#             subject = re.sub(r'^[I|i]', '', text)  # Remove leading 'I' or 'i'
#             subject = re.sub(r'\d.*', '', subject)  # Remove numbers at the end
#             temp_subject = subject.strip()
    
#     formatted_output = [{"subject": subject, "final_grade": grade} for subject, grade in subjects_grades.items()]
    
#     return {"extracted_data": formatted_output}





# import re
# from ocr.preprocess_grades import extract_text

# def is_subject_name(text):
#     """
#     Determines if a given text is likely to be a subject name.
#     """
#     text_lower = text.lower()
#     forbidden_keywords = [
#         "remarks", "passed", "total", "average", "final", "grade", "score",
#         "learning areas", "quarter", "adviser", "section",
#         "student", "name", "school year", "subject", "teacher", "units"
#     ]
    
#     if any(word in text_lower for word in forbidden_keywords):
#         return False
#     if re.search(r'\d', text):  # Ignore lines containing digits (grades)
#         return False
#     if len(text.split()) > 7:  # Limit subject names to 7 words max
#         return False
    
#     return True

# def extract_subjects_and_grades(image_path, use_easyocr=True):
#     """
#     Extracts subjects and corresponding final grades from the image.
#     """
#     text_data = extract_text(image_path, use_easyocr)
    
#     if not text_data:
#         print("Warning: No text detected in the grade sheet.")  # Debugging
#         return {"warning": "⚠️ The uploaded image does not appear to be a valid grade sheet. Please try again."}

#     subjects_grades = {}
#     temp_subject = None
    
#     for text in text_data:
#         text = text.strip()
        
#         if re.match(r'^\d{1,3}(\.\d+)?$', text):  # If it's a grade
#             if temp_subject:
#                 subjects_grades[temp_subject] = float(text)
#         elif text and is_subject_name(text):  # If it's a subject name
#             subject = re.sub(r'^[I|i]', '', text)  # Remove leading 'I' or 'i'
#             subject = re.sub(r'\d.*', '', subject)  # Remove numbers at the end
#             temp_subject = subject.strip()
    
#     formatted_output = [{"subject": subject, "final_grade": grade} for subject, grade in subjects_grades.items()]
    
#     if not formatted_output:  # No subjects or grades detected
#         print("Warning: Extracted data is empty.")  # Debugging
#         return {"warning": "⚠️ The uploaded image does not appear to be a valid grade sheet. Please try again."}

#     return {"extracted_data": formatted_output}


import re
from ocr.preprocess_grades import extract_text

def is_subject_name(text):
    """
    Determines if a given text is likely to be a subject name.
    """
    text_lower = text.lower()
    forbidden_keywords = [
        "remarks", "passed", "total", "average", "final", "grade", "score",
        "learning areas", "quarter", "adviser", "section",
        "student", "name", "school year", "subject", "teacher", "units"
    ]
    
    # If text contains common forbidden words, ignore it
    if any(word in text_lower for word in forbidden_keywords):
        return False
    
    # If the text is only numbers (likely grades), ignore it
    if re.fullmatch(r'^\d+$', text):
        return False

    # Allow subjects that mix letters and numbers (e.g., "Math 101")
    if re.search(r'[a-zA-Z]', text):  
        return True
    
    return False  # Otherwise, it's likely not a subject name

    
    return True  # Allow subjects even if they contain numbers

def extract_subjects_and_grades(image_path, use_easyocr=True):
    """
    Extracts subjects and corresponding final grades from the image.
    """
    text_data = extract_text(image_path, use_easyocr)
    
    if not text_data:
        print("Warning: No text detected in the grade sheet.")  # Debugging
        return {"warning": "⚠️ The uploaded image does not appear to be a valid grade sheet. Please try again."}

    subjects_grades = {}
    temp_subject = None

    for text in text_data:
        text = text.strip()

        # Check if it's a grade (numeric value)
        if re.match(r'^\d{1,3}(\.\d+)?$', text):
            if temp_subject:
                subjects_grades[temp_subject] = float(text)
                temp_subject = None  # Reset after assigning grade
        
        # If it's a subject name
        elif text and is_subject_name(text):
            # Keep subject names even if they contain numbers
            subject = re.sub(r'^[I|i]', '', text)  # Remove leading 'I' or 'i'
            temp_subject = subject.strip()  # Store for pairing with the next grade

    formatted_output = [{"subject": subject, "final_grade": grade} for subject, grade in subjects_grades.items()]

    if not formatted_output:  # No subjects or grades detected
        print("Warning: Extracted data is empty.")  # Debugging
        return {"warning": "⚠️ The uploaded image does not appear to be a valid grade sheet. Please try again."}

    return {"extracted_data": formatted_output}
