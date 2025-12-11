#!/usr/bin/env node

/**
 * Build script to update version information before building
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get current timestamp for build
const buildTimestamp = Date.now();
const buildDate = new Date(buildTimestamp).toISOString();

// Read package.json to get version
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Parse version components
const [major, minor, patch] = version.split('.').map(Number);

// Update version.ts file
const versionTsPath = path.join(__dirname, '../src/config/version.ts');
const versionContent = `// Centralized version configuration
export const APP_VERSION = {
  major: ${major},
  minor: ${minor},
  patch: ${patch},
  build: ${buildTimestamp}, // Unique build identifier
  
  // Full version string
  get full() {
    return \`v\${this.major}.\${this.minor}.\${this.patch}\`;
  },
  
  // Version with build info
  get fullWithBuild() {
    return \`\${this.full} (Build: \${this.build})\`;
  },
  
  // Legacy format for compatibility
  get legacy() {
    return \`V\${this.major}\${this.minor}\${this.patch}\`;
  },
  
  // Display version for UI
  get display() {
    return this.full;
  }
};

// Version history for reference
export const VERSION_HISTORY = [
  { version: 'v1.4.7', date: '2024-11-27', description: 'Mock data corrections and improvements' },
  { version: 'v${version}', date: '${buildDate.split('T')[0]}', description: 'Version control system implementation' }
];

// Build information
export const BUILD_INFO = {
  timestamp: '${buildDate}',
  environment: import.meta.env.MODE || 'development',
  commit: import.meta.env.VITE_GIT_COMMIT || 'unknown'
};`;

// Write updated version file
fs.writeFileSync(versionTsPath, versionContent);

// Update index.html title
const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(
  /<title>.*?<\/title>/,
  `<title>Physiotherapy Medical Report Generator v${version} - Tuen Mun Hospital</title>`
);
fs.writeFileSync(indexHtmlPath, indexHtml);

console.log(`✅ Version updated to v${version} (Build: ${buildTimestamp})`);
console.log(`📅 Build date: ${buildDate}`);
console.log(`📁 Updated files: version.ts, index.html`);
