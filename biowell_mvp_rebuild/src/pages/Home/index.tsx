import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Heart, Zap, Calendar, Pill, Dumbbell, Leaf } from 'lucide-react';
import WellnessStack from '../../components/WellnessStack';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const wellnessStacks = [
    {
      title: "Performance Stack",
      supplements: ["Creatine", "Beta-Alanine", "L-Citrulline"],
      habits: ["Progressive Overload", "Recovery Protocol", "Nutrition Timing"],
      coachingFocus: ["Performance Tracking", "Training Optimization", "Recovery Management"]
    },
    {
      title: "Cognitive Stack",
      supplements: ["Lion's Mane", "Alpha-GPC", "Bacopa Monnieri"],
      habits: ["Deep Work Blocks", "Mindfulness Practice", "Sleep Optimization"],
      coachingFocus: ["Focus Enhancement", "Memory Training", "Stress Management"]
    },
    {
      title: "Longevity Stack",
      supplements: ["NMN", "Resveratrol", "CoQ10"],
      habits: ["Intermittent Fasting", "Zone 2 Cardio", "Stress Reduction"],
      coachingFocus: ["Biomarker Tracking", "Lifestyle Optimization", "Aging Well"]
    },
    {
      title: "Sleep Stack",
      supplements: ["Magnesium", "L-Theanine", "Ashwagandha"],
      habits: ["Sleep Ritual", "Light Management", "Temperature Control"],
      coachingFocus: ["Sleep Analysis", "Circadian Optimization", "Recovery Tracking"]
    }
  ];

  const features = [
    {
      icon: <Brain />,
      title: "AI-Powered Insights",
      description: "Advanced algorithms analyze your biometric data to provide personalized recommendations."
    },
    {
      icon: <Activity />,
      title: "Real-time Monitoring",
      description: "Seamless integration with wearables for continuous health tracking and optimization."
    },
    {
      icon: <Dumbbell />,
      title: "Personalized Stacks",
      description: "Custom supplement and habit stacks tailored to your unique needs and goals."
    },
    {
      icon: <Leaf />,
      title: "Holistic Approach",
      description: "Comprehensive wellness optimization combining supplements, habits, and coaching."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center flex items-center justify-center" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')`
        }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="relative z-10 text-center p-4 md:p-10 max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-xl text-white">
            {t('hero.subtitle')}
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="mt-8 bg-biowellGreen text-black font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors"
          >
            {t('hero.cta')}
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Why Choose BIOWELL?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="w-12 h-12 bg-biowellGreen bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  {React.cloneElement(feature.icon, {
                    className: 'text-biowellGreen w-6 h-6'
                  })}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-gray-400">{t('howItWorks.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(t('howItWorks.steps')).map(([key, step]: [string, any], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail: string, idx: number) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Stacks */}
      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            {t('stacks.title')}
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellnessStacks.map((stack, index) => (
              <WellnessStack
                key={index}
                title={stack.title}
                supplements={stack.supplements}
                habits={stack.habits}
                coachingFocus={stack.coachingFocus}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join BIOWELL today and experience personalized wellness optimization backed by science and powered by AI.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-biowellGreen text-black font-semibold px-12 py-4 rounded-full hover:bg-opacity-90 transition-colors text-lg"
          >
            Get Started Now
          </button>
        </motion.div>
      </section>
    </div>
  );
}