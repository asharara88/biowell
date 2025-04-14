# Project Files:

The following is a list of all project files and their complete contents that are currently visible and accessible to you.

.env:
```
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

README.md:
```md
# BIOWELL

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5c78e83-4ef8-498d-ac21-70beebb68a83/deploy-status)](https://app.netlify.com/sites/biowellai/deploys)

AI-driven personalized wellness platform designed specifically for you. Optimize your health with personalized supplement stacks and wearable integrations.

## Features

- Personalized supplement stacks
- Wearable device integration
- Real-time health monitoring
- AI-powered recommendations
- Personal Digital Coach

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase
- Vite

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## DNS Configuration

To set up your domain with Netlify:

1. Update your domain's nameservers to Netlify's DNS servers:
   - dns1.p05.nsone.net
   - dns2.p05.nsone.net
   - dns3.p05.nsone.net
   - dns4.p05.nsone.net

2. Wait for DNS propagation (24-48 hours)

3. Verify your domain is properly connected in Netlify's Domain settings

## Deployment

This project is automatically deployed to Netlify on every push to the main branch.
```

dns-template.json:
```json
{
  "domain": "biowell.ai",
  "records": [
    {
      "type": "A",
      "name": "@",
      "ttl": 3600,
      "values": ["75.2.60.5"]
    },
    {
      "type": "CNAME",
      "name": "www",
      "ttl": 3600,
      "value": "@"
    },
    {
      "type": "MX",
      "name": "@",
      "ttl": 3600,
      "values": [
        {
          "priority": 10,
          "value": "mx1.forwardemail.net"
        },
        {
          "priority": 20,
          "value": "mx2.forwardemail.net"
        }
      ]
    },
    {
      "type": "TXT",
      "name": "@",
      "ttl": 3600,
      "values": [
        "v=spf1 include:spf.forwardemail.net -all"
      ]
    },
    {
      "type": "NETLIFY",
      "name": "@",
      "ttl": 3600,
      "values": [
        "dns1.p05.nsone.net",
        "dns2.p05.nsone.net",
        "dns3.p05.nsone.net",
        "dns4.p05.nsone.net"
      ]
    }
  ]
}
```

eslint.config.js:
```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);

```

index.html:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="BIOWELL - AI-driven personalized wellness designed specifically for you. Optimize your health with personalized supplement stacks and wearable integrations." />
    <title>BIOWELL | AI-Driven Personalized Wellness</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

package.json:
```json
{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "export-code": "node scripts/export-code.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.7",
    "axios": "^1.6.7",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-modal": "^3.16.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/react-modal": "^3.16.3",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

postcss.config.js:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

src/App.tsx:
```tsx
import React from 'react';
import FeatureCard from './components/FeatureCard';
import StackCard from './components/StackCard';
import Logo from './components/Logo';
import { Activity, Heart } from 'lucide-react';

export default function App() {
  const stacks = [
    "Fertility Stack",
    "Metabolic Stack",
    "Hypertrophy Stack",
    "Endurance Stack",
    "Weight Management Stack",
    "Sleep Well Stack",
    "Cognitive Stack",
    "Longevity Stack",
    "Joint & Mobility Stack",
    "Immunity Stack",
    "Stress Relief Stack"
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 bg-black shadow-md border-b border-gray-800">
        <div className="flex items-center tracking-[2px]">
          <span className="text-lg font-bold text-white">BIOW</span>
          <div className="mx-0">
            <Logo />
          </div>
          <span className="text-lg font-bold text-white">LL</span>
        </div>
        <ul className="flex space-x-12 text-sm font-semibold">
          <li><a href="#about" className="text-white hover:text-blue-400 transition-colors">Who We Are</a></li>
          <li><a href="#how" className="text-white hover:text-blue-400 transition-colors">How It Works</a></li>
          <li><a href="#stacks" className="text-white hover:text-blue-400 transition-colors">Stacks</a></li>
          <li><a href="#integration" className="text-white hover:text-blue-400 transition-colors">Integration</a></li>
          <li><a href="#features" className="text-white hover:text-blue-400 transition-colors">Features</a></li>
          <li><a href="#coach" className="text-white hover:text-blue-400 transition-colors">Personal Digital Coach</a></li>
          <li><a href="#contact" className="text-white hover:text-blue-400 transition-colors">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <header className="h-[500px] flex items-center justify-center bg-cover bg-center relative" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative text-center py-10 px-8">
          <h1 className="text-5xl font-bold text-white mb-4">Optimize Your Health, <span className="text-blue-400">Every Day</span></h1>
          <p className="mt-4 text-xl text-white">AI-driven personalized wellness designed specifically for you.</p>
          <button className="mt-8 bg-blue-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-600 transition-colors">
            Get Started
          </button>
        </div>
      </header>

      {/* Who We Are */}
      <section id="about" className="py-20 px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white">Who We Are</h2>
          <p className="text-gray-300">BIOWELL is dedicated to revolutionizing personalized wellness through advanced AI technology, precise supplement stacks, and seamless wearable integrations.</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-8 text-center bg-black">
        <h2 className="text-4xl font-bold mb-6 text-white">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard title="Data Integration" description="Connect your wearables and apps." />
          <FeatureCard title="Personal Analysis" description="Your Personal Digital Coach analyzes data to recommend personalized wellness plans." />
          <FeatureCard title="Monthly Delivery" description="Tailored supplements delivered straight to your door." />
        </div>
      </section>

      {/* Supplement Stacks */}
      <section id="stacks" className="py-20 px-8 bg-gray-900">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Our Supplement Stacks</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stacks.map(stack => <StackCard key={stack} title={stack} />)}
        </div>
      </section>

      {/* Seamless Integration Section */}
      <section id="integration" className="py-20 px-8 bg-black text-center">
        <h2 className="text-4xl font-bold mb-10 text-white">Seamless Integration</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            title="Wearable & App Connectivity"
            description="Sync data effortlessly from your favorite wearables and health apps." 
          />
          <FeatureCard 
            title="Health Dashboard"
            description="Visualize health insights clearly—sleep patterns, glucose levels, supplements, and daily metrics in one intuitive dashboard." 
          />
          <FeatureCard 
            title="Real-time Data & Insights"
            description="Access immediate health insights from real-time wearable integrations like Freestyle Libre CGM." 
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-8 bg-gray-900">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Why Choose BIOWELL?</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard title="Hyper-Personalization" description="Personalized wellness recommendations tailored to you." />
          <FeatureCard title="Advanced Stacks" description="Scientifically-backed, targeted supplement stacks." />
          <FeatureCard title="Seamless Integration" description="Easily connect and integrate your existing wearable devices." />
          <FeatureCard title="CGM Integration" description="Real-time glucose monitoring integration with Freestyle Libre." />
        </div>
      </section>

      {/* Personal Digital Coach */}
      <section id="coach" className="py-20 px-8 bg-black">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Personal Digital Coach</h2>
        <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
          <div className="h-56 overflow-auto mb-4 bg-black p-4 rounded-md">
            <p className="mb-2 text-white">👋 Hey! I'm your Personal Digital Coach. How can I assist your wellness journey today?</p>
            <p className="text-right mb-2 text-blue-400">What's today's stack recommendation?</p>
            <p className="text-white">💡 For today's hypertrophy session, I've optimized your supplements and meal timing accordingly.</p>
          </div>
          <input 
            type="text" 
            placeholder="Ask your Personal Digital Coach..." 
            className="w-full p-3 rounded-md bg-black text-white placeholder-gray-400 border border-gray-800 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </section>

      {/* Contact & Footer */}
      <footer id="contact" className="text-center py-8 border-t border-gray-800">
        <div className="flex justify-center space-x-4 mb-4">
          <Activity className="h-6 w-6 text-blue-400" />
          <Logo />
          <Heart className="h-6 w-6 text-blue-400" />
        </div>
        <p className="text-gray-400">© 2025 BIOWELL. All rights reserved.</p>
      </footer>
    </div>
  );
}
```

src/api/client.ts:
```ts
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API endpoints configuration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  endpoints: {
    wearables: '/api/wearables',
    supplements: '/api/supplements',
    recommendations: '/api/recommendations',
  },
};

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API request failed:', error);
    return Promise.reject(error.response?.data || error.message);
  }
);

// Generic API client using axios
export class APIClient {
  static async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return axiosInstance.get(endpoint, { params });
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    return axiosInstance.post(endpoint, data);
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    return axiosInstance.put(endpoint, data);
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return axiosInstance.delete(endpoint);
  }
}
```

src/api/integrations.ts:
```ts
import { APIClient } from './client';

// Types for wearable data
export interface WearableData {
  deviceId: string;
  deviceType: 'fitbit' | 'garmin' | 'apple_health' | 'freestyle_libre';
  lastSync: Date;
  metrics: Record<string, unknown>;
}

// Types for supplement recommendations
export interface SupplementRecommendation {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  stackId: string;
  notes?: string;
}

// Types for health metrics
export interface HealthMetrics {
  glucose?: number;
  heartRate?: number;
  steps?: number;
  sleep?: {
    duration: number;
    quality: number;
  };
}

// CGM Data interface
export interface CGMData {
  userId: string;
  timestamp: Date;
  glucoseLevel: number;
  trend?: 'rising' | 'falling' | 'stable';
}

// Supplement Stack interface
export interface SupplementStack {
  id: string;
  type: string;
  supplements: SupplementRecommendation[];
  schedule: Record<string, string>;
}

export class WearableIntegration {
  static async fetchWearableData(userId: string): Promise<WearableData> {
    return APIClient.get<WearableData>(`/wearables/${userId}`);
  }

  static async connectDevice(deviceType: WearableData['deviceType'], authData: unknown) {
    return APIClient.post<{ success: boolean }>('/wearables/connect', {
      deviceType,
      authData,
    });
  }

  static async getLatestMetrics(deviceId: string) {
    return APIClient.get<HealthMetrics>(`/wearables/${deviceId}/metrics`);
  }

  static async syncData(deviceId: string) {
    return APIClient.post<{ success: boolean; lastSync: Date }>(
      `/wearables/${deviceId}/sync`,
      {}
    );
  }
}

export class CGMIntegration {
  static async fetchCGMData(userId: string): Promise<CGMData[]> {
    return APIClient.get<CGMData[]>(`/cgm/freestyle-libre/${userId}`);
  }

  static async getLatestReading(userId: string): Promise<CGMData> {
    return APIClient.get<CGMData>(`/cgm/freestyle-libre/${userId}/latest`);
  }
}

export class SupplementIntegration {
  static async getCurrentStack(userId: string) {
    return APIClient.get<SupplementRecommendation[]>('/supplements/stack', {
      userId,
    });
  }

  static async fetchSupplementStack(userId: string, stackType: string): Promise<SupplementStack> {
    return APIClient.get<SupplementStack>(`/supplements/${stackType}/${userId}`);
  }

  static async updatePreferences(userId: string, preferences: Record<string, unknown>) {
    return APIClient.put<{ success: boolean }>(
      '/supplements/preferences',
      {
        userId,
        preferences,
      }
    );
  }
}

export class HealthCoachIntegration {
  static async getRecommendations(userId: string, metrics: HealthMetrics) {
    return APIClient.post<{
      supplements: SupplementRecommendation[];
      lifestyle: Record<string, unknown>;
    }>('/coach/recommendations', {
      userId,
      metrics,
    });
  }

  static async logInteraction(userId: string, message: string) {
    return APIClient.post<{ success: boolean }>('/coach/log', {
      userId,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

src/components/Dashboard.tsx:
```tsx
import React, { useEffect, useState } from 'react';
import { WearableIntegration, CGMIntegration, type WearableData, type CGMData } from '../api/integrations';
import { Activity, Heart, TrendingUp, Watch } from 'lucide-react';

interface DashboardProps {
  userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [cgmData, setCgmData] = useState<CGMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [wearableResult, cgmResult] = await Promise.all([
          WearableIntegration.fetchWearableData(userId),
          CGMIntegration.getLatestReading(userId)
        ]);

        setWearableData(wearableResult);
        setCgmData(cgmResult);
      } catch (err) {
        setError('Failed to fetch health data. Please try again later.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {/* Heart Rate */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Heart className="text-red-400 h-6 w-6" />
          <span className="text-sm text-gray-400">Heart Rate</span>
        </div>
        <div className="text-3xl font-bold text-white">
          {wearableData?.metrics.heartRate || '--'} <span className="text-sm text-gray-400">bpm</span>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Activity className="text-green-400 h-6 w-6" />
          <span className="text-sm text-gray-400">Daily Steps</span>
        </div>
        <div className="text-3xl font-bold text-white">
          {wearableData?.metrics.steps?.toLocaleString() || '--'}
        </div>
      </div>

      {/* Glucose */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <TrendingUp className="text-blue-400 h-6 w-6" />
          <span className="text-sm text-gray-400">Glucose</span>
        </div>
        <div className="text-3xl font-bold text-white">
          {cgmData?.glucoseLevel || '--'} <span className="text-sm text-gray-400">mg/dL</span>
        </div>
        {cgmData?.trend && (
          <span className={`text-sm ${
            cgmData.trend === 'rising' ? 'text-green-400' :
            cgmData.trend === 'falling' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {cgmData.trend}
          </span>
        )}
      </div>

      {/* Last Sync */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Watch className="text-purple-400 h-6 w-6" />
          <span className="text-sm text-gray-400">Last Sync</span>
        </div>
        <div className="text-lg font-medium text-white">
          {wearableData?.lastSync ? new Date(wearableData.lastSync).toLocaleTimeString() : '--'}
        </div>
      </div>
    </div>
  );
}
```

src/components/FeatureCard.tsx:
```tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border border-gray-800">
      <h3 className="text-xl font-semibold text-biowellGreen mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
```

src/components/Logo.tsx:
```tsx
import React from 'react';

export default function Logo() {
  return (
    <div className="flex flex-col justify-center h-[20px] gap-[3px]">
      <div className="h-[3px] w-[17px] bg-[#5BC0EB]"></div>
      <div className="h-[3px] w-[10.5px] bg-[#2584E4]"></div>
      <div className="h-[3px] w-[17px] bg-[#0B3C91]"></div>
    </div>
  );
}
```

src/components/StackCard.tsx:
```tsx
import React, { useState } from 'react';
import Modal from 'react-modal';

interface StackCardProps {
  title: string;
  onLearnMore?: () => void;
}

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

export default function StackCard({ title }: StackCardProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
        <p className="font-semibold text-center text-white">{title}</p>
        <button 
          onClick={openModal}
          className="mt-4 bg-black text-biowellGreen px-4 py-1 rounded-full hover:bg-gray-900 transition w-full"
        >
          Learn More
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={`${title} Details`}
      >
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-300 mb-4">
            Discover our scientifically formulated {title.toLowerCase()} designed to optimize your wellness journey.
          </p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Key Benefits:</h3>
            <ul className="list-disc list-inside text-gray-300">
              <li>Enhanced performance and recovery</li>
              <li>Scientifically backed formulations</li>
              <li>Premium quality ingredients</li>
              <li>Personalized dosing recommendations</li>
            </ul>
          </div>
          <button
            onClick={closeModal}
            className="bg-biowellGreen text-black px-6 py-2 rounded-full hover:bg-opacity-90 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
```

src/index.css:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

src/main.tsx:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

```

src/types/env.d.ts:
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

src/vite-env.d.ts:
```ts
/// <reference types="vite/client" />

```

tailwind.config.js:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        biowellGreen: '#4CAF50',
      },
    },
  },
  plugins: [],
};
```

tsconfig.app.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

```

tsconfig.json:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

tsconfig.node.json:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}

```

vite.config.ts:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

```

