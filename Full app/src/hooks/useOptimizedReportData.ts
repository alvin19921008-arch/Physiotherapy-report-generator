import { useMemo, useCallback } from 'react';
import { useReportData, ReportData } from './useReportData';

// Debounced state management hook
export const useOptimizedReportData = () => {
  const baseHook = useReportData();

  // Memoize frequently accessed data slices
  const patientData = useMemo(() => ({
    patientName: baseHook.reportData.patientName,
    patientSex: baseHook.reportData.patientSex,
    patientAge: baseHook.reportData.patientAge,
    hkidNo: baseHook.reportData.hkidNo,
    physiotherapyOpdNo: baseHook.reportData.physiotherapyOpdNo
  }), [
    baseHook.reportData.patientName,
    baseHook.reportData.patientSex,
    baseHook.reportData.patientAge,
    baseHook.reportData.hkidNo,
    baseHook.reportData.physiotherapyOpdNo
  ]);

  const referenceData = useMemo(() => ({
    ourRef: baseHook.reportData.ourRef,
    ourRef2: baseHook.reportData.ourRef2,
    yourRef: baseHook.reportData.yourRef,
    yourRefDate: baseHook.reportData.yourRefDate,
    reportDate: baseHook.reportData.reportDate,
    recipient: baseHook.reportData.recipient
  }), [
    baseHook.reportData.ourRef,
    baseHook.reportData.ourRef2,
    baseHook.reportData.yourRef,
    baseHook.reportData.yourRefDate,
    baseHook.reportData.reportDate,
    baseHook.reportData.recipient
  ]);

  const treatmentData = useMemo(() => ({
    totalSessions: baseHook.reportData.totalSessions,
    registrationDate: baseHook.reportData.registrationDate,
    treatmentPeriodStart: baseHook.reportData.treatmentPeriodStart,
    treatmentPeriodEnd: baseHook.reportData.treatmentPeriodEnd,
    caseTherapists: baseHook.reportData.caseTherapists,
    reportWriter: baseHook.reportData.reportWriter,
    attendedSessions: baseHook.reportData.attendedSessions,
    defaultedSessions: baseHook.reportData.defaultedSessions
  }), [
    baseHook.reportData.totalSessions,
    baseHook.reportData.registrationDate,
    baseHook.reportData.treatmentPeriodStart,
    baseHook.reportData.treatmentPeriodEnd,
    baseHook.reportData.caseTherapists,
    baseHook.reportData.reportWriter,
    baseHook.reportData.attendedSessions,
    baseHook.reportData.defaultedSessions
  ]);

  const clinicalData = useMemo(() => ({
    initialFindings: baseHook.reportData.initialFindings,
    interimFindings: baseHook.reportData.interimFindings,
    finalFindings: baseHook.reportData.finalFindings
  }), [
    baseHook.reportData.initialFindings,
    baseHook.reportData.interimFindings,
    baseHook.reportData.finalFindings
  ]);

  // Memoized update functions for specific data slices
  const updatePatientData = useCallback((updates: Partial<typeof patientData>) => {
    baseHook.updateReportData(updates);
  }, [baseHook.updateReportData]);

  const updateReferenceData = useCallback((updates: Partial<typeof referenceData>) => {
    baseHook.updateReportData(updates);
  }, [baseHook.updateReportData]);

  const updateTreatmentData = useCallback((updates: Partial<typeof treatmentData>) => {
    baseHook.updateReportData(updates);
  }, [baseHook.updateReportData]);

  // Memoized derived state
  const hasPatientInfo = useMemo(() => {
    return !!(patientData.patientName && patientData.patientSex && patientData.patientAge);
  }, [patientData.patientName, patientData.patientSex, patientData.patientAge]);

  const hasReferenceInfo = useMemo(() => {
    return !!(referenceData.ourRef && referenceData.reportDate);
  }, [referenceData.ourRef, referenceData.reportDate]);

  const completionStatus = useMemo(() => {
    const sections = {
      reference: hasReferenceInfo,
      patient: hasPatientInfo,
      diagnosis: !!baseHook.reportData.diagnosis,
      referral: baseHook.reportData.referralSources.some(r => r.department && r.hospital),
      treatment: !!treatmentData.totalSessions,
      clinical: !!(clinicalData.initialFindings.date && clinicalData.finalFindings.date),
      methods: baseHook.reportData.treatments.length > 0,
      discharge: !!baseHook.reportData.dischargeSummary?.summaryText?.length,
      declaration: !!baseHook.reportData.therapistDetails.name
    };

    const completed = Object.values(sections).filter(Boolean).length;
    const total = Object.keys(sections).length;
    
    return {
      sections,
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  }, [
    hasReferenceInfo,
    hasPatientInfo,
    baseHook.reportData.diagnosis,
    baseHook.reportData.referralSources,
    treatmentData.totalSessions,
    clinicalData.initialFindings.date,
    clinicalData.finalFindings.date,
    baseHook.reportData.treatments.length,
    baseHook.reportData.dischargeSummary?.summaryText?.length,
    baseHook.reportData.therapistDetails.name
  ]);

  return {
    // Original hook methods
    ...baseHook,
    
    // Optimized data slices
    patientData,
    referenceData,
    treatmentData,
    clinicalData,
    
    // Optimized update methods
    updatePatientData,
    updateReferenceData,
    updateTreatmentData,
    
    // Derived state
    hasPatientInfo,
    hasReferenceInfo,
    completionStatus
  };
};