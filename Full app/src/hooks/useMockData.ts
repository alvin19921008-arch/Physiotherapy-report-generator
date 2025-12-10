import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReportData, ClinicalFindings } from './useReportData';

interface MockScenarioData {
  reportData: Partial<ReportData>;
  initialFindings: ClinicalFindings;
  finalFindings: ClinicalFindings;
}

export const useMockData = () => {
  const { toast } = useToast();
  const [showMockDataSelector, setShowMockDataSelector] = useState(false);

  const getMockDataByScenario = useCallback((scenario: string, currentDate: string, futureDate: string, interimDate: string): MockScenarioData => {
    const baseData = {
      // Section 1: Reference Information
      ourRef: 'TMH/PHY/2024/001',
      ourRef2: '12345',
      yourRef: 'DOC/REF/2024/456',
      yourRefDate: currentDate,
      reportDate: currentDate,
      recipient: 'Dr. John Smith',
      
      // Section 5: Duration of Treatment
      totalSessions: '12',
      attendedSessions: '10',
      defaultedSessions: '2',
      registrationDate: currentDate,
      treatmentPeriodStart: currentDate,
      treatmentPeriodEnd: futureDate,
      caseTherapists: 'Ms. Chan Mei Ling',
      reportWriter: 'Mr. Li Wing Hong',
      
      // Section 8: Discharge Summary
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
          from: '',
          to: ''
        },
        musclePowerImprovement: {
          region: '',
          from: '',
          to: ''
        },
        componentData: {
          dischargeType: 'completed',
          dischargeDate: futureDate,
          appointmentDate: '',
          cancellationDate: '',
          cancellationReason: ''
        }
      },
      
      // Section 9: Declaration
      consentDate: currentDate,
      therapistDetails: {
        name: 'Mr. Li Wing Hong',
        title: 'Physiotherapist I',
        qualifications: 'BSc (Physiotherapy)\nMember of Hong Kong Physiotherapy Association'
      }
    };

    switch (scenario) {
      case 'back':
        return {
          reportData: {
            ...baseData,
            patientName: 'Chan, David W.K.',
            patientSex: 'Male',
            patientAge: '52',
            hkidNo: 'B234567(8)',
            physiotherapyOpdNo: 'PHY240002',
            diagnosis: 'Lumbar disc herniation L4-L5',
            referralSources: [{ episode: '1st', department: 'Department of Orthopedics and Traumatology', hospital: 'Tuen Mun Hospital' }],
            treatments: [
              { method: 'Manual therapy', area: 'lumbar spine' },
              { method: 'Therapeutic exercise', area: 'core strengthening' }
            ],
            otherTreatment: 'Patient education on back care and ergonomics',
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
                from: '',
                to: ''
              },
              musclePowerImprovement: {
                region: '',
                from: '',
                to: ''
              },
              componentData: {
                dischargeType: 'completed',
                dischargeDate: futureDate,
                appointmentDate: '',
                cancellationDate: '',
                cancellationReason: ''
              }
            }
          },
          initialFindings: {
            date: currentDate,
            complaints: {
              side: 'bilateral',
              location: 'back',
              painIntensity: '8',
              otherSymptoms: [{ symptom: 'numbness', intensity: '7' }, { symptom: 'tingling', intensity: '6' }],
              activities1: [{ activity: 'sitting', duration: '20', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '10', unit: 'minutes', aid: 'unaided' }],
              otherFunctionalLimitation: 'He complains of back pain when bending forward and lifting objects.',
              overallImprovement: ''
            },
            objectiveFindings: {
              aromMovements: [
                { movement: 'Flexion', arom: '1/4', prom: '' },
                { movement: 'Extension', arom: '1/2', prom: '' },
                { movement: 'Left lateral flexion', arom: '1/2', prom: '' },
                { movement: 'Right lateral flexion', arom: '1/2', prom: '' }
              ],
              handJoints: [],
              fingersToesData: [],
              toesROM: '',
              grossFingersROM: '',
              musclePower: [],
              myotome: [
                { level: 'L4', leftGrade: '4', rightGrade: '3' },
                { level: 'L5', leftGrade: '4', rightGrade: '4' },
                { level: 'S1', leftGrade: '4', rightGrade: '4' }
              ],
              handGripStrength: { leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '', rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: '' },
              aromNotTested: false,
              musclePowerNotTested: false,
              handGripNotTested: false,
              includeProm: false,
              tendernessInclude: true,
              tendernessArea: 'L4-L5 paraspinal muscles',
              swellingInclude: false,
              swellingPresent: false,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
              sensationStatus: 'reduced',
              sensationReduction: '20',
              areaReduced: 'L5 dermatome',
              areaHypersensitive: '',
              reflexInclude: true,
              reflexNormal: false,
              walkingAid: 'unaided',
              walkingStability: 'fair',
              wbStatusInclude: false,
              wbStatus: '',
              specialTests: [{ testType: 'straight_leg_raise', leftResult: 'positive', rightResult: 'positive' }],
              questionnaires: [{ name: 'Roland-Morris Disability Questionnaire', score: '18' }]
            }
          },
          finalFindings: {
            date: futureDate,
            complaints: {
              side: 'bilateral',
              location: 'back',
              painIntensity: '3',
              otherSymptoms: [{ symptom: 'mild stiffness', intensity: '2' }],
              activities1: [{ activity: 'sitting', duration: '60', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '30', unit: 'minutes', aid: 'unaided' }],
              otherFunctionalLimitation: 'He can now bend forward and lift light objects without significant pain.',
              overallImprovement: '8'
            },
            objectiveFindings: {
              aromMovements: [
                { movement: 'Flexion', arom: '3/4', prom: '' },
                { movement: 'Extension', arom: 'full', prom: '' },
                { movement: 'Left lateral flexion', arom: 'full', prom: '' },
                { movement: 'Right lateral flexion', arom: 'full', prom: '' }
              ],
              handJoints: [],
              fingersToesData: [],
              toesROM: '',
              grossFingersROM: '',
              musclePower: [],
              myotome: [
                { level: 'L4', leftGrade: '5', rightGrade: '4' },
                { level: 'L5', leftGrade: '5', rightGrade: '5' },
                { level: 'S1', leftGrade: '5', rightGrade: '5' }
              ],
              handGripStrength: { leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '', rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: '' },
              aromNotTested: false,
              musclePowerNotTested: false,
              handGripNotTested: false,
              includeProm: false,
              tendernessInclude: true,
              tendernessArea: 'mild tenderness over L4-L5',
              swellingInclude: false,
              swellingPresent: false,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
              sensationStatus: 'intact',
              sensationReduction: '',
              areaReduced: '',
              areaHypersensitive: '',
              reflexInclude: true,
              reflexNormal: true,
              walkingAid: 'unaided',
              walkingStability: 'good',
              wbStatusInclude: false,
              wbStatus: '',
              specialTests: [{ testType: 'straight_leg_raise', leftResult: 'negative', rightResult: 'negative' }],
              questionnaires: [{ name: 'Roland-Morris Disability Questionnaire', score: '6' }]
            }
          }
        };

      case 'shoulder':
        return {
          reportData: {
            ...baseData,
            patientName: 'Wong, Mary K.L.',
            patientSex: 'Female',
            patientAge: '45',
            hkidNo: 'A123456(7)',
            physiotherapyOpdNo: 'PHY240001',
            diagnosis: 'Right shoulder impingement syndrome',
            referralSources: [{ episode: '1st', department: 'Department of Orthopedics and Traumatology', hospital: 'Tuen Mun Hospital' }],
            treatments: [
              { method: 'Manual therapy', area: 'right shoulder' },
              { method: 'Therapeutic exercise', area: 'right shoulder' }
            ],
            otherTreatment: 'Patient education on posture and ergonomics',
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
                from: '',
                to: ''
              },
              musclePowerImprovement: {
                region: '',
                from: '',
                to: ''
              },
              componentData: {
                dischargeType: 'discharged with static progress',
                dischargeDate: futureDate,
                appointmentDate: interimDate,
                cancellationDate: '',
                cancellationReason: ''
              }
            }
          },
          initialFindings: {
            date: currentDate,
            complaints: {
              side: 'right',
              location: 'shoulder',
              painIntensity: '7',
              otherSymptoms: [{ symptom: 'stiffness', intensity: '6' }, { symptom: 'weakness', intensity: '5' }],
              activities1: [{ activity: 'reading', duration: '5', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '2', unit: 'minutes', aid: 'unaided' }],
              otherFunctionalLimitation: 'She complains of shoulder pain during daily activities and functional movements.',
              overallImprovement: ''
            },
            objectiveFindings: {
              aromMovements: [
                { movement: 'Flexion', arom: '90', prom: '100' },
                { movement: 'Abduction', arom: '80', prom: '90' },
                { movement: 'External rotation', arom: '30', prom: '40' },
                { movement: 'Internal rotation', arom: '40', prom: '50' }
              ],
              handJoints: [],
              fingersToesData: [],
              musclePower: [
                { muscleGroup: 'Flexor', leftGrade: '5', rightGrade: '3' },
                { muscleGroup: 'Abductor', leftGrade: '5', rightGrade: '3' },
                { muscleGroup: 'Extensor', leftGrade: '5', rightGrade: '4' },
                { muscleGroup: 'External Rotator', leftGrade: '5', rightGrade: '3' },
                { muscleGroup: 'Internal Rotator', leftGrade: '5', rightGrade: '4' }
              ],
              myotome: [],
              handGripStrength: { leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '', rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: '' },
              aromNotTested: false,
              musclePowerNotTested: false,
              handGripNotTested: false,
              includeProm: true,
              tendernessInclude: true,
              tendernessArea: 'subacromial space',
              swellingInclude: false,
              swellingPresent: false,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
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
              specialTests: [
                { testName: 'Hawkins test', result: 'positive' },
                { testName: 'Neer test', result: 'positive' }
              ],
              questionnaires: [{ name: 'QuickDASH', score: '65' }]
            }
          },
          finalFindings: {
            date: futureDate,
            complaints: {
              side: 'right',
              location: 'shoulder',
              painIntensity: '2',
              otherSymptoms: [{ symptom: 'mild stiffness', intensity: '1' }],
              activities1: [{ activity: 'reading', duration: '30', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '5', unit: 'minutes', aid: 'unaided' }],
              otherFunctionalLimitation: 'She can now perform daily activities and functional movements with minimal discomfort.',
              overallImprovement: '8'
            },
            objectiveFindings: {
              aromMovements: [
                { movement: 'Flexion', arom: '160', prom: '170' },
                { movement: 'Abduction', arom: '150', prom: '160' },
                { movement: 'External rotation', arom: '70', prom: '80' },
                { movement: 'Internal rotation', arom: '70', prom: '80' }
              ],
              handJoints: [],
              fingersToesData: [],
              toesROM: '',
              grossFingersROM: '',
              musclePower: [
                { muscleGroup: 'Flexor', leftGrade: '5', rightGrade: '5' },
                { muscleGroup: 'Abductor', leftGrade: '5', rightGrade: '4' },
                { muscleGroup: 'Extensor', leftGrade: '5', rightGrade: '5' },
                { muscleGroup: 'External Rotator', leftGrade: '5', rightGrade: '4' },
                { muscleGroup: 'Internal Rotator', leftGrade: '5', rightGrade: '5' }
              ],
              myotome: [],
              handGripStrength: { leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '', rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: '' },
              aromNotTested: false,
              musclePowerNotTested: false,
              handGripNotTested: false,
              includeProm: true,
              tendernessInclude: true,
              tendernessArea: 'mild tenderness over subacromial space',
              swellingInclude: false,
              swellingPresent: false,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
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
              specialTests: [
                { testName: 'Hawkins test', result: 'negative' },
                { testName: 'Neer test', result: 'negative' }
              ],
              questionnaires: [{ name: 'QuickDASH', score: '15' }]
            }
          }
        };

      case 'ankle':
        return {
          reportData: {
            ...baseData,
            patientName: 'Lee, Peter S.H.',
            patientSex: 'Male',
            patientAge: '38',
            hkidNo: 'C345678(9)',
            physiotherapyOpdNo: 'PHY240003',
            diagnosis: 'Right ankle fracture post-surgery',
            referralSources: [{ episode: '1st', department: 'Department of Orthopedics and Traumatology', hospital: 'Tuen Mun Hospital' }],
            treatments: [
              { method: 'Gait training', area: 'right ankle' },
              { method: 'Strengthening exercise', area: 'right ankle' }
            ],
            otherTreatment: 'Progressive weight bearing training',
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
                from: '',
                to: ''
              },
              musclePowerImprovement: {
                region: '',
                from: '',
                to: ''
              },
              componentData: {
                dischargeType: 'cancelled',
                dischargeDate: '',
                appointmentDate: interimDate,
                cancellationDate: futureDate,
                cancellationReason: 'Patient relocated to another city'
              }
            }
          },
          initialFindings: {
            date: currentDate,
            complaints: {
              side: 'right',
              location: 'ankle',
              painIntensity: '6',
              otherSymptoms: [{ symptom: 'swelling', intensity: '7' }, { symptom: 'stiffness', intensity: '6' }],
              activities1: [{ activity: 'standing', duration: '5', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '50', unit: 'minutes', aid: 'frame' }],
              otherFunctionalLimitation: 'He requires walking aid for mobility and cannot bear full weight on right ankle.',
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
              aromNotTested: true,
              musclePowerNotTested: true,
              includeProm: false,
              tendernessInclude: true,
              tendernessArea: 'right ankle joint',
              swellingInclude: true,
              swellingPresent: true,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
              sensationStatus: 'intact',
              sensationReduction: '',
              areaReduced: '',
              areaHypersensitive: '',
              reflexInclude: false,
              reflexNormal: true,
              walkingAid: 'frame',
              walkingStability: 'poor',
              wbStatusInclude: true,
              wbStatus: 'non weight bearing',
              specialTests: [],
              questionnaires: []
            }
          },
          finalFindings: {
            date: futureDate,
            complaints: {
              side: 'right',
              location: 'ankle',
              painIntensity: '2',
              otherSymptoms: [{ symptom: 'mild stiffness', intensity: '2' }],
              activities1: [{ activity: 'standing', duration: '30', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '500', unit: 'minutes', aid: 'unaided' }],
              otherFunctionalLimitation: 'He can now walk independently without aids and bear full weight on right ankle.',
              overallImprovement: '9'
            },
            objectiveFindings: {
              aromMovements: [
                { movement: 'Dorsiflexion', arom: '15', prom: '20' },
                { movement: 'Plantarflexion', arom: '40', prom: '45' },
                { movement: 'Inversion', arom: '25', prom: '30' },
                { movement: 'Eversion', arom: '15', prom: '20' }
              ],
              handJoints: [],
              fingersToesData: [],
              toesROM: '',
              grossFingersROM: '',
              musclePower: [
                { muscleGroup: 'Plantarflexor', leftGrade: '5', rightGrade: '4' },
                { muscleGroup: 'Dorsiflexor', leftGrade: '5', rightGrade: '4' },
                { muscleGroup: 'Evertor', leftGrade: '5', rightGrade: '4' },
                { muscleGroup: 'Invertor', leftGrade: '5', rightGrade: '4' },
                { muscleGroup: 'Toes', leftGrade: '5', rightGrade: '4' }
              ],
              myotome: [],
              handGripStrength: { leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '', rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: '' },
              aromNotTested: false,
              musclePowerNotTested: false,
              handGripNotTested: false,
              includeProm: true,
              tendernessInclude: true,
              tendernessArea: 'mild tenderness over right ankle',
              swellingInclude: true,
              swellingPresent: false,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
              sensationStatus: 'intact',
              sensationReduction: '',
              areaReduced: '',
              areaHypersensitive: '',
              reflexInclude: false,
              reflexNormal: true,
              walkingAid: 'unaided',
              walkingStability: 'good',
              wbStatusInclude: true,
              wbStatus: 'full weight bearing',
              specialTests: [],
              questionnaires: []
            }
          }
        };

      case 'hand':
        return {
          reportData: {
            ...baseData,
            patientName: 'Tam, Susan M.Y.',
            patientSex: 'Female',
            patientAge: '42',
            hkidNo: 'D456789(0)',
            physiotherapyOpdNo: 'PHY240004',
            diagnosis: 'Right hand tendon injury post-repair',
            referralSources: [{ episode: '1st', department: 'Department of Orthopedics and Traumatology', hospital: 'Tuen Mun Hospital' }],
            treatments: [
              { method: 'Manual therapy', area: 'right hand' },
              { method: 'Exercise therapy', area: 'right hand fingers' }
            ],
            otherTreatment: 'Splinting and hand therapy',
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
                from: '',
                to: ''
              },
              musclePowerImprovement: {
                region: '',
                from: '',
                to: ''
              },
              componentData: {
                dischargeType: 'still receiving physiotherapy',
                dischargeDate: '',
                appointmentDate: '',
                cancellationDate: '',
                cancellationReason: ''
              }
            }
          },
          initialFindings: {
            date: currentDate,
            complaints: {
              side: 'right',
              location: 'hand',
              painIntensity: '5',
              otherSymptoms: [{ symptom: 'stiffness', intensity: '6' }, { symptom: 'weakness', intensity: '7' }],
              activities1: [{ activity: 'reading', duration: '2', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '1', unit: 'minutes', aid: 'unaided' }],
              otherFunctionalLimitation: 'She has difficulty with daily activities requiring hand function.',
              overallImprovement: ''
            },
            objectiveFindings: {
              aromMovements: [
                { movement: 'Wrist flexion', arom: '30', prom: '40' },
                { movement: 'Wrist extension', arom: '25', prom: '35' }
              ],
              handJoints: [],
              fingersToesData: [],
              toesROM: '',
              grossFingersROM: '',
              musclePower: [],
              myotome: [],
              handGripStrength: { leftHandGrip: '25', rightHandGrip: 'not tested', leftPinchGrip: '8', rightPinchGrip: 'not tested', leftLateralPinch: '10', rightLateralPinch: 'not tested' },
              aromNotTested: true,
              musclePowerNotTested: false,
              handGripNotTested: false,
              includeProm: true,
              tendernessInclude: true,
              tendernessArea: 'right hand tendons',
              swellingInclude: true,
              swellingPresent: true,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
              sensationStatus: 'reduced',
              sensationReduction: '30',
              areaReduced: 'right index and middle finger',
              areaHypersensitive: '',
              reflexInclude: false,
              reflexNormal: true,
              walkingAid: '',
              walkingStability: '',
              wbStatusInclude: false,
              wbStatus: '',
              specialTests: [],
              questionnaires: [{ name: 'QuickDASH', score: '75' }]
            }
          },
          finalFindings: {
            date: futureDate,
            complaints: {
              side: 'right',
              location: 'hand',
              painIntensity: '1',
              otherSymptoms: [{ symptom: 'mild stiffness', intensity: '1' }],
              activities1: [{ activity: 'reading', duration: '15', unit: 'minutes' }],
              activities2: [{ activity: 'walking', duration: '3', unit: 'minutes', aid: 'unaided' }],
              otherFunctionalLimitation: 'She can now perform daily activities requiring hand function with improved strength.',
              overallImprovement: '8'
            },
            objectiveFindings: {
              aromMovements: [
                { movement: 'Wrist flexion', arom: '70', prom: '80' },
                { movement: 'Wrist extension', arom: '65', prom: '75' }
              ],
              handJoints: [],
              fingersToesData: [
                {
                  name: 'Index finger',
                  joints: [
                    { jointType: 'mcpj', range: '80' },
                    { jointType: 'pipj', range: '90' },
                    { jointType: 'dipj', range: '70' }
                  ]
                },
                {
                  name: 'Middle finger',
                  joints: [
                    { jointType: 'mcpj', range: '85' },
                    { jointType: 'pipj', range: '95' },
                    { jointType: 'dipj', range: '75' }
                  ]
                }
              ],
              toesROM: '',
              grossFingersROM: '',
              musclePower: [],
              myotome: [],
              handGripStrength: { leftHandGrip: '25', rightHandGrip: '20', leftPinchGrip: '8', rightPinchGrip: '6', leftLateralPinch: '10', rightLateralPinch: '8' },
              aromNotTested: false,
              musclePowerNotTested: false,
              handGripNotTested: false,
              includeProm: true,
              tendernessInclude: true,
              tendernessArea: 'mild tenderness over right hand',
              swellingInclude: true,
              swellingPresent: false,
              temperatureInclude: false,
              temperatureIncreased: false,
              sensationInclude: true,
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
              questionnaires: [{ name: 'QuickDASH', score: '20' }]
            }
          }
        };

      default:
        return getMockDataByScenario('shoulder', currentDate, futureDate, interimDate);
    }
  }, []);

  const fillMockData = useCallback((scenario: string, setReportData: (updater: (prev: ReportData) => ReportData) => void, setIncludeInterim: (value: boolean) => void) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const interimDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const scenarioData = getMockDataByScenario(scenario, currentDate, futureDate, interimDate);
      
      setReportData(prev => ({
        ...prev,
        ...scenarioData.reportData,
        initialFindings: scenarioData.initialFindings,
        finalFindings: scenarioData.finalFindings
      }));
      
      setIncludeInterim(true);
      
      toast({
        title: "Mock Data Loaded",
        description: `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} pain scenario loaded successfully.`,
      });
      
      setShowMockDataSelector(false);
    } catch (error) {
      console.error('Error loading mock data:', error);
      toast({
        title: "Error",
        description: "Failed to load mock data. Please try again.",
        variant: "destructive",
      });
    }
  }, [getMockDataByScenario, toast]);

  return {
    showMockDataSelector,
    setShowMockDataSelector,
    fillMockData
  };
};