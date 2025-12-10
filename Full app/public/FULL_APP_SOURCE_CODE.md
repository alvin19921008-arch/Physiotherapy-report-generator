# Physiotherapy Report Generator - Full App Source Code

## 📦 Complete React/TypeScript Application

This document contains the complete source code for the Physiotherapy Report Generator full app. Copy each section into the corresponding file in your VS Code project.

## 🚀 Quick Setup Instructions

1. Create a new folder: `physiotherapy-app`
2. Copy each file content below into the corresponding file
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start development server

---

## 📁 Project Structure

```
physiotherapy-app/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── postcss.config.js
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── toast.tsx
│   │   ├── ClinicalFindings.tsx
│   │   ├── FinalReportDraft.tsx
│   │   ├── DischargeSummary.tsx
│   │   └── LiteDataImport.tsx
│   ├── pages/
│   │   └── Index.tsx
│   ├── hooks/
│   │   ├── useReportData.ts
│   │   ├── useMockData.ts
│   │   └── use-toast.ts
│   └── types/
│       └── index.ts
```

---

## 🔧 Configuration Files

### package.json
```json
{
  "name": "physiotherapy-report-generator",
  "private": true,
  "version": "1.7.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.462.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-router-dom": "^6.26.2",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

### tsconfig.json
```json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### tsconfig.node.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Physiotherapy Report Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 📝 Source Files

### src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### src/App.tsx
```typescript
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </HashRouter>
  </TooltipProvider>
);

export default App;
```

### src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />
```

---

## 🎨 Styles

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 🔧 Utilities

### src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 📋 Type Definitions

### src/types/index.ts
```typescript
// Core data types for the physiotherapy report generator

export interface ReportData {
  // Section 1: Reference Information
  ourRef: string;
  ourRef2: string;
  yourRef: string;
  yourRefDate: string;
  reportDate: string;
  recipient: string;
  
  // Section 2: Patient Information
  patientName: string;
  patientSex: string;
  patientAge: string;
  hkidNo: string;
  physiotherapyOpdNo: string;
  
  // Section 3: Diagnosis
  diagnosis: string;
  
  // Section 4: Referral Sources
  referralSources: ReferralSource[];
  
  // Section 5: Duration
  totalSessions: string;
  registrationDate: string;
  startDate: string;
  endDate: string;
  caseTherapists: string;
  reportWrittenBy: string;
  attendedSessions: string;
  defaultedSessions: string;
  
  // Section 6: Clinical Findings
  initialFindings: ClinicalFindings;
  interimFindings: ClinicalFindings;
  finalFindings: ClinicalFindings;
  
  // Section 7: Treatment Methods
  treatments: Treatment[];
  
  // Section 8: Discharge Summary
  dischargeSummary: DischargeSummary;
  
  // Section 9: Therapist Details
  therapistDetails: TherapistDetails;
  consentDate: string;
  declarationName: string;
  declarationTitle: string;
  educationQualifications: string;
}

export interface ReferralSource {
  episode: string;
  department: string;
  hospital: string;
}

export interface ClinicalFindings {
  date: string;
  complaints: {
    location: string;
    side: string;
    duration: string;
    onset: string;
    nature: string;
    severity: string;
    aggravatingFactors: string;
    relievingFactors: string;
    otherSymptoms: OtherSymptom[];
  };
  objectiveFindings: {
    observation: string;
    arom: AROMEntry[];
    musclePower: MusclePowerEntry[];
    myotome: MyotomeEntry[];
    fingersToesData: FingerToeData[];
    toesROM: string;
    grossFingersROM: string;
    handGripStrength: HandGripStrength;
    handGripNotTested: boolean;
    aromNotTested: boolean;
    musclePowerNotTested: boolean;
    includeProm: boolean;
    splintBraceCastInclude: boolean;
    splintBraceCastType: string;
    tendernessInclude: boolean;
    tendernessArea: string;
    swellingInclude: boolean;
    swellingPresent: boolean;
    temperatureInclude: boolean;
    temperatureIncreased: boolean;
    sensationInclude: boolean;
    sensationStatus: string;
    sensationReduction: string;
    areaReduced: string;
    areaHypersensitive: string;
    reflexInclude: boolean;
    reflexNormal: boolean;
    walkingAid: string;
    walkingStability: string;
    wbStatusInclude: boolean;
    wbStatus: string;
    specialTests: SpecialTest[];
    questionnaires: Questionnaire[];
  };
  functionalActivities: {
    activities1: Activity[];
    activities2: Activity[];
    otherFunctionalLimitation: string;
  };
}

export interface OtherSymptom {
  symptom: string;
}

export interface AROMEntry {
  movement: string;
  leftRange: string;
  rightRange: string;
}

export interface MusclePowerEntry {
  muscleGroup: string;
  leftGrade: string;
  rightGrade: string;
  leftGrip?: string;
  rightGrip?: string;
  pinchGrip?: string;
  lateralPinch?: string;
}

export interface MyotomeEntry {
  level: string;
  leftGrade: string;
  rightGrade: string;
}

export interface FingerToeData {
  name: string;
  joints: JointData[];
}

export interface JointData {
  jointType: string;
  range: string;
}

export interface HandGripStrength {
  leftHandGrip: string;
  rightHandGrip: string;
  leftPinchGrip: string;
  rightPinchGrip: string;
  leftLateralPinch: string;
  rightLateralPinch: string;
}

export interface SpecialTest {
  test: string;
  result: string;
}

export interface Questionnaire {
  name: string;
  score: string;
}

export interface Activity {
  activity: string;
  difficulty: string;
}

export interface Treatment {
  method: string;
  area: string;
  other: string;
}

export interface DischargeSummary {
  summaryText: string[];
  componentData: {
    dischargeType: string;
    dischargeDate: string;
  };
}

export interface TherapistDetails {
  name: string;
  title: string;
  qualifications: string;
}
```

---

## 🎯 Next Steps

1. **Create the project folder**: `physiotherapy-app`
2. **Copy configuration files** from above
3. **Create the src folder structure**
4. **Copy source files** from the additional files I'll provide
5. **Install dependencies**: `npm install`
6. **Start development**: `npm run dev`

This is Part 1 of the complete source code. The main React components (ClinicalFindings.tsx, FinalReportDraft.tsx, etc.) are provided in separate files due to their size.

---

## 📞 Support

If you need help setting up the project or have questions about any component, feel free to ask!