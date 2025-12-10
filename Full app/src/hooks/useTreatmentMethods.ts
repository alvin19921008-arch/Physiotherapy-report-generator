import { useCallback, useMemo } from 'react';
import { ReportData } from './useReportData';

const TREATMENT_CATEGORIES = {
  'Thermal Therapy': [
    'Hot pack',
    'Cold pack',
    'Wax therapy',
    'Hydrotherapy'
  ],
  'Electrical Therapy': [
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
    'Laser therapy'
  ],
  'Traction Therapy': [
    'Intermittent lumbar traction',
    'Intermittent neck traction'
  ],
  'Manual Therapy': [
    'Manual therapy'
  ],
  'Exercise Therapy': [
    'Mobilization exercise',
    'Strengthening exercise',
    'Exercise therapy'
  ],
  'Functional Training': [
    'Balance training',
    'Gait training',
    'Functional training'
  ],
  'Others': [
    'De-sensitization training',
    'Acupuncture'
  ]
};

const TREATMENT_OPTIONS = Object.values(TREATMENT_CATEGORIES).flat();

export { TREATMENT_CATEGORIES };

export const useTreatmentMethods = (reportData: ReportData, updateReportData: (updates: Partial<ReportData>) => void) => {
  const handleTreatmentMethodChange = useCallback((method: string, checked: boolean) => {
    if (checked) {
      // Get the region and side from initial findings
      const region = reportData.initialFindings.complaints.location || 'affected area';
      const side = reportData.initialFindings.complaints.side;
      const treatmentArea = side ? `${side} ${region}` : region;
      updateReportData({
        treatments: [...reportData.treatments, { method, area: treatmentArea }]
      });
    } else {
      updateReportData({
        treatments: reportData.treatments.filter(t => t.method !== method)
      });
    }
  }, [reportData.treatments, reportData.initialFindings.complaints, updateReportData]);

  const handleTreatmentAreaChange = useCallback((method: string, area: string) => {
    updateReportData({
      treatments: reportData.treatments.map(t => 
        t.method === method ? { ...t, area } : t
      )
    });
  }, [reportData.treatments, updateReportData]);

  const handleOtherTreatmentChange = useCallback((value: string) => {
    updateReportData({
      otherTreatment: value
    });
  }, [updateReportData]);

  const treatmentPreview = useMemo(() => {
    const items = [];
    
    reportData.treatments.forEach((treatment, index) => {
      const isExercise = treatment.method === 'Mobilization exercise' || treatment.method === 'Strengthening exercise';
      const text = isExercise 
        ? `${treatment.area} ${treatment.method.toLowerCase()}`
        : `${treatment.method.toLowerCase()} to ${treatment.area}`;
      items.push(`${index + 1}. ${text.charAt(0).toUpperCase() + text.slice(1)}.`);
    });

    if (reportData.otherTreatment) {
      items.push(`${reportData.treatments.length + 1}. ${reportData.otherTreatment}.`);
    }

    return items;
  }, [reportData.treatments, reportData.otherTreatment]);

  return {
    treatmentOptions: TREATMENT_OPTIONS,
    handleTreatmentMethodChange,
    handleTreatmentAreaChange,
    handleOtherTreatmentChange,
    treatmentPreview
  };
};