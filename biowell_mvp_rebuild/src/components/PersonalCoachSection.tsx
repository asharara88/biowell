import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function PersonalCoachSection() {
  const { user } = useAuth();

  return (
    <section id="coach" className="py-20 px-8 bg-black">
      <h2 className="text-4xl font-bold mb-8 text-center text-white">Personal Health Consultant</h2>
      <div className="max-w-lg mx-auto p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
        <div className="h-56 overflow-auto mb-4 bg-black p-4 rounded-md">
          <p className="mb-2 text-white">👋 Hey{user ? ` ${user.email}` : ''}! I'm your Personal Health Consultant. How can I assist you with your wellness journey today?</p>
          <p className="text-right mb-2 text-blue-400">What's today's stack recommendation?</p>
          <p className="text-white">💡 For today's hypertrophy session, I've optimized your supplements and meal timing accordingly.</p>
        </div>
        <input 
          type="text" 
          placeholder="Ask your Personal Health Consultant..." 
          className="w-full p-3 rounded-md bg-black text-white placeholder-gray-400 border border-gray-800 focus:border-blue-500 focus:outline-none"
        />
      </div>
    </section>
  );
}