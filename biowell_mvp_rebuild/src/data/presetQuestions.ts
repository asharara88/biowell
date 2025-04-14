// Predefined questions and responses for the demo
export const presetQuestions = [
  {
    id: 'goals',
    question: 'What are my recommended health goals?',
    response: `Based on your profile, here are your recommended health goals:
1. Optimize sleep quality (7-8 hours/night)
2. Increase daily activity (target: 10,000 steps)
3. Manage stress levels through mindfulness
4. Maintain balanced nutrition with supplementation`,
    category: 'Assessment'
  },
  {
    id: 'supplements',
    question: 'What supplements should I take?',
    response: `Here's your personalized supplement stack:
• Morning Stack:
  - Multivitamin Complex
  - Omega-3 (2000mg)
  - Vitamin D3 (5000 IU)
• Evening Stack:
  - Magnesium Glycinate (400mg)
  - Zinc (15mg)
  - Ashwagandha (600mg)`,
    category: 'Supplements'
  },
  {
    id: 'sleep',
    question: 'How can I improve my sleep quality?',
    response: `Based on your sleep metrics, here are personalized recommendations:
1. Optimize Sleep Environment:
   - Keep room temperature at 65-68°F
   - Use blackout curtains
   - Minimize noise disruption

2. Evening Routine:
   - Take Magnesium Glycinate 1 hour before bed
   - Practice 10-minute meditation
   - Avoid blue light exposure

3. Timing Optimization:
   - Maintain consistent sleep schedule
   - Target 7-8 hours of sleep
   - Begin wind-down routine at 9:30 PM`,
    category: 'Sleep'
  },
  {
    id: 'metrics',
    question: 'Show me my health metrics',
    response: 'Here are your current health metrics:',
    category: 'Biometrics',
    showMetrics: true,
    metrics: {
      heartRate: 68,
      steps: 8432,
      sleep: {
        duration: 7.5,
        quality: 8.5
      },
      stress: 3
    }
  },
  {
    id: 'routine',
    question: 'What should my daily wellness routine look like?',
    response: `Here's your optimized daily wellness routine:

Morning (6:30 AM - 8:00 AM):
• Morning supplements with breakfast
• 15-minute mobility routine
• 10-minute meditation

Afternoon (12:00 PM - 2:00 PM):
• 30-minute moderate exercise
• Stress management break
• Hydration check (2L target)

Evening (8:00 PM - 10:00 PM):
• Evening supplement stack
• Sleep optimization routine
• Mindfulness practice`,
    category: 'Routine'
  }
];