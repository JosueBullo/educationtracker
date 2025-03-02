from collections import defaultdict

# Define keyword-strand mapping (all keywords normalized to lowercase)
STRAND_KEYWORDS = {
    "STEM": [kw.lower() for kw in ["Mathematics", "education", "Physics", "Engineering", "Biology", "Chemistry", "Robotics", "Programming", "Science Fair", "Research"]],
    "ABM": [kw.lower() for kw in ["Business", "Marketing", "Entrepreneurship", "Finance", "Accounting", "Management", "Economics", "Commerce"]],
    "HUMSS": [kw.lower() for kw in ["Social Sciences", "Debate", "Journalism", "Public Speaking", "Writing", "History", "Politics", "Literature", "Psychology"]],
    "TVL": [kw.lower() for kw in ["Technical", "Vocational", "Culinary", "Welding", "Automotive", "Electronics", "Hospitality", "Agriculture", "Tourism"]],
    "Arts & Design": [kw.lower() for kw in ["Painting", "Music", "Dance", "Theater", "Multimedia", "Photography", "Animation", "Film", "Graphic Design", "Creative Arts"]],
    "Sports": [kw.lower() for kw in ["Athletics", "Basketball", "Football", "Volleyball", "Taekwondo", "Swimming", "Chess", "Sports Science", "Coaching", "Physical Education"]]
}

def predict_shs_strand_cert(extracted_keywords):
    """
    Predicts the SHS strand based on extracted keywords from certificates.
    
    Each required subject contributes a score that is normalized to a percentage.
    If any required subjects are missing, those subjects are indirectly indicated
    by lower scores.

    Args:
        extracted_keywords (list): List of keywords from the certificates.
                                   e.g., ["MATHEMATICS", "science", "robotics", ...]
    
    Returns:
        dict: A dictionary with strand names as keys and normalized percentage scores.
              For example: {"STEM": 70.0, "HUMSS": 30.0}
    """
    strand_scores = defaultdict(int)
    
    # Count occurrences of each keyword in the relevant strand
    for keyword in extracted_keywords:
        keyword_lower = keyword.lower()
        for strand, keywords in STRAND_KEYWORDS.items():
            if keyword_lower in keywords:
                strand_scores[strand] += 1

    # Normalize scores to percentage based on the total score count
    total_score = sum(strand_scores.values())
    normalized_scores = {}
    if total_score > 0:
        for strand, score in strand_scores.items():
            normalized_scores[strand] = (score / total_score) * 100
    return normalized_scores

# Example usage for testing:
if __name__ == "__main__":
    # Example keywords extracted from a certificate (in various cases)
    sample_keywords = ["MATHEMATICS", "science", "Robotics", "Business", "debate", "FOOTBALL"]
    predictions = predict_shs_strand_cert(sample_keywords)
    print("Strand Predictions:", predictions)
