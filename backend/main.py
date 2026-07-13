from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import os
import json
import io
import time
import logging
from treatments import get_treatment

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CropDoc API", version="1.0.0")

# CORS — allows React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://crop-disease-detection-ebon.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and class labels on startup
model = None
class_labels = None

@app.on_event("startup")
async def load_model():
    global model, class_labels
    try:
        model_path = "model/best_model.keras"
        labels_path = "model/class_labels.json"

        # Download from Hugging Face if not present locally
        if not os.path.exists(model_path):
            logger.info("Downloading model from Hugging Face...")
            import urllib.request
            os.makedirs("model", exist_ok=True)
            urllib.request.urlretrieve(
                "https://huggingface.co/MridulSharma02/cropdoc-model/resolve/main/best_model_v2.keras",
                model_path
            )
            logger.info("Model downloaded successfully")

        if not os.path.exists(labels_path):
            import urllib.request
            urllib.request.urlretrieve(
                "https://huggingface.co/MridulSharma02/cropdoc-model/resolve/main/class_labels.json",
                labels_path
            )

        model = tf.keras.models.load_model(model_path)
        with open(labels_path, "r") as f:
            class_labels = json.load(f)
        logger.info(f"Model loaded. Classes: {len(class_labels)}")
    except Exception as e:
        logger.error(f"Model loading failed: {e}")

def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def get_severity(disease_name: str, confidence: float) -> str:
    if "healthy" in disease_name.lower():
        return "None"
    if confidence > 0.85:
        return "High"
    elif confidence > 0.60:
        return "Medium"
    return "Low"

def parse_label(label: str) -> dict:
    parts = label.split("___")
    crop = parts[0].replace("_", " ").title() if len(parts) > 0 else "Unknown"
    disease = parts[1].replace("_", " ").title() if len(parts) > 1 else "Unknown"
    return {"crop": crop, "disease": disease}

@app.get("/")
async def root():
    return {"status": "CropDoc API is running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "classes": len(class_labels) if class_labels else 0
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    start_time = time.time()

    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        img_array = preprocess_image(image)

        # Run inference
        predictions = model.predict(img_array, verbose=0)
        predicted_idx = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))

        # Get top 3 predictions
        top3_indices = np.argsort(predictions[0])[-3:][::-1]
        top3 = [
            {
                "label": class_labels[str(i)],
                "confidence": float(predictions[0][i])
            }
            for i in top3_indices
        ]

        label = class_labels[str(predicted_idx)]
        parsed = parse_label(label)
        severity = get_severity(label, confidence)
        inference_time = round((time.time() - start_time) * 1000, 2)

        treatment_info = get_treatment(label)

        return {
            "success": True,
            "crop": parsed["crop"],
            "disease": parsed["disease"],
            "confidence": round(confidence * 100, 2),
            "severity": severity,
            "is_healthy": "healthy" in label.lower(),
            "top3": top3,
            "treatment": treatment_info["treatment"],
            "prevention": treatment_info["prevention"],
            "inference_time_ms": inference_time
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))