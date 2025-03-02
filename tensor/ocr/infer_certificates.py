try:
    from ocr.utils import perform_ocr
    print("perform_ocr successfully imported!")
except ImportError as e:
    print("Error importing perform_ocr:", str(e))
import re

def extract_relevant_keywords(image_path, use_easyocr=True):
    """
    Extract relevant keywords from certificates for SHS strand prediction.
    
    Performs OCR on the image and extracts keywords based on predefined patterns.
    
    Args:
        image_path (str): The path to the image file.
        use_easyocr (bool): Whether to use EasyOCR (if applicable).
    
    Returns:
        dict: A dictionary containing either {"extracted_keywords": [...]} or an error message.
    """
    # Step 1: Perform OCR on the image
    text_data = perform_ocr(image_path, use_easyocr)
    
    if not text_data:
        return {"error": "No text detected in the certificate."}
    
    # Debug: Print OCR output
    print("OCR Output:", text_data)
    
    extracted_keywords = set()
    
    # Ensure text_data is a list of strings
    if isinstance(text_data, dict):
        print("Unexpected dictionary data:", text_data)
        return {"error": "OCR output is in an unexpected format."}
    if not isinstance(text_data, list):
        print(f"Unexpected OCR output type: {type(text_data)}")
        return {"error": "Unexpected OCR output format."}
    
    # Define keyword patterns (pre-normalized to lowercase)
    strand_keywords = {
        "STEM": [kw.lower() for kw in ["Mathematics", "education", "Physics", "Engineering", "Biology", "Chemistry", "Robotics", "Programming", "Science Fair", "Research"]],
        "ABM": [kw.lower() for kw in ["Business", "Marketing", "Entrepreneurship", "Finance", "Accounting", "Management", "Economics", "Commerce"]],
        "HUMSS": [kw.lower() for kw in ["Social Sciences", "Debate", "Journalism", "Public Speaking", "Writing", "History", "Politics", "Literature", "Psychology"]],
        "TVL": [kw.lower() for kw in ["Technical", "Vocational", "Culinary", "Welding", "Automotive", "Electronics", "Hospitality", "Agriculture", "Tourism"]],
        "arts & design": [kw.lower() for kw in ["Painting", "Music", "Dance", "Theater", "Multimedia", "Photography", "Animation", "Film", "Graphic Design", "Creative Arts"]],
        "sports": [kw.lower() for kw in ["Athletics", "Basketball", "Football", "Volleyball", "Taekwondo", "Swimming", "Chess", "Sports Science", "Coaching", "Physical Education"]]
    }
    
    # Step 3: Process each text block from OCR output
    for text in text_data:
        if isinstance(text, dict):
            print(f"Unexpected dict inside text_data: {text}")
            continue
        if isinstance(text, str):
            processed_text = text.strip().lower()
        else:
            print(f"Unexpected non-string data: {text}")
            continue
        
        # Loop through each strand and its keywords
        for strand, keywords in strand_keywords.items():
            for keyword in keywords:
                # Use re.IGNORECASE to match regardless of case (even though text is lowercased)
                if re.search(rf'\b{keyword}\b', processed_text, re.IGNORECASE):
                    extracted_keywords.add(keyword)
    
    return {"extracted_keywords": list(extracted_keywords)}

# Example usage for testing:
if __name__ == "__main__":
    # Replace 'path/to/image.jpg' with the actual path to your image
    result = extract_relevant_keywords("path/to/image.jpg")
    print("Extracted Keywords:", result)
