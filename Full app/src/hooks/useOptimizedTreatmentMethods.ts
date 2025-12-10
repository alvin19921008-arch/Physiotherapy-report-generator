import { useMemo } from 'react';
import { TREATMENT_OPTIONS } from '@/constants';
import { measurePerformance } from '@/utils/performance';

export const useOptimizedTreatmentMethods = (reportData: any, updateReportData: any) => {
  // Memoize treatment options to prevent recreation
  const treatmentOptions = useMemo(() => TREATMENT_OPTIONS, []);

  // Memoized treatment preview generation
  const treatmentPreview = useMemo(() => {
    return measurePerformance('treatmentPreview', () => {
      const items: string[] = [];
      
      reportData.treatments.forEach((treatment: any, index: number) => {
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
    });
  }, [reportData.treatments, reportData.otherTreatment]);

  // Optimized handlers with proper memoization
  const handleTreatmentMethodChange = useMemo(() => (method: string, checked: boolean) => {
    const currentTreatments = reportData.treatments || [];
    
    if (checked) {
      const newTreatment = { method, area: '[treatment area]' };
      updateReportData({ treatments: [...currentTreatments, newTreatment] });
    } else {
      const filteredTreatments = currentTreatments.filter((t: any) => t.method !== method);
      updateReportData({ treatments: filteredTreatments });
    }
  }, [reportData.treatments, updateReportData]);

  const handleTreatmentAreaChange = useMemo(() => (method: string, area: string) => {
    const updatedTreatments = reportData.treatments.map((treatment: any) =>
      treatment.method === method ? { ...treatment, area } : treatment
    );
    updateReportData({ treatments: updatedTreatments });
  }, [reportData.treatments, updateReportData]);

  const handleOtherTreatmentChange = useMemo(() => (value: string) => {
    updateReportData({ otherTreatment: value });
  }, [updateReportData]);

  return {
    treatmentOptions,
    handleTreatmentMethodChange,
    handleTreatmentAreaChange,
    handleOtherTreatmentChange,
    treatmentPreview
  };
};