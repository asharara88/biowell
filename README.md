# Biowell Project

## Description
Biowell is a digital wellness solution powered by Supabase and Bolt, designed to deliver personalized health coaching and wellness metrics.

## Installation
```bash
npm install
```

## Setup
Configure `.env` with your Supabase details:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-public-key
```

## Running Locally
```bash
npm run dev
```

## Deployment
1. Push to GitHub.
2. Connect your repository to Bolt for deployment.
3. Ensure Supabase Edge functions are deployed via `supabase` CLI.

## Project Structure
```
project/
├── .env
├── index.html
├── package.json
├── README.md
├── supabase/
│   ├── migrations/
│   └── functions/
├── src/
│   ├── components/
│   ├── utils/
│   │   └── scoreCalculator.ts
│   ├── schemas/
│   └── main.tsx
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Contribution
Please branch off `main` for your features and submit PRs explaining your changes.
