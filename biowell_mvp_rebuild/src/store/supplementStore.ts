import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Supplement, CartItem } from '../types/supplement';

interface SupplementState {
  supplements: Supplement[];
  cart: CartItem[];
  addToCart: (supplement: Supplement) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// Sample supplement and wellness device data
const sampleSupplements: Supplement[] = [
  {
    id: '1',
    name: 'Magnesium Glycinate',
    description: 'Supports sleep quality and stress reduction',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'sleep',
    rating: 4.8,
    tags: ['Sleep', 'Stress', 'Recovery'],
    recommended: true,
    recommendationReason: 'Based on your sleep patterns and stress levels, Magnesium Glycinate can help improve your sleep quality and reduce stress.',
    benefits: [
      'Improves sleep quality',
      'Reduces stress and anxiety',
      'Supports muscle recovery',
      'Promotes relaxation'
    ],
    ingredients: 'Magnesium Glycinate 400mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1-2 capsules 30 minutes before bedtime with water.'
  },
  {
    id: '2',
    name: 'Vitamin D3 + K2',
    description: 'Essential for immune function and bone health',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'immunity',
    rating: 4.9,
    tags: ['Immunity', 'Bone Health', 'Essential'],
    recommended: true,
    recommendationReason: 'Your health metrics indicate potential vitamin D deficiency, which is common in indoor lifestyles.',
    benefits: [
      'Supports immune system function',
      'Promotes bone health',
      'Enhances calcium absorption',
      'Supports cardiovascular health'
    ],
    ingredients: 'Vitamin D3 (Cholecalciferol) 5000 IU, Vitamin K2 (MK-7) 100mcg, MCT Oil, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule daily with a meal containing fat for optimal absorption.'
  },
  {
    id: '3',
    name: 'Omega-3 Fish Oil',
    description: 'High-potency EPA/DHA for brain and heart health',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'cognitive',
    rating: 4.7,
    tags: ['Brain Health', 'Heart Health', 'Anti-inflammatory'],
    recommended: true,
    recommendationReason: 'Based on your cognitive goals and dietary patterns, additional Omega-3 fatty acids would be beneficial.',
    benefits: [
      'Supports brain function and cognitive health',
      'Promotes cardiovascular health',
      'Reduces inflammation',
      'Supports mood regulation'
    ],
    ingredients: 'Fish Oil Concentrate 1200mg (EPA 400mg, DHA 200mg), Gelatin, Glycerin, Purified Water, Natural Lemon Flavor',
    suggestedUse: 'Take 2 softgels daily with meals.'
  },
  {
    id: '4',
    name: 'Ashwagandha KSM-66',
    description: 'Adaptogen for stress management and resilience',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'sleep',
    rating: 4.6,
    tags: ['Stress', 'Adaptogen', 'Energy'],
    recommended: false,
    benefits: [
      'Reduces stress and anxiety',
      'Supports adrenal function',
      'Improves sleep quality',
      'Enhances recovery from exercise'
    ],
    ingredients: 'KSM-66 Ashwagandha Root Extract 600mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule twice daily with meals.'
  },
  {
    id: '5',
    name: 'Lion\'s Mane Mushroom',
    description: 'Supports cognitive function and nerve health',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'cognitive',
    rating: 4.5,
    tags: ['Cognitive', 'Focus', 'Memory'],
    recommended: false,
    benefits: [
      'Enhances cognitive function',
      'Supports nerve growth and repair',
      'Improves memory and focus',
      'Supports overall brain health'
    ],
    ingredients: 'Organic Lion\'s Mane Mushroom Extract 500mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 2 capsules daily with food.'
  },
  {
    id: '6',
    name: 'Zinc Picolinate',
    description: 'Highly bioavailable zinc for immune support',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'immunity',
    rating: 4.7,
    tags: ['Immunity', 'Essential Mineral', 'Skin Health'],
    recommended: false,
    benefits: [
      'Supports immune system function',
      'Promotes wound healing',
      'Supports testosterone production',
      'Maintains skin health'
    ],
    ingredients: 'Zinc Picolinate 30mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule daily with food.'
  },
  {
    id: '7',
    name: 'Rhodiola Rosea',
    description: 'Adaptogen for energy, focus, and stress resilience',
    price: 26.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'energy',
    rating: 4.6,
    tags: ['Energy', 'Focus', 'Adaptogen'],
    recommended: false,
    benefits: [
      'Reduces fatigue',
      'Enhances mental performance',
      'Improves stress resilience',
      'Supports physical performance'
    ],
    ingredients: 'Rhodiola Rosea Root Extract 500mg (3% Rosavins, 1% Salidroside), Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule 1-2 times daily, preferably with meals.'
  },
  {
    id: '8',
    name: 'CoQ10 Ubiquinol',
    description: 'Advanced form of CoQ10 for energy and heart health',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'energy',
    rating: 4.8,
    tags: ['Heart Health', 'Energy', 'Antioxidant'],
    recommended: false,
    benefits: [
      'Supports cellular energy production',
      'Promotes cardiovascular health',
      'Provides antioxidant protection',
      'Supports healthy aging'
    ],
    ingredients: 'Ubiquinol (Reduced CoQ10) 100mg, MCT Oil, Gelatin, Glycerin, Purified Water',
    suggestedUse: 'Take 1 softgel daily with a meal containing fat.'
  },
  {
    id: '9',
    name: 'NMN (Nicotinamide Mononucleotide)',
    description: 'Advanced NAD+ precursor for cellular energy and longevity',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'longevity',
    rating: 4.7,
    tags: ['Longevity', 'Energy', 'Anti-aging'],
    recommended: false,
    benefits: [
      'Supports NAD+ production',
      'Promotes cellular energy',
      'Supports DNA repair',
      'Promotes healthy aging'
    ],
    ingredients: 'Nicotinamide Mononucleotide 500mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule daily with food.'
  },
  {
    id: '10',
    name: 'Berberine HCl',
    description: 'Supports metabolic health and glucose metabolism',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'longevity',
    rating: 4.6,
    tags: ['Metabolism', 'Blood Sugar', 'Gut Health'],
    recommended: false,
    benefits: [
      'Supports healthy blood glucose levels',
      'Promotes cardiovascular health',
      'Supports healthy lipid levels',
      'Promotes gut health'
    ],
    ingredients: 'Berberine HCl 500mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule 2-3 times daily with meals.'
  },
  {
    id: '11',
    name: 'L-Theanine',
    description: 'Promotes relaxation without drowsiness',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'sleep',
    rating: 4.8,
    tags: ['Relaxation', 'Focus', 'Stress'],
    recommended: false,
    benefits: [
      'Promotes relaxation without drowsiness',
      'Supports focus and attention',
      'Reduces stress and anxiety',
      'Improves sleep quality'
    ],
    ingredients: 'L-Theanine 200mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule 1-3 times daily as needed.'
  },
  {
    id: '12',
    name: 'Vitamin C + Quercetin',
    description: 'Powerful antioxidant combo for immune support',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'immunity',
    rating: 4.7,
    tags: ['Immunity', 'Antioxidant', 'Anti-inflammatory'],
    recommended: false,
    benefits: [
      'Supports immune system function',
      'Provides antioxidant protection',
      'Supports respiratory health',
      'Promotes healthy inflammatory response'
    ],
    ingredients: 'Vitamin C (as Ascorbic Acid) 1000mg, Quercetin 500mg, Vegetable Cellulose (capsule)',
    suggestedUse: 'Take 1 capsule 1-2 times daily with meals.'
  },
  {
    id: '13',
    name: 'Blue Light Blocking Glasses',
    description: 'Premium glasses that filter blue light from screens for better sleep and reduced eye strain',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'devices',
    rating: 4.8,
    tags: ['Sleep', 'Eye Health', 'Digital Detox'],
    recommended: false,
    benefits: [
      'Reduces eye strain from digital screens',
      'Improves sleep quality by blocking blue light',
      'Prevents digital eye fatigue',
      'Stylish design for everyday wear'
    ],
    ingredients: 'High-quality acetate frame, Blue light filtering lenses',
    suggestedUse: 'Wear during screen time, especially in the evening hours before bed.'
  },
  {
    id: '14',
    name: 'Smart Sleep Tracker',
    description: 'Non-wearable sleep monitoring device that tracks sleep cycles, breathing, and environment',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'devices',
    rating: 4.7,
    tags: ['Sleep', 'Tracking', 'Smart Home'],
    recommended: false,
    benefits: [
      'Tracks sleep stages without wearables',
      'Monitors bedroom environment (temperature, humidity, light)',
      'Provides detailed sleep quality reports',
      'Integrates with smart home systems'
    ],
    ingredients: 'Advanced sensors, WiFi connectivity, Companion app',
    suggestedUse: 'Place on nightstand within 6 feet of bed. Connect to WiFi and BIOWELL app.'
  },
  {
    id: '15',
    name: 'Meditation Headband',
    description: 'EEG-powered meditation assistant that provides real-time feedback on brain activity',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'devices',
    rating: 4.6,
    tags: ['Meditation', 'Brain Training', 'Stress'],
    recommended: false,
    benefits: [
      'Provides real-time feedback on meditation sessions',
      'Tracks brain activity during meditation',
      'Guides you to deeper states of focus',
      'Includes guided meditation library'
    ],
    ingredients: 'EEG sensors, Bluetooth connectivity, Adjustable headband, Companion app',
    suggestedUse: 'Wear during meditation sessions. Start with 10-minute sessions daily.'
  },
  {
    id: '16',
    name: 'EMF Protection Device',
    description: 'Whole-home EMF harmonizer that helps mitigate electromagnetic field exposure',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'devices',
    rating: 4.5,
    tags: ['EMF Protection', 'Home', 'Wellness'],
    recommended: false,
    benefits: [
      'Helps harmonize electromagnetic fields in your home',
      'Coverage for up to 1500 sq ft',
      'No maintenance required',
      'Compact design fits anywhere'
    ],
    ingredients: 'Proprietary EMF harmonizing technology, Durable metal casing',
    suggestedUse: 'Place centrally in your home. Plug into any standard outlet.'
  },
  {
    id: '17',
    name: 'Recovery Massage Gun',
    description: 'Professional-grade percussion therapy device for muscle recovery and pain relief',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'devices',
    rating: 4.9,
    tags: ['Recovery', 'Fitness', 'Pain Relief'],
    recommended: false,
    benefits: [
      'Accelerates muscle recovery after workouts',
      'Relieves muscle soreness and stiffness',
      'Improves range of motion and flexibility',
      'Multiple speed settings and attachments'
    ],
    ingredients: 'High-torque motor, Rechargeable battery, 6 interchangeable heads',
    suggestedUse: 'Use for 2-3 minutes per muscle group. Avoid bony areas and injuries.'
  },
  {
    id: '18',
    name: 'Smart Body Composition Scale',
    description: 'Advanced scale that measures weight, body fat, muscle mass, and more',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'devices',
    rating: 4.7,
    tags: ['Tracking', 'Fitness', 'Metrics'],
    recommended: false,
    benefits: [
      'Measures 17 body composition metrics',
      'Tracks progress over time with companion app',
      'Supports multiple user profiles',
      'Seamlessly integrates with BIOWELL dashboard'
    ],
    ingredients: 'Tempered glass platform, Bioelectrical impedance sensors, Bluetooth connectivity',
    suggestedUse: 'Measure at the same time each day, preferably in the morning after using the bathroom and before eating.'
  }
];

export const useSupplementStore = create<SupplementState>()(
  persist(
    (set) => ({
      supplements: sampleSupplements,
      cart: [],
      
      addToCart: (supplement) => set((state) => {
        const existingItem = state.cart.find(item => item.id === supplement.id);
        
        if (existingItem) {
          return {
            cart: state.cart.map(item => 
              item.id === supplement.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        } else {
          return {
            cart: [...state.cart, { ...supplement, quantity: 1 }]
          };
        }
      }),
      
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),
      
      updateCartItemQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map(item => 
          item.id === id 
            ? { ...item, quantity }
            : item
        )
      })),
      
      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'supplement-store',
    }
  )
);