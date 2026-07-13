<div align="center">

# 🌿 CropDoc — Crop Disease Detection

### AI-powered plant disease diagnosis for farmers & agronomists

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20App-22c55e?style=for-the-badge)](https://crop-disease-detection-ebon.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚡%20Backend%20API-Railway-7c3aed?style=for-the-badge)](https://crop-disease-detection-production-69ca.up.railway.app/health)
[![GitHub](https://img.shields.io/badge/GitHub-MridulSharma02-181717?style=for-the-badge&logo=github)](https://github.com/MridulSharma02/crop-disease-detection)

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)

---

> 📸 **Upload a leaf photo → Get instant disease diagnosis + treatment plan**
> 
> Built for Indian farmers. Powered by deep learning. Deployed for the real world.

</div>

---

## ✨ What is CropDoc?

**CropDoc** is a full-stack AI web application that detects crop diseases from leaf images in seconds. A farmer simply uploads a photo of a diseased leaf, and CropDoc:

- 🔍 **Identifies the disease** with up to 95% confidence
- 🌾 **Names the crop** automatically (Apple, Tomato, Corn, etc.)
- ⚠️ **Assesses severity** (Low / Medium / High risk)
- 💊 **Provides a treatment plan** with actionable steps

No agronomy knowledge needed. Just a photo.

---

## 🎯 Live Demo

| 🌐 Frontend | ⚡ Backend API |
|:-----------:|:--------------:|
| [crop-disease-detection-ebon.vercel.app](https://crop-disease-detection-ebon.vercel.app/) | [Railway API](https://crop-disease-detection-production-69ca.up.railway.app/health) |

---

## 🖼️ App Preview

| Upload Screen | Analysis | Results |
|:---:|:---:|:---:|
| Drop a leaf photo | 95% confidence AI scan | Disease + Treatment Plan |
| 📤 | 🔬 | 🌿 |

> **Example:** Apple leaf → *Black Rot detected* → 95% confidence → High Risk → 3-step treatment plan

---

## 🧠 How It Works

```
📸 User uploads leaf image
        ↓
🌐 Next.js frontend sends image to FastAPI backend
        ↓
🤖 EfficientNet model runs inference (trained on 54,000+ images)
        ↓
📊 Returns: disease name, confidence score, severity level
        ↓
💊 Treatment plan fetched from disease database
        ↓
✅ Results displayed beautifully on screen
```

---

## 🏗️ Tech Stack

### 🤖 AI / ML
| Component | Technology |
|-----------|-----------|
| Model Architecture | EfficientNet (Transfer Learning) |
| Training Framework | TensorFlow / Keras |
| Dataset | PlantVillage (54,000+ labeled images) |
| Classes | 38 disease categories across 14 crops |
| Model Accuracy | ~86% validation accuracy |
| Model Storage | Hugging Face Hub |

### 🔧 Backend
| Component | Technology |
|-----------|-----------|
| Framework | FastAPI (Python) |
| Image Processing | Pillow, NumPy |
| Model Serving | TensorFlow SavedModel |
| Deployment | Railway (Dockerized) |
| Container | Docker (python:3.11-slim) |

### 🎨 Frontend
| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (React) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Deployment | Vercel |
| Design | Mobile-first, farmer-friendly |

---

## 🌾 Supported Crops & Diseases

<details>
<summary>📋 Click to expand — 14 crops, 38 disease classes</summary>

| Crop | Diseases Detected |
|------|------------------|
| 🍎 Apple | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| 🌽 Corn | Cercospora Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| 🍇 Grape | Black Rot, Esca, Leaf Blight, Healthy |
| 🍊 Orange | Haunglongbing (Citrus Greening) |
| 🍑 Peach | Bacterial Spot, Healthy |
| 🫑 Bell Pepper | Bacterial Spot, Healthy |
| 🥔 Potato | Early Blight, Late Blight, Healthy |
| 🍓 Strawberry | Leaf Scorch, Healthy |
| 🍅 Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy |
| + more | Blueberry, Cherry, Mango, Soybean, Squash |

</details>

---

## 🚀 Getting Started Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1️⃣ Clone the repo
```bash
git clone https://github.com/MridulSharma02/crop-disease-detection.git
cd crop-disease-detection
```

### 2️⃣ Start the Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3️⃣ Start the Frontend
```bash
cd frontend
npm install
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

### 4️⃣ Open the app
```
http://localhost:3000
```

---

## 📁 Project Structure

```
crop-disease-detection/
├── 🔧 backend/
│   ├── main.py              # FastAPI app + prediction endpoint
│   ├── treatments.py        # Disease treatment database
│   ├── model/
│   │   ├── best_model_v2.keras   # Trained EfficientNet model
│   │   └── class_labels.json     # 38 disease class mappings
│   ├── Dockerfile           # Docker container config
│   ├── railway.json         # Railway deployment config
│   └── requirements.txt
│
├── 🎨 frontend/
│   ├── app/                 # Next.js app router
│   ├── components/
│   │   ├── image-uploader.tsx    # Drag & drop upload
│   │   ├── results-panel.tsx     # Disease results display
│   │   ├── loading-state.tsx     # Analysis animation
│   │   └── history-drawer.tsx    # Scan history
│   └── next.config.mjs
│
└── 📖 README.md
```

---

## 🔌 API Reference

### `GET /health`
Check if the backend is running.
```json
{
  "status": "CropDoc API is running",
  "version": "1.0.0"
}
```

### `POST /predict`
Upload a leaf image and get disease prediction.

**Request:** `multipart/form-data` with `file` field (JPG/PNG)

**Response:**
```json
{
  "disease": "Apple___Black_Rot",
  "confidence": 0.95,
  "crop": "Apple",
  "disease_name": "Black Rot",
  "severity": "high",
  "treatment": [
    "Remove mummified fruits and dead bark",
    "Apply copper-based fungicides",
    "Prune out infected branches 15cm below visible infection"
  ]
}
```

---

## 🧪 Model Training

The model was trained using **Transfer Learning** on EfficientNet:

- **Dataset:** PlantVillage (54,000+ images, 38 classes)
- **Architecture:** EfficientNet + custom classification head
- **Training:** Google Colab (GPU)
- **Augmentation:** Random flip, rotation, zoom, brightness
- **Validation Accuracy:** ~86%
- **Confidence on test images:** 85–95%

---

## 👨‍💻 Author

**Mridul Sharma**
- 🎓 B.Tech CSE (AI/ML) — 3rd Year
- 🐙 GitHub: [@MridulSharma02](https://github.com/MridulSharma02)

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

**⭐ If you found this useful, please star the repo!**

Made with 🌿 for Indian farmers

</div>