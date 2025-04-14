import type { Translation } from './types';

export const en: Translation = {
  navigation: {
    about: "About",
    howItWorks: "How It Works",
    stacks: "Stacks",
    features: "Features",
    dashboard: "Dashboard",
    settings: "Settings",
    coach: "Health Consultant",
    signOut: "Sign Out"
  },
  hero: {
    title: "Optimize Your Health, Every Day",
    subtitle: "Stackable features, Seamless connectivity, Hyper-Personal experience",
    cta: "Get Started"
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Experience our comprehensive approach to personalized wellness, combining advanced AI technology with proven scientific principles",
    steps: {
      assessment: {
        title: "Initial Assessment",
        description: "Complete a comprehensive health assessment covering your goals, current health status, and lifestyle factors",
        details: [
          "Personal health history",
          "Fitness and wellness goals",
          "Current supplements and medications",
          "Lifestyle and stress factors"
        ]
      },
      integration: {
        title: "Data Integration",
        description: "Connect your wearables and health apps to provide real-time health metrics for personalized recommendations",
        details: [
          "Wearable device sync",
          "Sleep tracking",
          "Activity monitoring",
          "Continuous glucose monitoring"
        ]
      },
      analysis: {
        title: "AI Analysis",
        description: "Our advanced AI analyzes your data to create personalized wellness recommendations and supplement stacks",
        details: [
          "Pattern recognition",
          "Biomarker analysis",
          "Scientific research integration",
          "Personalized algorithms"
        ]
      },
      creation: {
        title: "Stack Creation",
        description: "Receive your personalized supplement stack and habit recommendations tailored to your goals",
        details: [
          "Custom supplement formulations",
          "Timing optimization",
          "Habit integration",
          "Progress tracking"
        ]
      },
      optimization: {
        title: "Ongoing Optimization",
        description: "Your Health Consultant continuously monitors your progress and adjusts recommendations",
        details: [
          "Real-time adjustments",
          "Progress tracking",
          "Goal refinement",
          "Adaptation protocols"
        ]
      }
    }
  },
  coach: {
    title: "Health Consultant",
    label: "Consultant",
    typing: "Health consultant is typing...",
    inputPlaceholder: "Ask your health consultant...",
    pageTitle: "Personal Health Consultant",
    pageDescription: "Your AI-powered wellness companion providing personalized guidance and insights based on your health data.",
    error: {
      loadHistory: "Failed to load chat history. Please try again later.",
      sendMessage: "Failed to send message. Please try again."
    },
    tabs: {
      chat: "Chat",
      insights: "Insights",
      goals: "Goals",
      settings: "Settings"
    },
    insights: {
      title: "Recent Insights",
      personalized: "Personalized for you",
      weeklyTitle: "Weekly Summary",
      energy: "Energy",
      focus: "Focus",
      recovery: "Recovery",
      summary: "Your overall wellness score is trending positively. Focus on maintaining your sleep quality while increasing daily activity for optimal results."
    },
    goals: {
      title: "Your Goals",
      add: "Add Goal",
      completed: "Completed Goals",
      createNew: "Create New Goal"
    }
  },
  settings: {
    title: "Health Consultant Settings",
    subtitle: "Customize your experience",
    saved: "Saved!",
    saving: "Saving...",
    saveChanges: "Save Changes",
    tone: {
      title: "Communication Tone"
    },
    detail: {
      title: "Detail Level"
    },
    notifications: {
      title: "Notifications",
      daily: "Daily Reminders",
      dailyDesc: "Get daily wellness reminders",
      evening: "Evening Check-ins",
      eveningDesc: "Receive evening wellness check-ins",
      insights: "Insight Alerts",
      insightsDesc: "Get notified of new health insights"
    },
    theme: {
      title: "Theme",
      dark: "Dark",
      darkDesc: "Easier on the eyes in low light",
      light: "Light",
      lightDesc: "Better visibility in bright light"
    }
  },
  stacks: {
    title: "Personalized Wellness Stacks",
    categories: {
      performance: "Performance",
      cognitive: "Cognitive",
      longevity: "Longevity",
      sleep: "Sleep"
    },
    components: {
      supplements: "Supplements",
      habits: "Habits",
      coach: "Consultant Guidance",
      coachFocus: "Consultation Focus"
    }
  },
  common: {
    learnMore: "Learn More",
    close: "Close",
    details: "Details"
  }
};