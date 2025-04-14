import React from 'react';
import PricingCard from './PricingCard';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your wellness journey. All plans include access to your Personal Digital Coach
            and our comprehensive wellness platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Essential"
            price={199}
            features={[
              "Personal Digital Coach",
              "Basic Health Dashboard",
              "Supplement Recommendations",
              "Daily Habit Tracking",
              "Email Support"
            ]}
          />
          <PricingCard
            recommended
            title="Premium"
            price={299}
            features={[
              "Everything in Essential",
              "CGM Integration",
              "Advanced Health Analytics",
              "Custom Supplement Stacks",
              "Priority Support",
              "Weekly Progress Reviews"
            ]}
          />
          <PricingCard
            title="Elite"
            price={499}
            features={[
              "Everything in Premium",
              "Dedicated Health Specialist",
              "Custom Health Protocols",
              "Quarterly Health Assessment",
              "24/7 Priority Support",
              "Partner Network Benefits"
            ]}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            All plans include a 30-day money-back guarantee. Prices shown are in USD.
          </p>
        </div>
      </div>
    </section>
  );
}