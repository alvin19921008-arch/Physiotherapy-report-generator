import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize version validation
import './utils/version'

createRoot(document.getElementById("root")!).render(<App />);
