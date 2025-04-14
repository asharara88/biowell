import React from 'react';
import { Helmet } from 'react-helmet-async';
import WellnessProfileForm from '../components/WellnessProfileForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface WellnessFormData {
  // Form data structure from WellnessProfileForm
  [key: string]: any;
}

export default function WellnessProfile() {
  const navigate = useNavigate();

  const handleSubmit = (data: WellnessFormData) => {
    console.log('Wellness profile data:', data);
    // In a real app, you would save this data to your backend
    // Then navigate to results or dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black pt-16 px-4 pb-16">
      <Helmet>
        <title>Create Your Wellness Profile | BIOWELL</title>
        <meta name="description" content="Create your personalized wellness profile to receive tailored recommendations for supplements, habits, and lifestyle optimizations." />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-2 bg-biowellGreen/10 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-biowellGreen" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Create Your Personalized Wellness Profile</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete the following assessment to help us create a tailored wellness plan specifically for you. 
            Your responses will guide our AI in developing personalized recommendations for supplements, 
            habits, and lifestyle optimizations.
          </p>
        </motion.div>

        <WellnessProfileForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}