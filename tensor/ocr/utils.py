import cv2
import pytesseract
import easyocr
import re

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def perform_ocr(image_path, use_easyocr=True):
    """
    Perform OCR on the given image.
    """
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Unable to load image from path: {image_path}")

    if use_easyocr:
        results = reader.readtext(img, detail=1)
        return [item[1] for item in results if item[2] > 0.7]
    else:
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(img, config=custom_config)
        return text.splitlines()


def detect_document_type(extracted_text):
    """
    Detects the document type based on the extracted text.
    
    :param extracted_text: The text extracted from the image, either as a list or a string.
    :return: A string indicating the document type ("grades", "certificate", or "unknown").
    """
    # If extracted_text is a list, join it into a single string
    if isinstance(extracted_text, list):
        extracted_text = " ".join(extracted_text)
    
    extracted_text = extracted_text.lower()
    
    # Check for keywords
    if re.search(r"\b(grade|report card|marks|score)\b", extracted_text):
        return "grades"
    elif re.search(r"\b(certificate|award|diploma|degree|completion)\b", extracted_text):
        return "certificate"
    else:
        return "unknown"
