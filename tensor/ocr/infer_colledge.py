import pytesseract
import re
import easyocr
from ocr.precolledgecert import preprocess_certificate

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def extract_text_from_certificate(image_path, use_easyocr=True):
    """Extract text from a certificate image using optimized OCR settings."""
    processed_image_path = preprocess_certificate(image_path)

    if use_easyocr:
        # Use EasyOCR for better text detection
        results = reader.readtext(processed_image_path, detail=0)
        extracted_text = " ".join(results)
    else:
        # Use Tesseract OCR with optimized config
        custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,-()"'
        extracted_text = pytesseract.image_to_string(processed_image_path, config=custom_config)
    
    # Post-processing: Normalize and clean extracted text
    extracted_text = extracted_text.replace("\n", " ").strip()
    extracted_text = " ".join(extracted_text.split())  # Remove extra spaces
    normalized_text = extracted_text.lower()
    
    return normalized_text
