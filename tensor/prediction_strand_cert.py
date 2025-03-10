from collections import defaultdict

# Define keyword-strand mapping (all keywords normalized to lowercase)
STRAND_KEYWORDS = {
    # Academic Track
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
    "GAS": [kw.lower() for kw in [
        "Interdisciplinary", "General Studies", "Multidisciplinary", "Versatile Learning", 
        "Flexible Curriculum", "Exploratory", "Critical Thinking", "Problem-Solving", "Leadership", 
        "Creative Innovation", "Public Speaking", "Research Skills", "Decision Making", "Career Exploration", 
        "Adaptability", "Project-Based Learning", "Ethics and Society", "Professional Development"
    ]],

    # TVL Track
    "Home Economics": [kw.lower() for kw in [
        "Technical", "Vocational", "Culinary", "Cooking", "Food Processing", "Baking", "Bread and Pastry",
        "Housekeeping", "Tourism", "Hotel Management", "Barista", "Caregiving", "Food and Beverage Services",
        "Fashion Design", "Tailoring", "Cosmetology", "Laundry Services", "Hospitality", "Restaurant Services"
    ]],
    "ICT": [kw.lower() for kw in [
        "Information Technology", "Computer Science", "Programming", "Animation", "Web Development", 
        "Cybersecurity", "Graphic Design", "Technical Drafting", "Network Administration", "Software Engineering", 
        "Computer Hardware Servicing", "Mobile App Development", "Database Management", "Cloud Computing"
    ]],
    "Industrial Arts": [kw.lower() for kw in [
        "Welding", "Automotive", "Electrical Installation", "Electronics", "Carpentry", "Plumbing", 
        "Masonry", "Mechanical Engineering", "Construction", "Metal Works", "Fabrication", "Woodworking",
        "Refrigeration and Air Conditioning", "Power Tools", "Machining"
    ]],
    "Agri-Fishery Arts": [kw.lower() for kw in [
        "Agriculture", "Animal Production", "Fisheries", "Aquaculture", "Horticulture", "Organic Farming",
        "Crop Science", "Farm Mechanics", "Agroforestry", "Dairy Farming", "Poultry", "Agri-Tech",
        "Soil Science", "Agro-Processing"
    ]],
    "Cookery": [kw.lower() for kw in [
        "Cooking", "Culinary Arts", "Food Safety", "Gastronomy", "Baking", "Pastry Arts", "Food Styling",
        "Restaurant Management", "International Cuisine", "Catering", "Professional Chef Training"
    ]],

    # Arts and Design Track
    "Performing Arts": [kw.lower() for kw in [
        "Dance", "Theater", "Music", "Acting", "Stage Performance", "Choreography", "Drama", "Opera",
        "Musical Theater", "Voice Training", "Instrumental Performance", "Concert Production"
    ]],
    "Visual Arts": [kw.lower() for kw in [
        "Painting", "Drawing", "Sculpture", "Photography", "Printmaking", "Design", "Illustration", 
        "Art History", "Digital Art", "Calligraphy", "Textile Arts", "Mural Painting"
    ]],
    "Media Arts": [kw.lower() for kw in [
        "Film", "Animation", "Graphic Design", "Cinematography", "Video Editing", "Broadcast Journalism", 
        "Photography", "Visual Storytelling", "Interactive Media", "Digital Media"
    ]],
    "Literary Arts": [kw.lower() for kw in [
        "Creative Writing", "Poetry", "Fiction", "Screenwriting", "Literature", "Essay Writing", 
        "Editing", "Publishing", "Speechwriting", "Drama Writing"
    ]],

    # Sports Track
    "Sports": [kw.lower() for kw in [
        "Athletics", "Coaching", "Physical Education", "Sports Science", "Sports Medicine", "Kinesiology",
        "Strength and Conditioning", "Team Sports", "Individual Sports", "Health and Fitness", 
        "Recreational Activities", "Olympic Training"
    ]]
}

def predict_shs_strand_cert(extracted_keywords, fixed_percentage=5, max_percentage=25):
    """
    Predicts the SHS strand based on extracted keywords, capping each strand at 25%.
    
    Args:
        extracted_keywords (list): List of keywords from the certificates.
        fixed_percentage (int): The percentage each matched keyword contributes.
        max_percentage (int): The maximum allowed percentage for any strand.

    Returns:
        dict: A dictionary with strand names as keys and percentage scores.
    """
    strand_scores = defaultdict(int)

    # Step 1: Assign percentage per keyword match
    for keyword in extracted_keywords:
        keyword_lower = keyword.lower()
        for strand, keywords in STRAND_KEYWORDS.items():
            if keyword_lower in keywords:
                strand_scores[strand] += fixed_percentage

    # Step 2: Cap each strand at max_percentage (25%)
    capped_scores = {strand: min(score, max_percentage) for strand, score in strand_scores.items()}

    # Step 3: Normalize to 100% if total exceeds 100%
    total_score = sum(capped_scores.values())
    if total_score > 100:
        capped_scores = {strand: (score / total_score) * 100 for strand, score in capped_scores.items()}

    return capped_scores

# Example usage for testing
if __name__ == "__main__":
    sample_keywords = ["MATHEMATICS", "science", "Robotics", "Business", "debate", "General Studies"]
    predictions = predict_shs_strand_cert(sample_keywords)
    print("Strand Predictions:", predictions)
