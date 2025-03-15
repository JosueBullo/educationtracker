import cv2
import numpy as np

def preprocess_certificate(image_path):
    """Enhance and preprocess a certificate image for improved OCR accuracy across different lighting and color backgrounds."""
    
    # Load the image
    image = cv2.imread(image_path)

    # Convert to LAB color space and apply White Balance Correction
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.equalizeHist(l)  # Normalize brightness
    balanced_lab = cv2.merge((l, a, b))
    balanced_image = cv2.cvtColor(balanced_lab, cv2.COLOR_LAB2BGR)

    # Convert to grayscale
    gray = cv2.cvtColor(balanced_image, cv2.COLOR_BGR2GRAY)

    # Adaptive Gamma Correction based on image intensity
    mean_intensity = np.mean(gray)
    gamma = 1.2 if mean_intensity > 150 else 1.5  # Adjust gamma dynamically
    inv_gamma = 1.0 / gamma
    table = np.array([(i / 255.0) ** inv_gamma * 255 for i in np.arange(0, 256)]).astype("uint8")
    gray = cv2.LUT(gray, table)

    # Apply CLAHE for local contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=3.5, tileGridSize=(8, 8))
    gray = clahe.apply(gray)

    # Adaptive Thresholding (adjusted window size for better text contrast)
    adaptive_thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 25, 10
    )

    # Edge-Preserving Smoothing to reduce noise while keeping text intact
    smooth = cv2.fastNlMeansDenoising(adaptive_thresh, None, h=20, templateWindowSize=7, searchWindowSize=21)

    # Apply a sharpening kernel to make text more legible
    sharpening_kernel = np.array([[0, -1, 0],
                                  [-1,  5, -1],
                                  [0, -1, 0]])
    sharp = cv2.filter2D(smooth, -1, sharpening_kernel)

    # Adaptive Morphology (Dilation & Erosion based on contrast)
    kernel_size = 1 if mean_intensity > 150 else 2
    kernel = np.ones((kernel_size, kernel_size), np.uint8)
    processed = cv2.morphologyEx(sharp, cv2.MORPH_CLOSE, kernel, iterations=1)

    # Save the preprocessed image
    preprocessed_path = image_path.replace(".png", "_processed.png").replace(".jpg", "_processed.jpg")
    cv2.imwrite(preprocessed_path, processed)

    return preprocessed_path
