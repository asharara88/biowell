export interface Translation {
  navigation: {
    about: string;
    howItWorks: string;
    stacks: string;
    features: string;
    dashboard: string;
    settings: string;
    coach: string;
    signOut: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      assessment: {
        title: string;
        description: string;
        details: string[];
      };
      integration: {
        title: string;
        description: string;
        details: string[];
      };
      analysis: {
        title: string;
        description: string;
        details: string[];
      };
      creation: {
        title: string;
        description: string;
        details: string[];
      };
      optimization: {
        title: string;
        description: string;
        details: string[];
      };
    };
  };
  coach: {
    title: string;
    label: string;
    typing: string;
    inputPlaceholder: string;
    pageTitle: string;
    pageDescription: string;
    error: {
      loadHistory: string;
      sendMessage: string;
    };
    tabs: {
      chat: string;
      insights: string;
      goals: string;
      settings: string;
    };
    insights: {
      title: string;
      personalized: string;
      weeklyTitle: string;
      energy: string;
      focus: string;
      recovery: string;
      summary: string;
    };
    goals: {
      title: string;
      add: string;
      completed: string;
      createNew: string;
    };
  };
  settings: {
    title: string;
    subtitle: string;
    saved: string;
    saving: string;
    saveChanges: string;
    tone: {
      title: string;
    };
    detail: {
      title: string;
    };
    notifications: {
      title: string;
      daily: string;
      dailyDesc: string;
      evening: string;
      eveningDesc: string;
      insights: string;
      insightsDesc: string;
    };
    theme: {
      title: string;
      dark: string;
      darkDesc: string;
      light: string;
      lightDesc: string;
    };
  };
  stacks: {
    title: string;
    categories: {
      performance: string;
      cognitive: string;
      longevity: string;
      sleep: string;
    };
    components: {
      supplements: string;
      habits: string;
      coach: string;
      coachFocus: string;
    };
  };
  common: {
    learnMore: string;
    close: string;
    details: string;
  };
}