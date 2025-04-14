import ReactGA from 'react-ga4';

// Initialize GA4
export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId, {
    testMode: process.env.NODE_ENV !== 'production',
    debug_mode: process.env.NODE_ENV !== 'production'
  });
};

// Page view tracking
export const logPageView = (path?: string) => {
  const pagePath = path || window.location.pathname + window.location.search;
  ReactGA.send({ 
    hitType: 'pageview',
    page: pagePath
  });
};

// Event tracking with optional parameters
export const logEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
  transport?: 'beacon' | 'xhr' | 'image'
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
    nonInteraction,
    transport
  });
};

// Enhanced user tracking
export const setUser = (userId: string, additionalParams?: Record<string, unknown>) => {
  ReactGA.set({
    userId,
    ...additionalParams
  });
};

// Track user timing
export const logTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
) => {
  ReactGA.send({
    hitType: 'timing',
    timingCategory: category,
    timingVar: variable,
    timingValue: value,
    timingLabel: label
  });
};

// Track exceptions
export const logException = (description: string, fatal: boolean = false) => {
  ReactGA.event({
    category: 'Error',
    action: 'Exception',
    label: description,
    nonInteraction: !fatal
  });
};

// Track social interactions
export const logSocial = (
  network: string,
  action: string,
  target: string
) => {
  ReactGA.event({
    category: 'Social',
    action: action,
    label: `${network}: ${target}`
  });
};