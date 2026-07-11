import type { DiseaseResult } from '@/components/results-panel'

export type DiseaseTemplate = Omit<DiseaseResult, 'id' | 'timestamp' | 'imagePreview'>

export const DISEASE_DATABASE: DiseaseTemplate[] = [
  {
    name: 'Late Blight',
    confidence: 91,
    severity: 'High',
    affectedCrop: 'Tomato / Potato',
    description:
      'A highly destructive fungal disease caused by Phytophthora infestans. Dark water-soaked lesions spread rapidly across leaves and stems, especially in cool, humid conditions.',
    treatments: [
      {
        step: 1,
        title: 'Remove Infected Tissue',
        detail: 'Immediately prune and bag all infected leaves and stems. Do not compost. Burn or dispose of far from the field.',
        icon: '✂️',
      },
      {
        step: 2,
        title: 'Apply Copper Fungicide',
        detail: 'Spray copper-based fungicide (e.g. Bordeaux mixture) on remaining plants. Repeat every 7 days or after rain.',
        icon: '🧪',
      },
      {
        step: 3,
        title: 'Improve Air Circulation',
        detail: 'Space plants further apart and stake tomatoes upright. Avoid overhead irrigation — water at the base only.',
        icon: '💨',
      },
    ],
  },
  {
    name: 'Powdery Mildew',
    confidence: 88,
    severity: 'Medium',
    affectedCrop: 'Wheat / Cucumbers',
    description:
      'A fungal disease causing distinctive white powdery coating on leaves. Thrives in warm days with cool nights. Reduces photosynthesis but rarely kills plants directly.',
    treatments: [
      {
        step: 1,
        title: 'Apply Baking Soda Spray',
        detail: 'Mix 1 tablespoon baking soda + 1 teaspoon dish soap in 4L of water. Spray affected leaves thoroughly, including undersides.',
        icon: '🫧',
      },
      {
        step: 2,
        title: 'Use Sulfur-Based Fungicide',
        detail: 'Commercial sulfur spray is highly effective. Apply in early morning. Avoid applying when temperatures exceed 32°C.',
        icon: '🧪',
      },
      {
        step: 3,
        title: 'Increase Sunlight Exposure',
        detail: 'Prune dense foliage to allow more sunlight and airflow. Powdery mildew thrives in shade — open the canopy.',
        icon: '☀️',
      },
    ],
  },
  {
    name: 'Bacterial Leaf Scorch',
    confidence: 79,
    severity: 'Medium',
    affectedCrop: 'Maize / Sorghum',
    description:
      'Caused by the bacterium Xylella fastidiosa, this disease blocks water transport in the plant. Brown scorching spreads from leaf margins inward during hot, dry weather.',
    treatments: [
      {
        step: 1,
        title: 'Prune Symptomatic Branches',
        detail: 'Cut branches 30cm below visible symptoms. Sterilize pruning tools with 10% bleach solution between cuts to prevent spread.',
        icon: '✂️',
      },
      {
        step: 2,
        title: 'Apply Oxytetracycline',
        detail: 'Trunk injection of oxytetracycline antibiotic can slow progression. Requires a licensed agronomist to administer correctly.',
        icon: '💉',
      },
      {
        step: 3,
        title: 'Optimize Irrigation',
        detail: 'Increase watering frequency during heat stress periods. Mulch around the base to retain soil moisture and reduce stress.',
        icon: '💧',
      },
    ],
  },
  {
    name: 'Iron Deficiency Chlorosis',
    confidence: 84,
    severity: 'Low',
    affectedCrop: 'Various Crops',
    description:
      'Not a disease but a nutrient deficiency. Yellowing between leaf veins while veins stay green is the signature sign. Common in high-pH (alkaline) soils that lock up iron.',
    treatments: [
      {
        step: 1,
        title: 'Test Soil pH',
        detail: 'Check soil pH — iron deficiency is most common above pH 7.5. Use a simple test kit from any agricultural store before treating.',
        icon: '🧪',
      },
      {
        step: 2,
        title: 'Apply Chelated Iron Fertilizer',
        detail: 'Spray chelated iron (Fe-EDTA or Fe-EDDHA) directly on leaves for quick response. Also apply to soil for longer-term correction.',
        icon: '🌿',
      },
      {
        step: 3,
        title: 'Lower Soil pH if Needed',
        detail: 'Add elemental sulfur or acidifying fertilizers to gradually reduce pH. Organic matter incorporation helps improve iron availability.',
        icon: '🌍',
      },
    ],
  },
  {
    name: 'Leaf Rust',
    confidence: 93,
    severity: 'High',
    affectedCrop: 'Wheat / Barley',
    description:
      'A fungal disease (Puccinia triticina) producing orange-brown pustules on leaf surfaces. Spores spread rapidly by wind and can devastate entire fields within weeks.',
    treatments: [
      {
        step: 1,
        title: 'Apply Triazole Fungicide',
        detail: 'Propiconazole or tebuconazole at first sign of pustules. Treat early — fungicides are protective, not curative at advanced stages.',
        icon: '🧪',
      },
      {
        step: 2,
        title: 'Destroy Crop Debris',
        detail: 'After harvest, plow infected plant debris deep into soil or burn. Rust overwinters on plant material and reinfects next season.',
        icon: '🔥',
      },
      {
        step: 3,
        title: 'Plant Resistant Varieties',
        detail: 'For next season, choose rust-resistant wheat/barley varieties. Check with your local agricultural extension for recommended cultivars.',
        icon: '🌾',
      },
    ],
  },
  {
    name: 'Healthy Leaf',
    confidence: 97,
    severity: 'Low',
    affectedCrop: 'Healthy Plant',
    description:
      'Great news! Your leaf appears healthy with no signs of disease, nutrient deficiency, or pest damage detected. Continue your current crop management practices.',
    treatments: [
      {
        step: 1,
        title: 'Continue Regular Monitoring',
        detail: 'Inspect plants weekly, especially during humid weather. Early detection is key — catching disease early dramatically improves outcomes.',
        icon: '👁️',
      },
      {
        step: 2,
        title: 'Maintain Soil Health',
        detail: 'Continue balanced fertilization and composting. A nutrient-rich, well-draining soil produces disease-resistant crops.',
        icon: '🌱',
      },
      {
        step: 3,
        title: 'Preventive Fungicide Rotation',
        detail: 'In high-risk seasons, apply preventive organic fungicide (neem oil or copper) every 3–4 weeks even on healthy crops.',
        icon: '🛡️',
      },
    ],
  },
]

export function simulateDiseaseDetection(): Promise<DiseaseTemplate> {
  return new Promise((resolve) => {
    // Simulate AI processing time (2–3.5 seconds)
    const delay = 2000 + Math.random() * 1500
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * DISEASE_DATABASE.length)
      resolve(DISEASE_DATABASE[randomIndex])
    }, delay)
  })
}
