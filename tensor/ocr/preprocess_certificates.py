import cv2
import numpy as np
import pytesseract
import easyocr

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def preprocess_certificates_image(image_path, resize=True, blur=True, canny=False, thresholding=True, color=True):
    """Preprocess certificate images for OCR extraction."""
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError(f"Failed to load image: {image_path}")

    if resize:
        img = cv2.resize(img, (1600, 1200))  

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    if blur:
        gray = cv2.GaussianBlur(gray, (3, 3), 0)  

    if canny:
        gray = cv2.Canny(gray, 50, 150)  

    if thresholding:
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        gray = clahe.apply(gray)
        gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 9, 2)

    return img if color else gray

def extract_text(image_path, use_easyocr=True):
    """Extract text from certificate images."""
    processed_img = preprocess_certificates_image(image_path, color=False)

    if use_easyocr:
        results = reader.readtext(processed_img, detail=1)
        text_data = [text[1] for text in results if text[2] > 0.7]
    else:
        custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz% '
        text_data = pytesseract.image_to_string(processed_img, config=custom_config).split('\n')

    return [line.strip() for line in text_data if line.strip()]
