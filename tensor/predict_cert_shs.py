from collections import defaultdict

# Define keyword-course mapping for SHS to College
COLLEGE_COURSE_KEYWORDS = {
    "BS Civil Engineering": [kw.lower() for kw in [
        "engineering", "civil", "construction", "structural", "infrastructure", "surveying"
    ]],
    "BS Mechanical Engineering": [kw.lower() for kw in [
        "engineering", "mechanical", "machinery", "automotive", "manufacturing", "thermodynamics"
    ]],
    "BS Electrical Engineering": [kw.lower() for kw in [
        "engineering", "electrical", "power", "electronics", "circuit", "energy"
    ]],
    "BS Electronics Engineering": [kw.lower() for kw in [
        "engineering", "electronics", "telecommunication", "circuit", "embedded systems", "signal processing"
    ]],
    "BS Industrial Engineering": [kw.lower() for kw in [
        "engineering", "industrial", "systems", "optimization", "manufacturing", "logistics"
    ]],
    "BS Aerospace Engineering": [kw.lower() for kw in [
        "engineering", "aerospace", "aviation", "aircraft", "rocketry", "flight"
    ]],

    "BS Nursing": [kw.lower() for kw in [
        "nursing", "healthcare", "hospital", "patient care", "medical", "nurse"
    ]],
    "BS Medical Technology": [kw.lower() for kw in [
        "medical technology", "laboratory", "diagnostics", "blood test", "clinical", "health science"
    ]],
    "BS Pharmacy": [kw.lower() for kw in [
        "pharmacy", "medicine", "drugs", "prescription", "pharmacology", "pharmacist"
    ]],
    "BS Radiologic Technology": [kw.lower() for kw in [
        "radiology", "x-ray", "mri", "ultrasound", "medical imaging", "radiologic"
    ]],
    "BS Physical Therapy": [kw.lower() for kw in [
        "physical therapy", "rehabilitation", "physiotherapy", "mobility", "exercise", "healthcare"
    ]],
    "Doctor of Medicine": [kw.lower() for kw in [
        "medicine", "doctor", "medical", "surgery", "hospital", "health"
    ]],
    "BS Midwifery": [kw.lower() for kw in [
        "midwifery", "childbirth", "pregnancy", "maternal", "baby", "nurse"
    ]],
    "BS Nutrition and Dietetics": [kw.lower() for kw in [
        "nutrition", "diet", "health", "food science", "meal planning", "wellness"
    ]],

    "BS Computer Science": [kw.lower() for kw in [
        "computer science", "programming", "coding", "software", "technology", "it"
    ]],
    "BS Information Technology": [kw.lower() for kw in [
        "information technology", "it", "networking", "systems", "database", "software"
    ]],
    "BS Software Engineering": [kw.lower() for kw in [
        "software engineering", "coding", "development", "programming", "technology", "apps"
    ]],
    "BS Data Science": [kw.lower() for kw in [
        "data science", "big data", "machine learning", "ai", "analytics", "statistics"
    ]],
    "BS Game Development": [kw.lower() for kw in [
        "game development", "gaming", "programming", "design", "animation", "3d"
    ]],
    "BS Cybersecurity": [kw.lower() for kw in [
        "cybersecurity", "hacking", "network security", "data protection", "encryption", "firewall"
    ]],
    "BS Artificial Intelligence": [kw.lower() for kw in [
        "artificial intelligence", "ai", "machine learning", "deep learning", "automation", "robotics"
    ]],

    "BS Business Administration": [kw.lower() for kw in [
        "business", "management", "finance", "marketing", "economics", "corporate"
    ]],
    "BS Accountancy": [kw.lower() for kw in [
        "accountancy", "finance", "taxation", "audit", "bookkeeping", "cpa"
    ]],
    "BS Marketing Management": [kw.lower() for kw in [
        "marketing", "branding", "advertising", "sales", "promotion", "consumer"
    ]],
    "BS Financial Management": [kw.lower() for kw in [
        "finance", "investment", "banking", "stock market", "money", "economics"
    ]],
    "BS Economics": [kw.lower() for kw in [
        "economics", "policy", "market", "trade", "finance", "business"
    ]],
    "BS Entrepreneurship": [kw.lower() for kw in [
        "entrepreneurship", "startup", "business", "innovation", "investment", "company"
    ]],
    "BS Human Resource Management": [kw.lower() for kw in [
        "human resources", "hr", "recruitment", "employment", "workforce", "personnel"
    ]],

    "Bachelor of Laws (LLB)": [kw.lower() for kw in [
        "law", "legal", "justice", "court", "attorney", "jurisprudence"
    ]],
    "BS Criminology": [kw.lower() for kw in [
        "criminology", "crime", "law enforcement", "forensics", "justice", "policing"
    ]],
    "BS Legal Management": [kw.lower() for kw in [
        "legal management", "law", "business law", "contracts", "corporate law", "justice"
    ]],
    "BS Public Administration": [kw.lower() for kw in [
        "public administration", "government", "policy", "public service", "law", "governance"
    ]],
    "BA International Relations": [kw.lower() for kw in [
        "international relations", "diplomacy", "foreign affairs", "global", "politics", "geopolitics"
    ]],
    "BA Political Science (Pre-Law)": [kw.lower() for kw in [
        "political science", "law", "policy", "government", "justice", "public service"
    ]],

    "BS Hotel & Restaurant Management": [kw.lower() for kw in [
        "hospitality", "hotel", "restaurant", "tourism", "food service", "management"
    ]],
    "BS Tourism Management": [kw.lower() for kw in [
        "tourism", "travel", "hospitality", "destination", "events", "management"
    ]],
    "BS Culinary Arts": [kw.lower() for kw in [
        "culinary", "cooking", "chef", "food", "baking", "restaurant"
    ]],
    "BS Travel Management": [kw.lower() for kw in [
        "travel", "tourism", "hospitality", "flight", "agency", "destination"
    ]],
    "BS Hospitality Management": [kw.lower() for kw in [
        "hospitality", "hotel", "management", "service", "tourism", "events"
    ]],
    "BS Cruise Line Operations": [kw.lower() for kw in [
        "cruise", "ship", "maritime", "hospitality", "tourism", "travel"
    ]],

    "BS Agriculture": [kw.lower() for kw in [
        "agriculture", "farming", "crops", "livestock", "agribusiness", "soil"
    ]],
    "BS Forestry": [kw.lower() for kw in [
        "forestry", "trees", "conservation", "ecosystem", "nature", "environment"
    ]],
    "BS Environmental Management": [kw.lower() for kw in [
        "environment", "sustainability", "conservation", "climate", "ecology", "nature"
    ]],
    "BS Fisheries": [kw.lower() for kw in [
        "fisheries", "aquaculture", "marine", "seafood", "fishery", "ocean"
    ]],
    "BS Agricultural Engineering": [kw.lower() for kw in [
        "agriculture", "engineering", "farming", "machinery", "irrigation", "soil"
    ]],
    "BS Agribusiness": [kw.lower() for kw in [
        "agribusiness", "farming", "market", "agriculture", "entrepreneurship", "trade"
    ]],
    "BA Literature": [kw.lower() for kw in [
        "literature", "writing", "poetry", "novel", "fiction", "literary analysis"
    ]],
    "BA Philosophy": [kw.lower() for kw in [
        "philosophy", "ethics", "logic", "metaphysics", "existentialism", "reasoning"
    ]],
    "BA Communication": [kw.lower() for kw in [
        "communication", "media", "public speaking", "journalism", "broadcasting", "interpersonal"
    ]],
    "BA Creative Writing": [kw.lower() for kw in [
        "creative writing", "fiction", "poetry", "storytelling", "novel", "scriptwriting"
    ]],
    
    "BS Elementary Education": [kw.lower() for kw in [
        "elementary education", "teaching", "pedagogy", "primary school", "lesson planning", "child development"
    ]],
    "BS Secondary Education Major in Mathematics": [kw.lower() for kw in [
        "education", "mathematics", "algebra", "calculus", "geometry", "teaching"
    ]],
    "BS Secondary Education Major in Science": [kw.lower() for kw in [
        "education", "science", "biology", "chemistry", "physics", "teaching"
    ]],
    "BS Special Education": [kw.lower() for kw in [
        "special education", "sped", "inclusive education", "disabilities", "teaching strategies", "individualized learning"
    ]],
    "BS Physical Education": [kw.lower() for kw in [
        "physical education", "sports", "fitness", "exercise", "coaching", "health"
    ]],
    "BS Early Childhood Education": [kw.lower() for kw in [
        "early childhood education", "preschool", "kindergarten", "child development", "teaching", "play-based learning"
    ]],

    "BS Biology": [kw.lower() for kw in [
        "biology", "life sciences", "genetics", "microbiology", "botany", "zoology"
    ]],
    "BS Chemistry": [kw.lower() for kw in [
        "chemistry", "chemical reactions", "organic chemistry", "laboratory", "molecules", "compounds"
    ]],
    "BS Physics": [kw.lower() for kw in [
        "physics", "mechanics", "thermodynamics", "quantum", "electromagnetism", "forces"
    ]],
    "BS Environmental Science": [kw.lower() for kw in [
        "environmental science", "ecology", "climate change", "sustainability", "conservation", "pollution"
    ]],
    "BS Applied Mathematics": [kw.lower() for kw in [
        "applied mathematics", "math", "statistics", "computation", "modelling", "theory"
    ]],
    "BS Statistics": [kw.lower() for kw in [
        "statistics", "data analysis", "probability", "quantitative research", "math", "analytics"
    ]],
    "BS Biochemistry": [kw.lower() for kw in [
        "biochemistry", "molecular biology", "genetics", "enzymes", "chemical processes", "lab research"
    ]]
}

def predict_college_course_cert(extracted_keywords):
    """
    Predicts the college course based on extracted keywords from SHS certificates.
    
    Args:
        extracted_keywords (list): List of keywords from the certificates.
    
    Returns:
        dict: A dictionary with course names as keys and normalized percentage scores.
    """
    course_scores = defaultdict(int)
    
    # Count occurrences of each keyword in the relevant course category
    for keyword in extracted_keywords:
        keyword_lower = keyword.lower()
        for course, keywords in COLLEGE_COURSE_KEYWORDS.items():
            if keyword_lower in keywords:
                course_scores[course] += 1

    # Normalize scores to percentage based on total keyword matches
    total_score = sum(course_scores.values())
    normalized_scores = {}
    if total_score > 0:
        for course, score in course_scores.items():
            normalized_scores[course] = (score / total_score) * 100
    
    # Cap the max score for any course category to 25%
    for course in normalized_scores:
        normalized_scores[course] = min(normalized_scores[course], 25)

    return normalized_scores

# Example usage for testing
if __name__ == "__main__":
    sample_keywords = ["Computer Science", "Artificial Intelligence", "Medicine", "Business", "Political Science"]
    predictions = predict_college_course_cert(sample_keywords)
    print("College Course Predictions:", predictions)
