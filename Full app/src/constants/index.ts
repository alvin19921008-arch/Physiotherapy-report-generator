// Shared constants to eliminate duplication and improve maintainability
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const MUSCLE_POWER_GRADES = ['0', '1', '2', '3', '4', '5', 'NT'] as const;

export const PAIN_INTENSITY_LEVELS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;

export const DURATION_UNITS = ['seconds', 'minutes', 'hours'] as const;

export const WALKING_AIDS = [
  'nil',
  'walking stick',
  'walking frame',
  'crutches',
  'wheelchair',
  'other'
] as const;

export const GAIT_PATTERNS = [
  'normal',
  'antalgic',
  'trendelenburg',
  'circumduction',
  'high stepping',
  'scissors',
  'other'
] as const;

export const WALKING_STABILITY = [
  'stable',
  'unsteady',
  'fair',
  'requires assistance'
] as const;

export const WEIGHT_BEARING_STATUS = [
  'partial weight bearing',
  'full weight bearing',
  'non-weight bearing',
  'weight bearing as tolerated'
] as const;

export const DISCHARGE_TYPES = [
  'completed treatment',
  'patient defaulted',
  'cancelled by patient',
  'cancelled by department',
  'referred to other service'
] as const;

// Pronoun configurations
export const PRONOUN_CONFIG = {
  Male: { he: 'He', his: 'His', him: 'him', title: 'Mr.' },
  Female: { he: 'She', his: 'Her', him: 'her', title: 'Ms.' },
  default: { he: 'He/She', his: 'His/Her', him: 'him/her', title: 'Mr./Ms.' }
} as const;

// Region-specific configurations
export const REGION_CONFIG = {
  back: { questionnaires: ['Roland-Morris Disability Questionnaire'] },
  neck: { questionnaires: ['Northwick Park Neck Pain Questionnaire'] },
  shoulder: { questionnaires: ['QuickDASH'] },
  elbow: { questionnaires: ['QuickDASH'] },
  wrist: { questionnaires: ['QuickDASH'] },
  hand: { questionnaires: ['QuickDASH'] },
  foot: { questionnaires: ['Lower Extremity Functional Scale'] },
  ankle: { questionnaires: ['Lower Extremity Functional Scale'] },
  knee: { questionnaires: ['Lower Extremity Functional Scale'] },
  hip: { questionnaires: ['Lower Extremity Functional Scale'] }
} as const;

// Treatment options
export const TREATMENT_OPTIONS = [
  // Thermal Therapy
  'Hot pack',
  'Cold pack',
  'Wax therapy',
  'Hydrotherapy',
  
  // Electrical Therapy
  'Interferential electrical therapy',
  'Neuromuscular electrical stimulation',
  'Transcutaneous Electrical Nerve Stimulation (TENS)',
  'Ultrasound therapy',
  'Pulsed electromagnetic field therapy',
  'Shockwave therapy',
  'Micro-current therapy',
  'Infrared light therapy',
  'Polarized polychromatic light therapy',
  'High electromagnetic inductive therapy',
  'Pulsed shortwave therapy',
  'Flowpulse therapy',
  'Laser therapy',
  
  // Traction Therapy
  'Intermittent lumbar traction',
  'Intermittent neck traction',
  
  // Manual Therapy
  'Manual therapy',
  
  // Exercise Therapy
  'Mobilization exercise',
  'Strengthening exercise',
  'Exercise therapy',
  
  // Functional Training
  'Balance training',
  'Gait training',
  'Functional training',
  
  // Others
  'De-sensitization training',
  'Acupuncture'
] as const;