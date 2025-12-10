import { useState, useCallback } from 'react';

export interface ClinicalFindings {
  date: string;
  complaints: {
    side: string;
    location: string;
    painIntensity: string;
    otherSymptoms: Array<{ symptom: string; intensity: string }>;
    activities1: Array<{ activity: string; duration: string; unit: string }>;
    activities2: Array<{ activity: string; duration: string; unit: string; aid: string }>;
    otherFunctionalLimitation: string;
    overallImprovement: string;
  };
  objectiveFindings: {
    aromMovements: Array<{ movement: string; arom: string; prom: string }>;
    handJoints: Array<{ joint: string; range: string }>;
    fingersToesData: Array<{ name: string; joints: Array<{ jointType: string; range: string }> }>;
    toesROM: string;
    grossFingersROM: string;
    musclePower: Array<{ muscleGroup: string; leftGrade: string; rightGrade: string }>;
    handGripStrength: { leftHandGrip: string; rightHandGrip: string; leftPinchGrip: string; rightPinchGrip: string; leftLateralPinch: string; rightLateralPinch: string };
    myotome: Array<{ level: string; leftGrade: string; rightGrade: string }>;
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
    specialTests: Array<{ 
      testName: string; 
      testType?: 'straight_leg_raise' | 'other'; 
      result?: string; 
      leftResult?: string; 
      rightResult?: string; 
    }>;
    questionnaires: Array<{ name: string; score: string }>;
  };
}

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
  
  // Section 4: Source of Referral
  referralSources: Array<{ episode: string; department: string; hospital: string }>;
  
  // Section 5: Duration of Treatment
  totalSessions: string;
  referralInfo: string;
  registrationDate: string;
  treatmentPeriodStart: string;
  treatmentPeriodEnd: string;
  caseTherapists: string;
  reportWriter: string;
  attendedSessions: string;
  defaultedSessions: string;
  
  // Section 6: Clinical Information
  initialFindings: ClinicalFindings;
  interimFindings: ClinicalFindings;
  finalFindings: ClinicalFindings;
  
  // Section 7: Treatment
  treatments: Array<{ method: string; area: string }>;
  otherTreatment: string;
  
  // Section 8: Discharge Summary
  dischargeSummary: {
    painChange: string;
    painIntensity: string;
    symptomChange: string;
    symptomIntensity: string;
    activityImprovement: {
      from: string;
      to: string;
    };
    aromImprovement: {
      region: string;
      movement: string;
      from: string;
      to: string;
    };
    musclePowerImprovement: {
      region: string;
      muscleGroup: string;
      from: string;
      to: string;
    };
    overallImprovement: string;
    dischargeDate: string;
    summaryText?: string[];
    componentData?: {
      selectedItems?: string[];
      editedTexts?: Record<string, string>;
      itemOrder?: string[];
      dischargeType?: string;
      dischargeDate?: string;
      cancellationDate?: string;
      appointmentDate?: string;
      cancellationReason?: string;
    };
  };
  
  // Declaration
  consentDate: string;
  therapistDetails: {
    name: string;
    title: string;
    qualifications: string;
  };
}

const createEmptyClinicalFindings = (): ClinicalFindings => ({
  date: '',
  complaints: {
    side: '',
    location: '',
    painIntensity: '',
    otherSymptoms: [{ symptom: '', intensity: '' }],
    activities1: [{ activity: '', duration: '', unit: 'minutes' }],
    activities2: [{ activity: '', duration: '', unit: 'minutes', aid: '' }],
    otherFunctionalLimitation: '',
    overallImprovement: ''
  },
  objectiveFindings: {
    aromMovements: [],
    handJoints: [],
    fingersToesData: [],
    toesROM: '',
    grossFingersROM: '',
    musclePower: [],
    myotome: [],
    handGripStrength: { leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '', rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: '' },
    aromNotTested: false,
    musclePowerNotTested: false,
    handGripNotTested: false,
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
    sensationStatus: 'intact',
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
  }
});

const createInitialReportData = (): ReportData => ({
  ourRef: '',
  ourRef2: '',
  yourRef: '',
  yourRefDate: '',
  reportDate: new Date().toISOString().split('T')[0],
  recipient: '',
  patientName: '',
  patientSex: '',
  patientAge: '',
  hkidNo: '',
  physiotherapyOpdNo: '',
  diagnosis: '',
  referralSources: [{ episode: '1st', department: '', hospital: '' }],
  totalSessions: '',
  referralInfo: '',
  registrationDate: '',
  treatmentPeriodStart: '',
  treatmentPeriodEnd: '',
  caseTherapists: '',
  reportWriter: '',
  attendedSessions: '',
  defaultedSessions: '',
  initialFindings: createEmptyClinicalFindings(),
  interimFindings: createEmptyClinicalFindings(),
  finalFindings: createEmptyClinicalFindings(),
  treatments: [],
  otherTreatment: '',
  dischargeSummary: {
    painChange: '',
    painIntensity: '',
    symptomChange: '',
    symptomIntensity: '',
    activityImprovement: {
      from: '',
      to: ''
    },
    aromImprovement: {
      region: '',
      movement: '',
      from: '',
      to: ''
    },
    musclePowerImprovement: {
      region: '',
      muscleGroup: '',
      from: '',
      to: ''
    },
    overallImprovement: '',
    dischargeDate: ''
  },
  consentDate: '',
  therapistDetails: {
    name: '',
    title: '',
    qualifications: ''
  }
});

export const useReportData = () => {
  const [reportData, setReportData] = useState<ReportData>(createInitialReportData);

  const updateReportData = useCallback((updates: Partial<ReportData>) => {
    setReportData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateNestedField = useCallback((section: keyof ReportData, field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);

  const updateDeepNestedField = useCallback((section: keyof ReportData, subsection: string, field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }));
  }, []);

  const copyInitialToFinalFindings = useCallback(() => {
    setReportData(prev => ({
      ...prev,
      finalFindings: {
        ...JSON.parse(JSON.stringify(prev.initialFindings)),
        date: prev.finalFindings.date
      }
    }));
  }, []);

  const copyInitialToInterimFindings = useCallback(() => {
    setReportData(prev => ({
      ...prev,
      interimFindings: {
        ...JSON.parse(JSON.stringify(prev.initialFindings)),
        date: prev.interimFindings.date
      }
    }));
  }, []);

  const updateClinicalFindings = useCallback((type: 'initialFindings' | 'interimFindings' | 'finalFindings', findings: ClinicalFindings) => {
    setReportData(prev => ({
      ...prev,
      [type]: findings
    }));
  }, []);

  const updateDischargeSummary = useCallback((summary: string[]) => {
    setReportData(prev => ({
      ...prev,
      dischargeSummary: {
        ...prev.dischargeSummary,
        summaryText: summary
      }
    }));
  }, []);

  const updateDischargeSummaryData = useCallback((data: any) => {
    setReportData(prev => ({
      ...prev,
      dischargeSummary: {
        ...prev.dischargeSummary,
        componentData: data
      }
    }));
  }, []);

  return {
    reportData,
    setReportData,
    updateReportData,
    updateNestedField,
    updateDeepNestedField,
    copyInitialToFinalFindings,
    copyInitialToInterimFindings,
    updateClinicalFindings,
    updateDischargeSummary,
    updateDischargeSummaryData
  };
};