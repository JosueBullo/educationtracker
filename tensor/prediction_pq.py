# def predict_shs_strand(answers):
#     # Initialize strand scores
#     strand_scores = {
#         "STEM": 5, "ABM": 5, "HUMSS": 5, "GAS": 5, "Home Economics": 5, "ICT": 5,
#         "Industrial Arts": 5, "Agri-Fishery Arts": 5, "Cookery": 5, "Performing Arts": 5,
#         "Visual Arts": 5, "Media Arts": 5, "Literary Arts": 5, "Sports": 5
#     }

#     MAX_SCORE = 25  # Max score per strand

#     # Subject Strength (25%)
#     subject_to_strands = {
#         "Mathematics": {"STEM": 10, "ABM": 5, "GAS": 5, "ICT": 5, "Industrial Arts": 5, "Visual Arts": 5, "Sports": 5},
#         "Science": {"STEM": 10, "GAS": 5, "ICT": 5, "Industrial Arts": 5, "Agri-Fishery Arts": 5, "Sports": 5},
#         "English": {"HUMSS": 10, "ABM": 5, "GAS": 5, "Home Economics": 5, "Performing Arts": 5, "Visual Arts": 5, "Media Arts": 5, "Literary Arts": 5},
#         "Filipino": {"HUMSS": 10, "GAS": 5, "Performing Arts": 5, "Literary Arts": 5},
#         "Social Studies": {"HUMSS": 10, "GAS": 5, "Literary Arts": 5},
#         "TLE": {"STEM": 5, "ABM": 5, "Home Economics": 10, "ICT": 10, "Industrial Arts": 10, "Agri-Fishery Arts": 10, "Cookery": 10},
#         "MAPEH": {"Visual Arts": 5},
#         "Music": {"Performing Arts": 10},
#         "Arts": {"Performing Arts": 5, "Visual Arts": 10, "Media Arts": 5},
#         "Biology": {"Agri-Fishery Arts": 5},
#         "Physical Education": {"Sports": 10}
#     }

#     # Activity Preference (25%)
#     activity_to_strands = {
#         "Solving math problems and analyzing data": {"STEM": 10, "ABM": 5},
#         "Conducting science experiments and research": {"STEM": 10, "GAS": 5},
#         "Writing essays, stories, or public speaking": {"HUMSS": 10, "GAS": 5, "Literary Arts": 5},
#         "Managing business, marketing, or finances": {"ABM": 10, "Home Economics": 5},
#         "Working with technology, coding, or hands-on projects": {"STEM": 10, "ICT": 10, "Industrial Arts": 7},
#         "Helping others, teaching, or discussing social issues": {"HUMSS": 10, "GAS": 5},
#         "Playing sports and physical activities": {"Sports": 10}
#     }

#     # Career Goal (25%)
#     career_to_strands = {
#         "Engineer, Scientist, or IT professional": {"STEM": 10, "ICT": 5},
#         "Doctor, Nurse, or Health professional": {"STEM": 8, "HUMSS": 5},
#         "Business owner, Manager, or Accountant": {"ABM": 10, "Home Economics": 5},
#         "Teacher, Psychologist, or Lawyer": {"HUMSS": 10, "GAS": 5},
#         "Technician, Electrician, or Skilled worker": {"Industrial Arts": 10, "STEM": 5},
#         "Farmer, Fisherman, or Agricultural worker": {"Agri-Fishery Arts": 10},
#         "Chef, Baker, or Culinary Expert": {"Cookery": 10},
#         "Artist, Musician, or Performer": {"Performing Arts": 10, "Visual Arts": 10, "Media Arts": 5, "Literary Arts": 5},
#         "Athlete, Coach, or Sports Scientist": {"Sports": 10}
#     }

#     # Problem-Solving & Motivation (25%)
#     problem_solving_to_strands = {
#         "Using logic, numbers, and analysis": {"STEM": 10, "ABM": 5},
#         "Experimenting and testing different solutions": {"STEM": 10, "ICT": 7, "Industrial Arts": 7},
#         "Thinking creatively and coming up with unique ideas": {"HUMSS": 10, "GAS": 5, "Performing Arts": 5, "Visual Arts": 5},
#         "Discussing and debating different viewpoints": {"HUMSS": 10, "ABM": 5},
#         "Using hands-on skills and practical knowledge": {"TVL": 10, "GAS": 5}
#     }

#     # Helper function to update strand scores
#     def update_scores(mapping, answer):
#         if answer in mapping:
#             for strand, score in mapping[answer].items():
#                 strand_scores[strand] += score

#     # Apply mappings (update strand scores based on answers)
#     update_scores(subject_to_strands, answers.get("best-subject"))
#     update_scores(activity_to_strands, answers.get("preferred-activity"))
#     update_scores(career_to_strands, answers.get("career-goal"))
#     update_scores(problem_solving_to_strands, answers.get("problem-solving"))

#     # CAP THE MAX SCORE PER STRAND TO 25
#     for strand in strand_scores:
#         strand_scores[strand] = min(strand_scores[strand], MAX_SCORE)

#     # Predict based on highest score
#     predicted_strand = max(strand_scores, key=strand_scores.get)
#     strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

#     return predicted_strand, strand_scores_list


def predict_shs_strand(answers):
    # Initialize strand scores
    strand_scores = {
        "STEM": 5, "ABM": 5, "HUMSS": 5, "GAS": 5, "Home Economics": 5, "ICT": 5,
        "Industrial Arts": 5, "Agri-Fishery Arts": 5, "Cookery": 5, "Performing Arts": 5,
        "Visual Arts": 5, "Media Arts": 5, "Literary Arts": 5, "Sports": 5
    }

    MAX_SCORE = 25  # Maximum possible score for each strand

    # Subject Strength (25%)
    subject_to_strands = {
        "Mathematics": {"STEM": 10, "ABM": 5, "GAS": 5, "ICT": 5, "Industrial Arts": 5, "Sports": 5},
        "Science": {"STEM": 10, "GAS": 5, "ICT": 5, "Industrial Arts": 5, "Agri-Fishery Arts": 5, "Sports": 5},
        "English": {"HUMSS": 10, "ABM": 5, "GAS": 5, "Home Economics": 5, "Media Arts": 5, "Literary Arts": 5},
        "Filipino": {"HUMSS": 10, "GAS": 5, "Performing Arts": 5, "Literary Arts": 5},
        "Social Studies": {"HUMSS": 10, "GAS": 5, "Literary Arts": 5},
        "TLE": {"STEM": 5, "ABM": 5, "Home Economics": 10, "ICT": 10, "Industrial Arts": 10, "Agri-Fishery Arts": 10, "Cookery": 10},
        "MAPEH": {"Visual Arts": 5},
        "Music": {"Performing Arts": 10},
        "Arts": {"Performing Arts": 5, "Visual Arts": 10, "Media Arts": 5},
        "Biology": {"STEM": 5, "Agri-Fishery Arts": 5},
        "Physical Education": {"Sports": 10}
    }

    # Activity Preference (25%)
    activity_to_strands = {
        "Solving math problems and analyzing data": {"STEM": 10, "ABM": 5},
        "Conducting science experiments and research": {"STEM": 10, "GAS": 5},
        "Writing essays, stories, or public speaking": {"HUMSS": 10, "GAS": 5, "Literary Arts": 5},
        "Managing business, marketing, or finances": {"ABM": 10, "Home Economics": 5},
        "Working with technology, coding, or hands-on projects": {"STEM": 10, "ICT": 10, "Industrial Arts": 7},
        "Helping others, teaching, or discussing social issues": {"HUMSS": 10, "GAS": 5},
        "Playing sports and physical activities": {"Sports": 10}
    }

    # Career Goal (25%)
    career_to_strands = {
        "Engineer, Scientist, or IT professional": {"STEM": 10, "ICT": 5},
        "Doctor, Nurse, or Health professional": {"STEM": 8, "HUMSS": 5},
        "Business owner, Manager, or Accountant": {"ABM": 10, "Home Economics": 5},
        "Teacher, Psychologist, or Lawyer": {"HUMSS": 10, "GAS": 5},
        "Technician, Electrician, or Skilled worker": {"Industrial Arts": 10, "STEM": 5},
        "Farmer, Fisherman, or Agricultural worker": {"Agri-Fishery Arts": 10},
        "Chef, Baker, or Culinary Expert": {"Cookery": 10},
        "Artist, Musician, or Performer": {"Performing Arts": 10, "Visual Arts": 10, "Media Arts": 5, "Literary Arts": 5},
        "Athlete, Coach, or Sports Scientist": {"Sports": 10}
    }

    # Problem-Solving & Motivation (25%)
    problem_solving_to_strands = {
        "Using logic, numbers, and analysis": {"STEM": 10, "ABM": 5},
        "Experimenting and testing different solutions": {"STEM": 10, "ICT": 7, "Industrial Arts": 7},
        "Thinking creatively and coming up with unique ideas": {"HUMSS": 10, "GAS": 5, "Performing Arts": 5, "Visual Arts": 5},
        "Discussing and debating different viewpoints": {"HUMSS": 10, "ABM": 5},
        "Using hands-on skills and practical knowledge": {"Home Economics": 10, "GAS": 5}
    }

    # Helper function to update strand scores
    def update_scores(mapping, answer):
        if not answer:
            return  # Skip if the answer is missing
        if isinstance(answer, list):  
            answer = answer[0]  # Take the first value if it's a list
        if answer in mapping:
            for strand, score in mapping[answer].items():
                strand_scores[strand] += score

    # Apply mappings (update strand scores based on answers)
    update_scores(subject_to_strands, answers.get("best-subject"))
    update_scores(activity_to_strands, answers.get("preferred-activity"))
    update_scores(career_to_strands, answers.get("career-goal"))
    update_scores(problem_solving_to_strands, answers.get("problem-solving"))

    # CAP THE MAX SCORE PER STRAND TO 25
    for strand in strand_scores:
        strand_scores[strand] = min(strand_scores[strand], MAX_SCORE)

    # Predict based on highest score
    predicted_strand = max(strand_scores, key=strand_scores.get)

    # Normalize scores correctly
    max_possible = max(strand_scores.values())
    if max_possible > 0:
        for strand in strand_scores:
            strand_scores[strand] = round((strand_scores[strand] / max_possible) * 25, 2)

    # Format strand scores list
    strand_scores_list = [{"strand": key, "score": value} for key, value in strand_scores.items()]

    return {
        "predicted_strand": predicted_strand,
        "prediction_scores": strand_scores_list
    }
