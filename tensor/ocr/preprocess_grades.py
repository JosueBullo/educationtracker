
import cv2
import numpy as np
import pytesseract
import easyocr

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def preprocess_grades_image(image_path):
    """
    Enhances a grade card image for better OCR results:
    - Converts to grayscale
    - Uses bilateral filtering for noise removal while keeping edges
    - Applies adaptive thresholding for contrast improvement
    - Uses morphological operations to enhance text visibility
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Unable to load image from {image_path}")

    # Resize for consistency
    img = cv2.resize(img, (1500, 1100))

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply Bilateral Filtering (removes noise while preserving edges)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)

    # Improve contrast using CLAHE (Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    gray = clahe.apply(gray)

    # Apply Adaptive Thresholding for better OCR readability
    gray = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4
    )

    # Use Morphological Operations to enhance text visibility
    kernel = np.ones((2, 2), np.uint8)
    gray = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)

    return gray

def extract_text(image_path, use_easyocr=True):
    """
    Extracts text from a grade card image using EasyOCR (preferred) or Tesseract.
    """
    processed_img = preprocess_grades_image(image_path)
    
    if use_easyocr:
        results = reader.readtext(processed_img, detail=0)
        return results
    else:
        text = pytesseract.image_to_string(processed_img, config='--oem 3 --psm 6')
        return text.splitlines()
