from collections import defaultdict

# Define keyword-strand mapping
STRAND_KEYWORDS = {
    "STEM": ["mathematics", "science", "engineering", "technology", "physics", "biology", "chemistry"],
    "HUMSS": ["history", "politics", "literature", "philosophy", "social", "culture"],
    "ABM": ["business", "finance", "marketing", "entrepreneurship", "management"],
    "TVL": ["vocational", "culinary", "agriculture", "hospitality", "tourism"],
    "Arts & Design": ["art", "design", "multimedia", "film", "music", "performing"],
    "Sports": ["athletics", "sports", "fitness", "physical", "coaching"]
}

def predict_shs_strand_cert(extracted_keywords):
    """
    Predicts the SHS strand based on extracted keywords from certificates.
    
    Args:
        extracted_keywords (list): List of keywords from the certificates.
    
    Returns:
        dict: A dictionary with strand scores.
    """
    strand_scores = defaultdict(int)
    
    # Count occurrences of keywords in each strand
    for keyword in extracted_keywords:
        for strand, keywords in STRAND_KEYWORDS.items():
            if keyword.lower() in keywords:
                strand_scores[strand] += 1

    # Normalize scores to percentage
    total_score = sum(strand_scores.values())
    if total_score > 0:
        for strand in strand_scores:
            strand_scores[strand] = (strand_scores[strand] / total_score) * 100

    return strand_scores
