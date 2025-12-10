import { APP_VERSION } from '@/config/version';

/**
 * Version validation utilities to ensure consistency across the application
 */

export const validateVersion = () => {
  const errors: string[] = [];
  
  // Check if version components are valid
  if (!APP_VERSION.major || APP_VERSION.major < 0) {
    errors.push('Invalid major version number');
  }
  
  if (APP_VERSION.minor < 0) {
    errors.push('Invalid minor version number');
  }
  
  if (APP_VERSION.patch < 0) {
    errors.push('Invalid patch version number');
  }
  
  // Check if build timestamp is recent (within last 24 hours for development)
  const buildAge = Date.now() - APP_VERSION.build;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (buildAge > maxAge && import.meta.env.MODE === 'development') {
    console.warn('Build timestamp is older than 24 hours. Consider rebuilding.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    version: APP_VERSION.display
  };
};

export const getVersionInfo = () => {
  return {
    current: APP_VERSION.display,
    full: APP_VERSION.fullWithBuild,
    legacy: APP_VERSION.legacy,
    build: APP_VERSION.build,
    timestamp: new Date(APP_VERSION.build).toISOString()
  };
};

export const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.replace('v', '').split('.').map(Number);
  const v2Parts = version2.replace('v', '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  
  return 0;
};

// Initialize version validation on module load
const validation = validateVersion();
if (!validation.isValid) {
  console.error('Version validation failed:', validation.errors);
}

// Log version info in development
if (import.meta.env.MODE === 'development') {
  console.log('App Version Info:', getVersionInfo());
}