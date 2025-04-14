import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, Moon, Zap, Calendar, Pill, Dumbbell, Leaf, Activity } from 'lucide-react';

const featureDetails = {
  stacks: {
    title: "Personalized Supplement Stacks",
    description: "Scientifically formulated supplement combinations tailored to your unique needs.",
    icon: <Pill className="w-8 h-8 text-biowellGreen" />,
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    sections: [
      {
        title: "Smart Formulation",
        content: "Our AI analyzes your health data to create perfectly balanced supplement combinations."
      },
      {
        title: "Quality Assurance",
        content: "Premium, third-party tested ingredients from trusted manufacturers."
      },
      {
        title: "Adaptive Optimization",
        content: "Continuously refined based on your progress and changing needs."
      }
    ]
  },
  habits: {
    title: "Habit Integration System",
    description: "Build lasting wellness habits with our comprehensive tracking and support system.",
    icon: <Calendar className="w-8 h-8 text-biowellGreen" />,
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    sections: [
      {
        title: "Habit Stacking",
        content: "Build new habits by connecting them to existing routines."
      },
      {
        title: "Progress Tracking",
        content: "Visual progress indicators and streak tracking for motivation."
      },
      {
        title: "Behavioral Science",
        content: "Based on proven behavior change methodologies."
      }
    ]
  },
  coach: {
    title: "Your Digital Personal Coach",
    description: "24/7 AI-powered guidance and support for your wellness journey.",
    icon: <Brain className="w-8 h-8 text-biowellGreen" />,
    image: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    sections: [
      {
        title: "Personalized Guidance",
        content: "Real-time recommendations based on your data and goals."
      },
      {
        title: "Continuous Learning",
        content: "Adapts to your preferences and response patterns."
      },
      {
        title: "Holistic Support",
        content: "Integrates all aspects of your wellness journey."
      }
    ]
  },
  tracking: {
    title: "Performance Tracking",
    description: "Advanced analytics and insights to optimize your wellness journey.",
    icon: <Activity className="w-8 h-8 text-biowellGreen" />,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    sections: [
      {
        title: "Real-time Monitoring",
        content: "Track your progress with comprehensive health metrics and visualizations."
      },
      {
        title: "Trend Analysis",
        content: "Identify patterns and optimize your wellness routine with data-driven insights."
      },
      {
        title: "Goal Setting",
        content: "Set and track personalized goals with adaptive recommendations."
      }
    ]
  },
  fitness: {
    title: "Fitness Integration",
    description: "Seamlessly connect your fitness devices and apps for comprehensive tracking.",
    icon: <Dumbbell className="w-8 h-8 text-biowellGreen" />,
    image: "https://images.unsplash.com/photo-1510017803434-a899398421b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    sections: [
      {
        title: "Device Connectivity",
        content: "Connect with popular fitness trackers and health monitoring devices."
      },
      {
        title: "Data Synchronization",
        content: "Automatically sync your workout and activity data."
      },
      {
        title: "Holistic Analysis",
        content: "Combine fitness data with other health metrics for comprehensive insights."
      }
    ]
  },
  insights: {
    title: "Wellness Insights",
    description: "Data-driven recommendations for optimal health outcomes.",
    icon: <Leaf className="w-8 h-8 text-biowellGreen" />,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    sections: [
      {
        title: "Personalized Analysis",
        content: "Get tailored insights based on your unique health data and goals."
      },
      {
        title: "Trend Detection",
        content: "Identify patterns and correlations in your wellness journey."
      },
      {
        title: "Actionable Recommendations",
        content: "Receive specific suggestions to optimize your health routine."
      }
    ]
  }
};

export default function FeatureDetails() {
  const { feature } = useParams();
  const details = feature ? featureDetails[feature as keyof typeof featureDetails] : null;

  if (!details) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-gray-400">Feature not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[400px]">
        <img 
          src={details.image} 
          alt={details.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              {details.icon}
            </div>
            <h1 className="text-4xl font-bold mb-4">{details.title}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
              {details.description}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {details.sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-biowellGreen">
                {section.title}
              </h3>
              <p className="text-gray-300">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}