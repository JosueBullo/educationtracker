import cv2
import numpy as np
import pytesseract
import easyocr

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def preprocess_certificate(image_path, resize=True, blur=True, canny=False, thresholding=True, color=True):
    """Enhance and preprocess a certificate image for improved OCR accuracy."""
    # Load the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Failed to load image: {image_path}")

    # Resize the image for consistent processing
    if resize:
        img = cv2.resize(img, (1600, 1200))

    # Convert to LAB color space and apply White Balance Correction
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
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

    # Apply Gaussian Blur to reduce noise
    if blur:
        gray = cv2.GaussianBlur(gray, (3, 3), 0)

    # Apply Canny Edge Detection (optional)
    if canny:
        gray = cv2.Canny(gray, 50, 150)

    # Adaptive Thresholding for better text contrast
    if thresholding:
        gray = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 10
        )

    # Edge-Preserving Smoothing to reduce noise while keeping text intact
    smooth = cv2.fastNlMeansDenoising(gray, None, h=20, templateWindowSize=7, searchWindowSize=21)

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

    return processed if not color else balanced_image

def extract_text(image_path, use_easyocr=True):
    """Extract text from certificate images using either EasyOCR or Tesseract."""
    processed_img = preprocess_certificate(image_path, color=False)

    if use_easyocr:
        # Use EasyOCR for text extraction
        results = reader.readtext(processed_img, detail=1)
        text_data = [text[1] for text in results if text[2] > 0.7]  # Filter by confidence score
    else:
        # Use Tesseract for text extraction
        custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz% '
        text_data = pytesseract.image_to_string(processed_img, config=custom_config).split('\n')

    # Clean and return the extracted text
    return [line.strip() for line in text_data if line.strip()]

# Example usage
if __name__ == "__main__":
    image_path = "certificate.jpg"
    preprocessed_image = preprocess_certificate(image_path)
    extracted_text = extract_text(image_path, use_easyocr=True)
    print("Extracted Text:", extracted_text)