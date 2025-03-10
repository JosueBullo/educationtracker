import re
from ocr.utils import perform_ocr

def extract_relevant_keywords(image_path, use_easyocr=True):
    """
    Extract relevant keywords from certificates for career prediction.
    
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
    
    extracted_keywords = set()
    
    # Ensure text_data is a list of strings
    if isinstance(text_data, dict) or not isinstance(text_data, list):
        return {"error": "Unexpected OCR output format."}
    
    # Define a comprehensive list of career and seminar-related keywords
    career_keywords = [
        "engineering", "programming", "healthcare", "business", "management", "marketing", "finance", 
        "accounting", "economics", "entrepreneurship", "data science", "artificial intelligence", 
        "machine learning", "cybersecurity", "software development", "nursing", "pharmacy", 
        "medical technology", "radiology", "physical therapy", "medicine", "midwifery", "nutrition", 
        "dietetics", "computer science", "information technology", "game development", "robotics", 
        "education", "teaching", "research", "biology", "chemistry", "physics", "environmental science", 
        "mathematics", "statistics", "biochemistry", "hospitality", "tourism", "culinary arts", 
        "agriculture", "forestry", "fisheries", "agribusiness", "law", "criminology", "public administration", 
        "international relations", "political science", "psychology", "sociology", "literature", 
        "philosophy", "communication", "creative writing", "design", "art", "music", "film", "journalism",
        
        # Seminar-specific keywords
        "certificate of participation", "certificate of completion", "certificate of attendance", 
        "professional development", "workshop", "training program", "continuing education", "skills enhancement", 
        "seminar series", "conference", "webinar", "guest speaker", "expert panel", "industry insights", 
        "career advancement", "learning session", "technical training", "leadership training", "strategic planning", 
        "project management", "entrepreneurship", "business innovation", "customer service excellence", 
        "sales and marketing", "financial literacy", "business analytics", "corporate leadership", "negotiation skills", 
        "public speaking", "effective communication", "time management", "organizational development", 
        "medical training", "nursing conference", "first aid certification", "healthcare management", 
        "mental health awareness", "patient care", "clinical research", "public health and safety", "pharmaceutical sciences", 
        "radiologic technology", "biomedical innovations", "COVID-19 response training", "teaching methodologies", 
        "curriculum development", "classroom management", "online teaching strategies", "inclusive education", 
        "TESOL certification", "student engagement", "early childhood education", "pedagogical training", 
        "STEM education", "safety training", "quality assurance", "civil engineering innovations", "renewable energy solutions", 
        "mechanical design principles", "automation and robotics", "sustainable engineering", "environmental impact assessment", 
        "industrial safety certification", "aerospace technology", "law and ethics", "criminology and forensic studies", 
        "social justice advocacy", "public administration", "human rights awareness", "policy making", 
        "criminal investigation techniques", "disaster risk management", "investment strategies", "financial management", 
        "risk assessment", "economic trends", "market analysis", "banking and finance", "personal finance literacy", 
        "cryptocurrency and digital assets"
    ]
    
    # Step 3: Process each text block from OCR output
    for text in text_data:
        if isinstance(text, str):
            processed_text = text.strip().lower()
            
            # Loop through each keyword and check for matches
            for keyword in career_keywords:
                if re.search(rf'\b{keyword}\b', processed_text, re.IGNORECASE):
                    extracted_keywords.add(keyword)
    
    return {"extracted_keywords": list(extracted_keywords)}

if __name__ == "__main__":
    image_path = "path/to/image.jpg"  # Update with actual path
    result = extract_relevant_keywords(image_path)
    print("Extracted Keywords:", result)
