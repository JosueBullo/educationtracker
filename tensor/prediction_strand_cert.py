from collections import defaultdict


# Define keyword-strand mapping (all keywords normalized to lowercase)
STRAND_KEYWORDS = {
    "STEM": [kw.lower() for kw in [
        "Mathematics", "Physics", "Engineering", "Biology", "Chemistry", "Robotics", "Programming", 
        "Science Fair", "Research", "Technology", "Innovation", "Computer Science", "Data Science", 
        "Artificial Intelligence", "Machine Learning", "Environmental Science", "Astronomy", "Medical Science",
        "Nanotechnology", "Electronics", "Statistics", "Coding", "Biotechnology", "Quantum Computing"
    ]],
    "ABM": [kw.lower() for kw in [
        "Business", "Marketing", "Entrepreneurship", "Finance", "Accounting", "Management", 
        "Economics", "Commerce", "Sales", "Advertising", "E-commerce", "Investment", "Stock Market", 
        "Leadership", "Corporate Strategy", "Supply Chain", "Business Ethics", "Public Relations", "Business Analytics"
    ]],
    "HUMSS": [kw.lower() for kw in [
        "Social Sciences", "Debate", "Journalism", "Public Speaking", "Writing", "History", 
        "Politics", "Literature", "Psychology", "Philosophy", "Communication", "Human Rights", 
        "International Relations", "Community Development", "Legal Studies", "Sociology", "Cultural Studies", 
        "Linguistics", "Creative Writing", "Anthropology", "Political Science"
    ]],
    "TVL": [kw.lower() for kw in [
        "Technical", "Vocational", "Culinary", "Welding", "Automotive", "Electronics", "Hospitality", 
        "Agriculture", "Tourism", "Food Processing", "Baking", "Electrical Installation", "Masonry", 
        "Plumbing", "Carpentry", "Tailoring", "Housekeeping", "Barista Training", "Hotel Management", 
        "Cosmetology", "Cooking", "Pastry Arts"
    ]],
    "GAS": [kw.lower() for kw in [
        "Interdisciplinary", "General Studies", "Multidisciplinary", "Versatile Learning", 
        "Flexible Curriculum", "Exploratory", "Critical Thinking", "Problem-Solving", "Leadership", 
        "Creative Innovation", "Public Speaking", "Research Skills", "Decision Making", "Career Exploration", 
        "Adaptability", "Project-Based Learning", "Ethics and Society", "Professional Development"
    ]]
}


def predict_shs_strand_cert(extracted_keywords):
    """
    Predicts the SHS strand based on extracted keywords from certificates.
    
    Args:
        extracted_keywords (list): List of keywords from the certificates.
                                   e.g., ["MATHEMATICS", "science", "robotics", ...]
    
    Returns:
        dict: A dictionary with strand names as keys and normalized percentage scores.
              Example: {"STEM": 25.0, "HUMSS": 15.0, "GAS": 10.0}
    """
    strand_scores = defaultdict(int)
    
    # Count occurrences of each keyword in the relevant strand
    for keyword in extracted_keywords:
        keyword_lower = keyword.lower()
        for strand, keywords in STRAND_KEYWORDS.items():
            if keyword_lower in keywords:
                strand_scores[strand] += 1

    # Normalize scores to percentage based on total keyword matches
    total_score = sum(strand_scores.values())
    normalized_scores = {}
    if total_score > 0:
        for strand, score in strand_scores.items():
            normalized_scores[strand] = (score / total_score) * 100
    
    # Cap the max score for any strand to 25%
    for strand in normalized_scores:
        normalized_scores[strand] = min(normalized_scores[strand], 25)

    return normalized_scores

# Example usage for testing
if __name__ == "__main__":
    sample_keywords = ["MATHEMATICS", "science", "Robotics", "Business", "debate", "General Studies"]
    predictions = predict_shs_strand_cert(sample_keywords)
    print("Strand Predictions:", predictions)
