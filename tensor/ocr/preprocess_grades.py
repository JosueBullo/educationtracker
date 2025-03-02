# import cv2
# import numpy as np
# import pytesseract
# import easyocr
# import re

# # Initialize EasyOCR reader
# reader = easyocr.Reader(['en'])

# def preprocess_grades_image(image_path, resize=True, blur=True, canny=True, thresholding=True, color=True):
#     """
#     Preprocess grade card images for OCR extraction.
    
#     Enhancements added:
#       - CLAHE (Contrast Limited Adaptive Histogram Equalization)
#       - Adaptive thresholding
#       - Morphological opening to remove small noise artifacts
      
#     Returns either the color image or the processed grayscale image.
#     """
#     img = cv2.imread(image_path)
#     if img is None:
#         raise ValueError(f"Unable to load image from {image_path}")

#     if resize:
#         # Resize to a consistent dimension
#         img = cv2.resize(img, (1500, 1100))
    
#     # Convert to grayscale
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
#     if blur:
#         # Gaussian blur to reduce noise
#         gray = cv2.GaussianBlur(gray, (5, 5), 0)
    
#     if canny:
#         # Optional edge detection (if useful for your OCR)
#         _ = cv2.Canny(gray, 100, 200)
    
#     if thresholding:
#         # Improve contrast using CLAHE
#         clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
#         gray = clahe.apply(gray)
#         # Apply adaptive thresholding to create a binary image
#         gray = cv2.adaptiveThreshold(
#             gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 11, 2
#         )
#         # Use morphological opening to remove small noise
#         kernel = np.ones((3, 3), np.uint8)
#         gray = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)
    
#     return img if color else gray

# def extract_text(image_path, use_easyocr=True):
#     """
#     Extract text from grade card images using EasyOCR (preferred) or Tesseract.
    
#     Returns a list of text strings.
#     """
#     processed_img = preprocess_grades_image(image_path, color=True)

#     if use_easyocr:
#         results = reader.readtext(processed_img, detail=1)
#         # Filter out results with low confidence
#         text_data = [item[1] for item in results if item[2] > 0.7]
#     else:
#         custom_config = r'--oem 3 --psm 6'
#         text = pytesseract.image_to_string(processed_img, config=custom_config)
#         text_data = text.splitlines()

#     return text_data

# def extract_subjects_and_grades(image_path, use_easyocr=True):
#     """
#     Extract subjects and their final grade from the image.
    
#     This function:
#       1. Calls extract_text() to perform OCR on the image.
#       2. Processes each text line:
#          - If the line is a numeric grade, it overwrites any previous grade for that subject.
#          - If the line is a subject name (without grade-like numbers), it is set as the current subject.
#       3. Returns a dictionary with a list of subjects and their final grade.
#     """
#     text_data = extract_text(image_path, use_easyocr)
    
#     if not text_data:
#         return {"error": "No text detected in the grade sheet."}
    
#     subjects_grades = {}
#     temp_subject = None

#     print("\n🔍 Extracted Text Data for Grades:", text_data)

#     for text in text_data:
#         text = text.strip()
#         # Check if the line is numeric (i.e., a grade)
#         if re.match(r'^\d{1,3}(\.\d+)?$', text):
#             if temp_subject:
#                 # Overwrite: the last number encountered for a subject is assumed to be the final grade.
#                 subjects_grades[temp_subject] = float(text)
#         # Otherwise, if the text is not grade-like, assume it’s a subject name
#         elif text and not re.search(r'\d{2,3}', text):
#             # Clean the subject name: remove leading characters like "I" and trailing numbers.
#             subject = re.sub(r'^[I|i]', '', text)
#             subject = re.sub(r'\d.*', '', subject)
#             temp_subject = subject.strip()
    
#     formatted_output = [{"subject": subject, "final_grade": grade} for subject, grade in subjects_grades.items()]
#     return {"extracted_data": formatted_output}

# def process_grades(image_path, use_easyocr=True):
#     """
#     Full pipeline for processing grade card images:
#       1. Preprocess the image.
#       2. Extract text for debugging.
#       3. Parse text to extract subjects and their final grade.
      
#     Returns a dictionary with the extracted data.
#     """
#     ocr_text = extract_text(image_path, use_easyocr)
#     print("\n[DEBUG] OCR Text for Grades:", ocr_text)
    
#     result = extract_subjects_and_grades(image_path, use_easyocr)
#     return result

# # Example usage:
# # result = process_grades("path/to/grade_sheet.jpg", use_easyocr=True)
# # print(result)


import cv2
import numpy as np
import pytesseract
import easyocr
import re

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def preprocess_grades_image(image_path, resize=True, noise_removal=True, adaptive_thresholding=True):
    """
    Preprocesses a grade card image for OCR by:
    - Resizing for consistency
    - Applying noise reduction
    - Using adaptive thresholding for better contrast
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Unable to load image from {image_path}")

    if resize:
        img = cv2.resize(img, (1500, 1100))
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    if noise_removal:
        gray = cv2.fastNlMeansDenoising(gray, None, 30, 7, 21)
    
    if adaptive_thresholding:
        gray = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
        )
    
    return gray

def extract_text(image_path, use_easyocr=True):
    """
    Extracts text from a grade card image using EasyOCR (preferred) or Tesseract.
    """
    processed_img = preprocess_grades_image(image_path)

    if use_easyocr:
        results = reader.readtext(processed_img, detail=1)
        text_data = [item[1] for item in results if item[2] > 0.7]  # Filter by confidence score
    else:
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(processed_img, config=custom_config)
        text_data = text.splitlines()

    return text_data
