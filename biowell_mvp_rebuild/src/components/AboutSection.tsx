import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AboutTopic {
  id: string;
  title: string;
  shortDescription: string;
  fullContent: React.ReactNode;
  icon: React.ReactNode;
}

export default function AboutSection() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const aboutTopics: AboutTopic[] = [
    {
      id: 'mission',
      title: 'Our Mission',
      shortDescription: 'Empowering individuals with personalized wellness solutions',
      icon: <Brain className="w-6 h-6 text-biowellGreen" />,
      fullContent: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            To empower individuals with personalized, data-driven wellness solutions 
            that optimize their health journey through cutting-edge technology and 
            evidence-based recommendations.
          </p>
          <h3 className="text-xl font-semibold text-white">Core Principles</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                <strong className="text-white">Personalization:</strong> We believe that each person's wellness journey is unique. Our AI-driven approach tailors recommendations to your specific needs, goals, and biometric data.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                <strong className="text-white">Evidence-Based:</strong> All our recommendations are grounded in scientific research and clinical studies, ensuring you receive the most effective guidance.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                <strong className="text-white">Holistic Approach:</strong> We address all aspects of wellness—physical, mental, and nutritional—to create a comprehensive health optimization strategy.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                <strong className="text-white">Continuous Improvement:</strong> Our systems learn and adapt to your changing health patterns, ensuring your wellness plan evolves with you.
              </span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'vision',
      title: 'Our Vision',
      shortDescription: 'Creating a world where optimal wellness is accessible to everyone',
      icon: <Zap className="w-6 h-6 text-biowellGreen" />,
      fullContent: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            To create a world where optimal wellness is accessible to everyone through 
            personalized AI health consultation, real-time biometric insights, and targeted 
            supplement protocols.
          </p>
          <h3 className="text-xl font-semibold text-white">Future Outlook</h3>
          <p className="text-gray-300 leading-relaxed">
            We envision a future where:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                Preventative health becomes the standard, not the exception
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                Individuals have complete ownership and understanding of their health data
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                AI-driven health consultation is available to everyone, regardless of location or socioeconomic status
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
              <span className="text-gray-300">
                Personalized supplement protocols replace one-size-fits-all approaches
              </span>
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            By combining cutting-edge technology with evidence-based wellness practices, we're working to make this vision a reality—one personalized recommendation at a time.
          </p>
        </div>
      )
    },
    {
      id: 'ai-insights',
      title: 'AI-Powered Insights',
      shortDescription: 'Advanced algorithms analyze your biometric data for personalized recommendations',
      icon: <Brain className="w-6 h-6 text-biowellGreen" />,
      fullContent: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            At the core of BIOWELL is our advanced AI system that transforms your health data into actionable insights and personalized recommendations.
          </p>
          
          <h3 className="text-xl font-semibold text-white">How Our AI Works</h3>
          <p className="text-gray-300 leading-relaxed">
            Our proprietary algorithms analyze multiple data points from your wearables, health records, and personal preferences to create a comprehensive picture of your wellness status.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-800 p-5 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3">Data Integration</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Wearable device metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Continuous glucose monitoring</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Sleep quality data</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Activity and exercise patterns</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-5 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3">Analysis Capabilities</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Pattern recognition</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Predictive modeling</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Correlation analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Scientific research integration</span>
                </li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mt-6">Continuous Learning</h3>
          <p className="text-gray-300 leading-relaxed">
            Our AI doesn't just provide static recommendations—it learns from your feedback and results, continuously refining its approach to better serve your unique needs. The more you use BIOWELL, the more personalized and effective your recommendations become.
          </p>
        </div>
      )
    },
    {
      id: 'real-time-monitoring',
      title: 'Real-time Monitoring',
      shortDescription: 'Seamless integration with wearables for continuous health tracking and optimization',
      icon: <Activity className="w-6 h-6 text-biowellGreen" />,
      fullContent: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            BIOWELL seamlessly integrates with your favorite wearable devices to provide continuous health monitoring and real-time insights.
          </p>
          
          <h3 className="text-xl font-semibold text-white">Supported Devices</h3>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-2">Wearables</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Apple Watch</li>
                <li className="text-gray-300">Fitbit</li>
                <li className="text-gray-300">Garmin</li>
                <li className="text-gray-300">Oura Ring</li>
                <li className="text-gray-300">Whoop</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-2">CGM Devices</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Freestyle Libre</li>
                <li className="text-gray-300">Dexcom</li>
                <li className="text-gray-300">Levels</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-2">Smart Scales</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Withings</li>
                <li className="text-gray-300">Renpho</li>
                <li className="text-gray-300">Eufy</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mt-6">Key Metrics Tracked</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Heart rate variability (HRV)</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Resting heart rate</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Sleep stages and quality</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Activity levels and steps</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Blood glucose levels</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Body composition</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Stress levels</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Recovery metrics</span>
                </li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mt-6">Real-time Insights</h3>
          <p className="text-gray-300 leading-relaxed">
            Our platform doesn't just collect data—it transforms it into actionable insights in real-time. Receive immediate feedback on how your activities, nutrition, and supplements are affecting your health metrics, allowing you to make informed adjustments throughout your day.
          </p>
        </div>
      )
    },
    {
      id: 'evidence-based',
      title: 'Evidence-Based',
      shortDescription: 'All recommendations are grounded in scientific research and clinical studies',
      icon: <Shield className="w-6 h-6 text-biowellGreen" />,
      fullContent: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            At BIOWELL, we're committed to providing recommendations that are firmly grounded in scientific research and clinical evidence. We believe that effective wellness solutions must be backed by rigorous science.
          </p>
          
          <h3 className="text-xl font-semibold text-white">Our Research Approach</h3>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-800 p-5 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3">Scientific Foundation</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Peer-reviewed research integration</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Clinical study analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Meta-analysis evaluation</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Continuous literature review</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-5 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-3">Quality Standards</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Third-party testing of supplements</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Bioavailability optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Purity verification</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                  <span className="text-gray-300">Efficacy validation</span>
                </li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mt-6">Research Collaboration</h3>
          <p className="text-gray-300 leading-relaxed">
            We collaborate with leading researchers, universities, and healthcare professionals to ensure our recommendations reflect the latest scientific understanding. Our advisory board includes experts in nutrition, exercise physiology, sleep science, and integrative medicine.
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6">Transparency Commitment</h3>
          <p className="text-gray-300 leading-relaxed">
            We believe in complete transparency regarding the scientific basis for our recommendations. For each supplement and protocol we suggest, we provide references to the relevant research and explain the mechanisms of action in clear, accessible language.
          </p>
          
          <div className="bg-gray-800 p-5 rounded-lg mt-4">
            <h4 className="text-lg font-medium text-white mb-3">Our Evidence Standards</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                <span className="text-gray-300">
                  <strong className="text-white">Multiple Studies:</strong> We require multiple studies supporting efficacy before recommending any intervention
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                <span className="text-gray-300">
                  <strong className="text-white">Human Trials:</strong> We prioritize human clinical trials over animal or in vitro studies
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                <span className="text-gray-300">
                  <strong className="text-white">Dosage Clarity:</strong> We ensure recommended dosages match those validated in research
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-biowellGreen mr-2 mt-2"></span>
                <span className="text-gray-300">
                  <strong className="text-white">Safety Profile:</strong> We thoroughly evaluate safety data before making any recommendation
                </span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleTopicClick = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  // Find the selected topic if there is one
  const currentTopic = selectedTopic 
    ? aboutTopics.find(topic => topic.id === selectedTopic) 
    : null;

  return (
    <div className="min-h-screen bg-black pt-16">
      {selectedTopic ? (
        // Detailed topic view
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button 
                onClick={handleBackToTopics}
                className="flex items-center text-biowellGreen hover:text-biowellGreen/80 transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to About
              </button>
              
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-biowellGreen/10 mr-4">
                  {currentTopic?.icon}
                </div>
                <h1 className="text-3xl font-bold text-white">{currentTopic?.title}</h1>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg"
            >
              {currentTopic?.fullContent}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex justify-between"
            >
              <button 
                onClick={handleBackToTopics}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to About
              </button>
              
              <button 
                onClick={handleGetStarted}
                className="px-6 py-3 bg-biowellGreen text-black rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          </div>
        </section>
      ) : (
        // Main about section with topic buttons
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">About BIOWELL</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                We're revolutionizing personal wellness through advanced AI technology, 
                precise supplement stacks, and seamless wearable integrations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {aboutTopics.map((topic, index) => (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTopicClick(topic.id)}
                  className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-left hover:border-biowellGreen hover:bg-gray-900/80 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-biowellGreen/10 mr-4">
                      {topic.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{topic.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {topic.shortDescription}
                  </p>
                  <div className="flex items-center text-biowellGreen mt-2">
                    <span className="mr-2">Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Ready to Start Your Wellness Journey?</h3>
              <button 
                onClick={handleGetStarted}
                className="bg-biowellGreen text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}