def predict_shs_strand(answers):
    # Initialize strand scores
    strand_scores = {
        "STEM": 5, "ABM": 5, "HUMSS": 5, "GAS": 5, "TVL": 5
    }

    MAX_SCORE = 25  # Max score per strand

    # Subject Strength (25%)
    subject_to_strands = {
        "Mathematics": {"STEM": 10, "ABM": 5},
        "Science": {"STEM": 10, "HUMSS": 5},
        "English or Literature": {"HUMSS": 10, "ABM": 5},
        "Business and Economics": {"ABM": 10, "HUMSS": 5},
        "Technology and Computer Science": {"STEM": 10, "TVL": 7},
        "Social Studies or Philosophy": {"HUMSS": 10, "GAS": 5},
        "Physical Education and Sports": {"TVL": 7, "GAS": 5}
    }

    # Activity Preference (25%)
    activity_to_strands = {
        "Solving math problems and analyzing data": {"STEM": 10, "ABM": 5},
        "Conducting science experiments and research": {"STEM": 10, "HUMSS": 5},
        "Writing essays, stories, or public speaking": {"HUMSS": 10, "GAS": 5},
        "Managing business, marketing, or finances": {"ABM": 10, "TVL": 5},
        "Working with technology, coding, or hands-on projects": {"STEM": 10, "TVL": 7},
        "Helping others, teaching, or discussing social issues": {"HUMSS": 10, "GAS": 5}
    }

    # Career Goal (25%)
    career_to_strands = {
        "Engineer, Scientist, or IT professional": {"STEM": 10},
        "Doctor, Nurse, or Health professional": {"STEM": 8, "HUMSS": 5},
        "Business owner, Manager, or Accountant": {"ABM": 10, "TVL": 5},
        "Teacher, Psychologist, or Lawyer": {"HUMSS": 10, "GAS": 5},
        "Technician, Electrician, or Skilled worker": {"TVL": 10, "STEM": 5}
    }

    # Problem-Solving & Motivation (25%)
    problem_solving_to_strands = {
        "Using logic, numbers, and analysis": {"STEM": 10, "ABM": 5},
        "Experimenting and testing different solutions": {"STEM": 10, "TVL": 7},
        "Thinking creatively and coming up with unique ideas": {"HUMSS": 10, "GAS": 5},
        "Discussing and debating different viewpoints": {"HUMSS": 10, "ABM": 5},
        "Using hands-on skills and practical knowledge": {"TVL": 10, "GAS": 5}
    }

    career_motivation_to_strands = {
        "Earning a high salary": {"STEM": 5, "ABM": 5},
        "Doing something I love and enjoy": {"GAS": 5, "TVL": 5},
        "Helping others and making an impact": {"HUMSS": 5, "GAS": 3},
        "Having job security and stability": {"STEM": 5, "ABM": 3},
        "Being my own boss and having independence": {"ABM": 5, "TVL": 3}
    }

    # Helper function to update strand scores
    def update_scores(mapping, answer):
        if answer in mapping:
            for strand, score in mapping[answer].items():
                strand_scores[strand] += score

    # Apply mappings (update strand scores based on answers)
    update_scores(subject_to_strands, answers.get("best-subject"))
    update_scores(activity_to_strands, answers.get("preferred-activity"))
    update_scores(career_to_strands, answers.get("career-goal"))
    update_scores(problem_solving_to_strands, answers.get("problem-solving"))
    update_scores(career_motivation_to_strands, answers.get("career-motivation"))

    # Preferred SHS Strand (adds small weight to preference)
    preferred_strand = answers.get("shs-strand")
    if preferred_strand in strand_scores:
        strand_scores[preferred_strand] += 5  

    # Confidence in Career Choice (adjust impact)
    confidence_weight = {
        "Very confident – I already know my path": 5,
        "Somewhat confident – I have an idea but need more information": 3,
        "Unsure – I am still exploring my options": 2,
        "Not confident – I have no idea what I want to do yet": 0
    }
    career_confidence = answers.get("career-confidence")
    if career_confidence in confidence_weight:
        for strand in strand_scores:
            strand_scores[strand] += confidence_weight[career_confidence]

    # CAP THE MAX SCORE PER STRAND TO 25
    for strand in strand_scores:
        strand_scores[strand] = min(strand_scores[strand], MAX_SCORE)

    # Normalize scores (Convert to percentage out of 25)
    total_score = sum(strand_scores.values())
    if total_score > 0:
        for strand in strand_scores:
            strand_scores[strand] = round((strand_scores[strand] / total_score) * 25, 2)

    # Debugging: Print strand scores for better tracking
    print("Final Strand Scores:", strand_scores)

    # Predict based on highest score
    predicted_strand = max(strand_scores, key=strand_scores.get)
    strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

    # Print final result to terminal
    print(f"Predicted SHS Strand: {predicted_strand}")
    print(f"Strand Scores List: {strand_scores_list}")

    return predicted_strand, strand_scores_list
