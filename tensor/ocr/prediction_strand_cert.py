from collections import defaultdict

# Define keyword-track mapping for JHS
TRACK_KEYWORDS = {
    "STEM": [
        "mathematics", "science", "engineering", "technology", "physics", "biology", "chemistry", 
        "robotics", "programming", "science fair", "research", "innovation", "computer science", 
        "data science", "artificial intelligence", "machine learning", "environmental science", 
        "astronomy", "medical science", "nanotechnology", "electronics", "statistics", "coding", 
        "biotechnology", "quantum computing"
    ],
    "HUMSS": [
        "history", "politics", "literature", "philosophy", "social", "culture", "social sciences", 
        "debate", "journalism", "public speaking", "writing", "psychology", "communication", 
        "human rights", "international relations", "community development", "legal studies", 
        "sociology", "cultural studies", "linguistics", "creative writing", "anthropology", 
        "political science"
    ],
    "ABM": [
        "business", "finance", "marketing", "entrepreneurship", "management", "economics", 
        "commerce", "sales", "advertising", "e-commerce", "investment", "stock market", 
        "leadership", "corporate strategy", "supply chain", "business ethics", "public relations", 
        "business analytics"
    ],
    "TVL": [
        "vocational", "culinary", "agriculture", "hospitality", "tourism", "technical", "welding", 
        "automotive", "electronics", "food processing", "baking", "electrical installation", 
        "masonry", "plumbing", "carpentry", "tailoring", "housekeeping", "barista training", 
        "hotel management", "cosmetology", "cooking", "pastry arts"
    ],
    "GAS": [
        "interdisciplinary", "general studies", "multidisciplinary", "versatile learning", 
        "flexible curriculum", "exploratory", "critical thinking", "problem-solving", "leadership", 
        "creative innovation", "public speaking", "research skills", "decision making", 
        "career exploration", "adaptability", "project-based learning", "ethics and society", 
        "professional development"
    ]
}

def predict_jhs_track_cert(extracted_keywords):
    """
    Predicts the JHS track based on extracted keywords from certificates.
    
    Args:
        extracted_keywords (list): List of keywords from the certificates.
    
    Returns:
        dict: A dictionary with track scores.
    """
    track_scores = defaultdict(int)
    
    # Count occurrences of keywords in each track
    for keyword in extracted_keywords:
        for track, keywords in TRACK_KEYWORDS.items():
            if keyword.lower() in keywords:
                track_scores[track] += 1

    # Normalize scores to percentage
    total_score = sum(track_scores.values())
    if total_score > 0:
        for track in track_scores:
            track_scores[track] = (track_scores[track] / total_score) * 100

    return track_scores
