// Essential Hooks - Copy these to src/hooks/

// ===== src/hooks/useReportData.ts =====
import { useState, useCallback } from 'react';
import { ReportData } from '@/types';

// Initial data structure
const initialReportData: ReportData = {
  // Section 1: Reference Information
  ourRef: '',
  ourRef2: '',
  yourRef: '',
  yourRefDate: '',
  reportDate: '',
  recipient: '',
  
  // Section 2: Patient Information
  patientName: '',
  patientSex: '',
  patientAge: '',
  hkidNo: '',
  physiotherapyOpdNo: '',
  
  // Section 3: Diagnosis
  diagnosis: '',
  
  // Section 4: Referral Sources
  referralSources: [
    {
      episode: 'First',
      department: '',
      hospital: ''
    }
  ],
  
  // Section 5: Duration
  totalSessions: '',
  registrationDate: '',
  startDate: '',
  endDate: '',
  caseTherapists: '',
  reportWrittenBy: '',
  attendedSessions: '',
  defaultedSessions: '',
  
  // Section 6: Clinical Findings
  initialFindings: {
    date: '',
    complaints: {
      location: '',
      side: '',
      duration: '',
      onset: '',
      nature: '',
      severity: '',
      aggravatingFactors: '',
      relievingFactors: '',
      otherSymptoms: []
    },
    objectiveFindings: {
      observation: '',
      arom: [],
      musclePower: [],
      myotome: [],
      fingersToesData: [],
      toesROM: '',
      grossFingersROM: '',
      handGripStrength: {
        leftHandGrip: '',
        rightHandGrip: '',
        leftPinchGrip: '',
        rightPinchGrip: '',
        leftLateralPinch: '',
        rightLateralPinch: ''
      },
      handGripNotTested: false,
      aromNotTested: false,
      musclePowerNotTested: false,
      includeProm: false,
      splintBraceCastInclude: false,
      splintBraceCastType: '',
      tendernessInclude: false,
      tendernessArea: '',
      swellingInclude: false,
      swellingPresent: false,
      temperatureInclude: false,
      temperatureIncreased: false,
      sensationInclude: false,
      sensationStatus: '',
      sensationReduction: '',
      areaReduced: '',
      areaHypersensitive: '',
      reflexInclude: false,
      reflexNormal: true,
      walkingAid: '',
      walkingStability: '',
      wbStatusInclude: false,
      wbStatus: '',
      specialTests: [],
      questionnaires: []
    },
    functionalActivities: {
      activities1: [],
      activities2: [],
      otherFunctionalLimitation: ''
    }
  },
  interimFindings: {
    date: '',
    complaints: {
      location: '',
      side: '',
      duration: '',
      onset: '',
      nature: '',
      severity: '',
      aggravatingFactors: '',
      relievingFactors: '',
      otherSymptoms: []
    },
    objectiveFindings: {
      observation: '',
      arom: [],
      musclePower: [],
      myotome: [],
      fingersToesData: [],
      toesROM: '',
      grossFingersROM: '',
      handGripStrength: {
        leftHandGrip: '',
        rightHandGrip: '',
        leftPinchGrip: '',
        rightPinchGrip: '',
        leftLateralPinch: '',
        rightLateralPinch: ''
      },
      handGripNotTested: false,
      aromNotTested: false,
      musclePowerNotTested: false,
      includeProm: false,
      splintBraceCastInclude: false,
      splintBraceCastType: '',
      tendernessInclude: false,
      tendernessArea: '',
      swellingInclude: false,
      swellingPresent: false,
      temperatureInclude: false,
      temperatureIncreased: false,
      sensationInclude: false,
      sensationStatus: '',
      sensationReduction: '',
      areaReduced: '',
      areaHypersensitive: '',
      reflexInclude: false,
      reflexNormal: true,
      walkingAid: '',
      walkingStability: '',
      wbStatusInclude: false,
      wbStatus: '',
      specialTests: [],
      questionnaires: []
    },
    functionalActivities: {
      activities1: [],
      activities2: [],
      otherFunctionalLimitation: ''
    }
  },
  finalFindings: {
    date: '',
    complaints: {
      location: '',
      side: '',
      duration: '',
      onset: '',
      nature: '',
      severity: '',
      aggravatingFactors: '',
      relievingFactors: '',
      otherSymptoms: []
    },
    objectiveFindings: {
      observation: '',
      arom: [],
      musclePower: [],
      myotome: [],
      fingersToesData: [],
      toesROM: '',
      grossFingersROM: '',
      handGripStrength: {
        leftHandGrip: '',
        rightHandGrip: '',
        leftPinchGrip: '',
        rightPinchGrip: '',
        leftLateralPinch: '',
        rightLateralPinch: ''
      },
      handGripNotTested: false,
      aromNotTested: false,
      musclePowerNotTested: false,
      includeProm: false,
      splintBraceCastInclude: false,
      splintBraceCastType: '',
      tendernessInclude: false,
      tendernessArea: '',
      swellingInclude: false,
      swellingPresent: false,
      temperatureInclude: false,
      temperatureIncreased: false,
      sensationInclude: false,
      sensationStatus: '',
      sensationReduction: '',
      areaReduced: '',
      areaHypersensitive: '',
      reflexInclude: false,
      reflexNormal: true,
      walkingAid: '',
      walkingStability: '',
      wbStatusInclude: false,
      wbStatus: '',
      specialTests: [],
      questionnaires: []
    },
    functionalActivities: {
      activities1: [],
      activities2: [],
      otherFunctionalLimitation: ''
    }
  },
  
  // Section 7: Treatment Methods
  treatments: [],
  
  // Section 8: Discharge Summary
  dischargeSummary: {
    summaryText: [],
    componentData: {
      dischargeType: '',
      dischargeDate: ''
    }
  },
  
  // Section 9: Therapist Details
  therapistDetails: {
    name: '',
    title: '',
    qualifications: ''
  },
  consentDate: '',
  declarationName: '',
  declarationTitle: '',
  educationQualifications: ''
};

export const useReportData = () => {
  const [reportData, setReportData] = useState<ReportData>(initialReportData);

  const updateReportData = useCallback((field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateNestedField = useCallback((path: string, value: any) => {
    setReportData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const copyInitialToFinalFindings = useCallback(() => {
    setReportData(prev => ({
      ...prev,
      finalFindings: {
        ...prev.initialFindings,
        date: prev.finalFindings.date // Keep the final date
      }
    }));
  }, []);

  const copyInitialToInterimFindings = useCallback(() => {
    setReportData(prev => ({
      ...prev,
      interimFindings: {
        ...prev.initialFindings,
        date: prev.interimFindings.date // Keep the interim date
      }
    }));
  }, []);

  const updateClinicalFindings = useCallback((section: string, field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ReportData],
        [field]: value
      }
    }));
  }, []);

  const updateDischargeSummary = useCallback((summaryText: string[]) => {
    setReportData(prev => ({
      ...prev,
      dischargeSummary: {
        ...prev.dischargeSummary,
        summaryText
      }
    }));
  }, []);

  const updateDischargeSummaryData = useCallback((field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      dischargeSummary: {
        ...prev.dischargeSummary,
        componentData: {
          ...prev.dischargeSummary.componentData,
          [field]: value
        }
      }
    }));
  }, []);

  return {
    reportData,
    setReportData,
    updateReportData,
    updateNestedField,
    copyInitialToFinalFindings,
    copyInitialToInterimFindings,
    updateClinicalFindings,
    updateDischargeSummary,
    updateDischargeSummaryData
  };
};

// ===== src/hooks/useMockData.ts =====
import { useState, useCallback } from 'react';
import { ReportData } from '@/types';

export const useMockData = () => {
  const [showMockDataSelector, setShowMockDataSelector] = useState(false);

  const fillMockData = useCallback((scenario: string, setReportData: (data: ReportData) => void, setIncludeInterim: (include: boolean) => void) => {
    // Mock data implementation would go here
    // This is a simplified version - you would implement the full mock data logic
    
    const mockData: Partial<ReportData> = {
      patientName: 'John Doe',
      patientSex: 'Male',
      patientAge: '45',
      diagnosis: `${scenario} related condition`,
      ourRef: 'TMH001',
      reportDate: new Date().toISOString().split('T')[0],
      totalSessions: '12'
    };

    setReportData(prev => ({
      ...prev,
      ...mockData
    }));

    setIncludeInterim(true);
  }, []);

  return {
    showMockDataSelector,
    setShowMockDataSelector,
    fillMockData
  };
};