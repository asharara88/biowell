import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Truck, Sparkles, Zap, RefreshCw } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  frequency: string;
  features: string[];
  popular: boolean;
}

export default function SubscriptionPlans() {
  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Monthly Delivery',
      description: 'Perfect for trying out your personalized supplement stack',
      price: 79.99,
      frequency: 'per month',
      features: [
        'Personalized supplement stack',
        'Monthly delivery',
        'Free shipping',
        'Adjust or cancel anytime',
        'Health Consultant access'
      ],
      popular: false
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      description: 'Our most popular option with the best value',
      price: 69.99,
      frequency: 'per month, billed quarterly',
      features: [
        'Personalized supplement stack',
        'Quarterly delivery',
        'Free shipping',
        'Adjust or cancel anytime',
        'Health Consultant access',
        'Priority customer support',
        '15% discount on all products'
      ],
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      description: 'Maximum savings for your wellness journey',
      price: 59.99,
      frequency: 'per month, billed annually',
      features: [
        'Personalized supplement stack',
        'Quarterly delivery',
        'Free shipping',
        'Adjust or cancel anytime',
        'Health Consultant access',
        'Priority customer support',
        '25% discount on all products',
        'Complimentary wellness consultation',
        'Exclusive access to new products'
      ],
      popular: false
    }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Subscription Options</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Subscribe to your personalized supplement stack and save. Regular deliveries ensure you never run out of your essential supplements.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={`relative rounded-xl overflow-hidden border ${
              plan.popular 
                ? 'border-biowellGreen bg-gradient-to-b from-biowellGreen/10 to-gray-900' 
                : 'border-gray-800 bg-gray-900'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-biowellGreen text-black text-xs font-bold px-3 py-1">
                MOST POPULAR
              </div>
            )}
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-1">{plan.frequency}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className={`w-5 h-5 mr-2 shrink-0 ${plan.popular ? 'text-biowellGreen' : 'text-gray-400'}`} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-biowellGreen text-black hover:bg-opacity-90'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-biowellGreen mr-2" />
            <h3 className="text-white font-medium">Flexible Scheduling</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Customize your delivery schedule to match your supplement needs. Easily adjust timing as needed.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
          <div className="flex items-center mb-3">
            <RefreshCw className="w-5 h-5 text-biowellGreen mr-2" />
            <h3 className="text-white font-medium">Easy Adjustments</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Change your supplement stack anytime as your wellness goals evolve. Your Health Consultant will help guide adjustments.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-5 border border-gray-800">
          <div className="flex items-center mb-3">
            <Truck className="w-5 h-5 text-biowellGreen mr-2" />
            <h3 className="text-white font-medium">Free Shipping</h3>
          </div>
          <p className="text-gray-400 text-sm">
            All subscription plans include free shipping. Your supplements arrive in discreet, eco-friendly packaging.
          </p>
        </div>
      </div>
    </div>
  );
}