// Centralized version configuration
export const APP_VERSION = {
  major: 1,
  minor: 7,
  patch: 0,
  build: 1765510661190, // Unique build identifier
  
  // Full version string
  get full() {
    return `v${this.major}.${this.minor}.${this.patch}`;
  },
  
  // Version with build info
  get fullWithBuild() {
    return `${this.full} (Build: ${this.build})`;
  },
  
  // Legacy format for compatibility
  get legacy() {
    return `V${this.major}${this.minor}${this.patch}`;
  },
  
  // Display version for UI
  get display() {
    return this.full;
  }
};

// Version history for reference
export const VERSION_HISTORY = [
  { version: 'v1.4.7', date: '2024-11-27', description: 'Mock data corrections and improvements' },
  { version: 'v1.7.0', date: '2025-12-12', description: 'Version control system implementation' }
];

// Build information
export const BUILD_INFO = {
  timestamp: '2025-12-12T03:37:41.190Z',
  environment: import.meta.env.MODE || 'development',
  commit: import.meta.env.VITE_GIT_COMMIT || 'unknown'
};