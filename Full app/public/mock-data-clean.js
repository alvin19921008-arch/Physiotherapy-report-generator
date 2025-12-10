// ===== COMPLETELY REWRITTEN MOCK DATA SYSTEM =====
// Clean, structured mock data following proper flow

// Base data function - sets common structure
function fillBaseData() {
    // Section 1: Reference Information
    reportData.ourRef = 'REF2025001';
    reportData.ourRef2 = 'SUB001';
    reportData.yourRef = 'DOC123';
    reportData.yourRefDate = '2024-12-01';
    reportData.reportDate = '2025-01-15';
    reportData.recipient = 'Dr. Wong';
    
    // Section 2: Patient Information
    reportData.patientName = 'CHAN, T. M.';
    reportData.patientSex = 'Male';
    reportData.patientAge = '45';
    reportData.hkidNo = 'A123456(7)';
    reportData.physiotherapyOpdNo = 'PT001234';
    
    // Section 4: Source of Referral
    reportData.referralSources = [{
        episode: 'First',
        department: 'Department of Orthopedics and Traumatology',
        hospital: 'Tuen Mun Hospital'
    }];
    
    // Section 5: Duration of Treatment
    reportData.totalSessions = '8';
    reportData.registrationDate = '2024-12-01';
    reportData.treatmentPeriodStart = '2024-12-15';
    reportData.treatmentPeriodEnd = '2025-01-15';
    reportData.caseTherapists = 'Jane Smith, PT';
    reportData.reportWriter = 'Jane Smith';
    reportData.attendedSessions = '8';
    reportData.defaultedSessions = '0';
    
    // Section 7: Treatment
    reportData.treatments = [
        { method: 'Manual therapy', area: '' },
        { method: 'Exercise therapy', area: '' }
    ];
    reportData.otherTreatment = 'Patient education and home exercise program';
    
    // Section 8: Discharge Summary
    reportData.dischargeSummary = {
        componentData: {
            dischargeType: 'Discharged',
            dischargeDate: '2025-01-15',
            defaultDate: '',
            cancellationDate: '',
            scheduledAppointmentDate: '',
            cancellationReason: ''
        }
    };
    
    // Section 9: Therapist Details
    reportData.consentDate = '2025-01-15';
    reportData.declarationName = 'Jane Smith';
    reportData.declarationTitle = 'Senior Physiotherapist';
    reportData.educationQualifications = 'Bachelor of Physiotherapy, Master of Sports Physiotherapy';
}

// Mock Data Case 1: Back Pain
function fillBackCaseMockData() {
    // Step 1: Fill base data
    fillBaseData();
    
    // Step 2: Set case-specific data
    reportData.diagnosis = 'Chronic lower back pain with muscle spasm and reduced mobility';
    
    // Initial findings
    reportData.initialFindings = {
        date: '2024-12-15',
        complaints: {
            side: 'bilateral',
            location: 'back',
            painIntensity: '8',
            otherSymptoms: [
                { symptom: 'muscle stiffness', intensity: '7' },
                { symptom: 'reduced mobility', intensity: '6' }
            ],
            activities1: [
                { activity: 'sitting', duration: '15', unit: 'minutes' },
                { activity: 'reading', duration: '10', unit: 'minutes' }
            ],
            activities2: [
                { activity: 'walking', duration: '5', unit: 'minutes', aid: 'unaided' },
                { activity: 'standing', duration: '10', unit: 'minutes', aid: 'unaided' }
            ],
            otherFunctionalLimitation: 'He has difficulty with bending and lifting activities. He cannot perform household chores for more than 5 minutes.',
            overallImprovement: '0'
        },
        objectiveFindings: {
            aromMovements: [
                { movement: 'Flexion', arom: '2/5', prom: '' },
                { movement: 'Extension', arom: '2/5', prom: '' },
                { movement: 'Right Rotation', arom: '3/5', prom: '' },
                { movement: 'Left Rotation', arom: '3/5', prom: '' },
                { movement: 'Right Side Flexion', arom: '3/5', prom: '' },
                { movement: 'Left Side Flexion', arom: '3/5', prom: '' }
            ],
            handJoints: [],
            fingersToesData: [],
            toesROM: '',
            grossFingersROM: '',
            musclePower: [],
            handGripStrength: {
                leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '',
                rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: ''
            },
            myotome: [
                { level: 'L2', leftGrade: '4', rightGrade: '4' },
                { level: 'L3', leftGrade: '4', rightGrade: '4' },
                { level: 'L4', leftGrade: '3', rightGrade: '3' },
                { level: 'L5', leftGrade: '3', rightGrade: '3' },
                { level: 'S1', leftGrade: '4', rightGrade: '4' }
            ],
            aromNotTested: false,
            musclePowerNotTested: false,
            includeProm: false,
            splintBraceCastInclude: false,
            splintBraceCastType: '',
            tendernessInclude: true,
            tendernessArea: 'lower lumbar region, bilateral paraspinal muscles',
            swellingInclude: true,
            swellingPresent: false,
            temperatureInclude: true,
            temperatureIncreased: false,
            sensationInclude: true,
            sensationStatus: 'intact',
            sensationReduction: '',
            areaReduced: '',
            areaHypersensitive: '',
            reflexInclude: true,
            reflexNormal: true,
            walkingAid: 'unaided',
            walkingStability: 'fair',
            wbStatusInclude: true,
            wbStatus: 'full weight bearing',
            specialTests: [
                { testType: 'straight_leg_raise', leftResult: 'positive', rightResult: 'negative' },
                { testType: 'other', testName: 'slump test', result: 'positive' }
            ],
            questionnaires: [
                { name: 'Roland-Morris Disability Questionnaire', score: '18' }
            ]
        }
    };
    
    // Final findings
    reportData.finalFindings = {
        date: '2025-01-15',
        complaints: {
            side: 'bilateral',
            location: 'back',
            painIntensity: '2',
            otherSymptoms: [
                { symptom: 'minimal stiffness', intensity: '2' },
                { symptom: 'good mobility', intensity: '1' }
            ],
            activities1: [
                { activity: 'sitting', duration: '60', unit: 'minutes' },
                { activity: 'reading', duration: '45', unit: 'minutes' }
            ],
            activities2: [
                { activity: 'walking', duration: '30', unit: 'minutes', aid: 'unaided' },
                { activity: 'standing', duration: '45', unit: 'minutes', aid: 'unaided' }
            ],
            otherFunctionalLimitation: 'He is able to perform all daily activities without restriction. He can now lift objects up to 10kg without difficulty.',
            overallImprovement: '8'
        },
        objectiveFindings: {
            aromMovements: [
                { movement: 'Flexion', arom: '5/5', prom: '' },
                { movement: 'Extension', arom: '5/5', prom: '' },
                { movement: 'Right Rotation', arom: '5/5', prom: '' },
                { movement: 'Left Rotation', arom: '5/5', prom: '' },
                { movement: 'Right Side Flexion', arom: '5/5', prom: '' },
                { movement: 'Left Side Flexion', arom: '5/5', prom: '' }
            ],
            handJoints: [],
            fingersToesData: [],
            toesROM: '',
            grossFingersROM: '',
            musclePower: [],
            handGripStrength: {
                leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '',
                rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: ''
            },
            myotome: [
                { level: 'L2', leftGrade: '5', rightGrade: '5' },
                { level: 'L3', leftGrade: '5', rightGrade: '5' },
                { level: 'L4', leftGrade: '5', rightGrade: '5' },
                { level: 'L5', leftGrade: '5', rightGrade: '5' },
                { level: 'S1', leftGrade: '5', rightGrade: '5' }
            ],
            aromNotTested: false,
            musclePowerNotTested: false,
            includeProm: false,
            splintBraceCastInclude: false,
            splintBraceCastType: '',
            tendernessInclude: false,
            tendernessArea: '',
            swellingInclude: true,
            swellingPresent: false,
            temperatureInclude: true,
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
            wbStatusInclude: true,
            wbStatus: 'full weight bearing',
            specialTests: [
                { testType: 'straight_leg_raise', leftResult: 'negative', rightResult: 'negative' },
                { testType: 'other', testName: 'slump test', result: 'negative' }
            ],
            questionnaires: [
                { name: 'Roland-Morris Disability Questionnaire', score: '2' }
            ]
        }
    };
    
    // Step 3: Update all form fields
    updateAllFormFields();
    
    // Step 4: Generate dynamic UI elements
    generateClinicalFields('initial', 'back', 'bilateral');
    generateClinicalFields('final', 'back', 'bilateral');
    
    // Step 5: Populate the dynamic elements with data
    populateGeneratedFields('initial');
    populateGeneratedFields('final');
    
    // Step 6: Populate treatment checkboxes
    populateTreatmentCheckboxes();
    
    // Step 7: Populate discharge data
    populateDischargeData();
    
    alert('Back pain case mock data filled successfully!');
}

// Mock Data Case 2: Wrist Fracture
function fillWristCaseMockData() {
    // Step 1: Fill base data
    fillBaseData();
    
    // Step 2: Set case-specific data
    reportData.diagnosis = 'Right wrist fracture with immobilization, post-brace removal rehabilitation';
    
    // Initial findings - AROM and muscle power not tested due to brace
    reportData.initialFindings = {
        date: '2024-12-15',
        complaints: {
            side: 'right',
            location: 'wrist',
            painIntensity: '6',
            otherSymptoms: [
                { symptom: 'stiffness', intensity: '8' },
                { symptom: 'weakness', intensity: '7' }
            ],
            activities1: [
                { activity: 'writing', duration: '2', unit: 'minutes' },
                { activity: 'typing', duration: '5', unit: 'minutes' }
            ],
            activities2: [
                { activity: 'carrying', duration: '1', unit: 'minutes', aid: 'both hands' }
            ],
            otherFunctionalLimitation: 'He is unable to perform fine motor tasks and has difficulty with daily activities requiring wrist movement.',
            overallImprovement: '0'
        },
        objectiveFindings: {
            aromMovements: [
                { movement: 'Flexion', arom: 'not-tested', prom: '' },
                { movement: 'Extension', arom: 'not-tested', prom: '' },
                { movement: 'Pronation', arom: 'not-tested', prom: '' },
                { movement: 'Supination', arom: 'not-tested', prom: '' },
                { movement: 'Radial Deviation', arom: 'not-tested', prom: '' },
                { movement: 'Ulnar Deviation', arom: 'not-tested', prom: '' }
            ],
            handJoints: [],
            fingersToesData: [],
            toesROM: '',
            grossFingersROM: '',
            musclePower: [
                { muscleGroup: 'Wrist flexors', leftGrade: '', rightGrade: 'not-tested' },
                { muscleGroup: 'Wrist extensors', leftGrade: '', rightGrade: 'not-tested' },
                { muscleGroup: 'Pronator teres', leftGrade: '', rightGrade: 'not-tested' },
                { muscleGroup: 'Supinator', leftGrade: '', rightGrade: 'not-tested' }
            ],
            handGripStrength: {
                leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '',
                rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: ''
            },
            myotome: [],
            aromNotTested: true,
            musclePowerNotTested: true,
            includeProm: false,
            splintBraceCastInclude: true,
            splintBraceCastType: 'short arm cast',
            tendernessInclude: true,
            tendernessArea: 'right wrist, radial styloid process',
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
            walkingAid: 'unaided',
            walkingStability: 'good',
            wbStatusInclude: false,
            wbStatus: '',
            specialTests: [],
            questionnaires: [
                { name: 'QuickDASH', score: '68' }
            ]
        }
    };
    
    // Final findings - improvement after brace removal
    reportData.finalFindings = {
        date: '2025-01-15',
        complaints: {
            side: 'right',
            location: 'wrist',
            painIntensity: '2',
            otherSymptoms: [
                { symptom: 'mild stiffness', intensity: '3' },
                { symptom: 'improved strength', intensity: '2' }
            ],
            activities1: [
                { activity: 'writing', duration: '15', unit: 'minutes' },
                { activity: 'typing', duration: '30', unit: 'minutes' }
            ],
            activities2: [
                { activity: 'carrying', duration: '10', unit: 'minutes', aid: 'unaided' }
            ],
            otherFunctionalLimitation: 'He is able to perform most daily activities with minimal difficulty. Some heavy lifting activities remain challenging.',
            overallImprovement: '7'
        },
        objectiveFindings: {
            aromMovements: [
                { movement: 'Flexion', arom: '65', prom: '' },
                { movement: 'Extension', arom: '60', prom: '' },
                { movement: 'Pronation', arom: '75', prom: '' },
                { movement: 'Supination', arom: '70', prom: '' },
                { movement: 'Radial Deviation', arom: '18', prom: '' },
                { movement: 'Ulnar Deviation', arom: '28', prom: '' }
            ],
            handJoints: [],
            fingersToesData: [],
            toesROM: '',
            grossFingersROM: '4/5 of full range',
            musclePower: [
                { muscleGroup: 'Wrist flexors', leftGrade: '', rightGrade: '4' },
                { muscleGroup: 'Wrist extensors', leftGrade: '', rightGrade: '4' },
                { muscleGroup: 'Pronator teres', leftGrade: '', rightGrade: '4' },
                { muscleGroup: 'Supinator', leftGrade: '', rightGrade: '4' }
            ],
            handGripStrength: {
                leftHandGrip: '', rightHandGrip: '28', leftPinchGrip: '',
                rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: ''
            },
            myotome: [],
            aromNotTested: false,
            musclePowerNotTested: false,
            includeProm: false,
            splintBraceCastInclude: false,
            splintBraceCastType: '',
            tendernessInclude: false,
            tendernessArea: '',
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
            wbStatusInclude: false,
            wbStatus: '',
            specialTests: [],
            questionnaires: [
                { name: 'QuickDASH', score: '15' }
            ]
        }
    };
    
    // Step 3: Update all form fields
    updateAllFormFields();
    
    // Step 4: Generate dynamic UI elements
    generateClinicalFields('initial', 'wrist', 'right');
    generateClinicalFields('final', 'wrist', 'right');
    
    // Step 5: Populate the dynamic elements with data
    populateGeneratedFields('initial');
    populateGeneratedFields('final');
    
    // Step 6: Populate treatment checkboxes
    populateTreatmentCheckboxes();
    
    // Step 7: Populate discharge data
    populateDischargeData();
    
    alert('Wrist fracture case mock data filled successfully!');
}

// Mock Data Case 3: Hand Tendon Rupture Repair
function fillHandCaseMockData() {
    // Step 1: Fill base data
    fillBaseData();
    
    // Step 2: Set case-specific data
    reportData.diagnosis = 'Right hand multiple finger tendon rupture repair, post-surgical rehabilitation';
    
    // Initial findings - finger ROM not tested due to splint immobilization
    reportData.initialFindings = {
        date: '2024-12-15',
        complaints: {
            side: 'right',
            location: 'hand',
            painIntensity: '5',
            otherSymptoms: [
                { symptom: 'stiffness in fingers', intensity: '8' },
                { symptom: 'reduced grip strength', intensity: '9' }
            ],
            activities1: [
                { activity: 'writing', duration: '1', unit: 'minutes' },
                { activity: 'buttoning', duration: '0', unit: 'minutes' }
            ],
            activities2: [
                { activity: 'grasping', duration: '0', unit: 'minutes', aid: 'unable' }
            ],
            otherFunctionalLimitation: 'He is unable to perform fine motor activities and is dependent on left hand for all tasks. He cannot button clothes or write properly.',
            overallImprovement: '0'
        },
        objectiveFindings: {
            aromMovements: [],
            handJoints: [],
            fingersToesData: [],
            toesROM: '',
            grossFingersROM: '',
            musclePower: [],
            handGripStrength: {
                leftHandGrip: '', rightHandGrip: '', leftPinchGrip: '',
                rightPinchGrip: '', leftLateralPinch: '', rightLateralPinch: ''
            },
            myotome: [],
            aromNotTested: true,
            musclePowerNotTested: true,
            includeProm: false,
            splintBraceCastInclude: true,
            splintBraceCastType: 'dynamic extension splint',
            tendernessInclude: true,
            tendernessArea: 'right hand, surgical site over flexor tendons',
            swellingInclude: true,
            swellingPresent: true,
            temperatureInclude: false,
            temperatureIncreased: false,
            sensationInclude: true,
            sensationStatus: 'reduced',
            sensationReduction: '50',
            areaReduced: 'fingertips of index, middle, and ring fingers',
            areaHypersensitive: '',
            reflexInclude: false,
            reflexNormal: true,
            walkingAid: 'unaided',
            walkingStability: 'good',
            wbStatusInclude: false,
            wbStatus: '',
            specialTests: [],
            questionnaires: [
                { name: 'QuickDASH', score: '85' }
            ]
        }
    };
    
    // Final findings - improvement after splint removal
    reportData.finalFindings = {
        date: '2025-01-15',
        complaints: {
            side: 'right',
            location: 'hand',
            painIntensity: '1',
            otherSymptoms: [
                { symptom: 'mild finger stiffness', intensity: '3' },
                { symptom: 'improved grip strength', intensity: '2' }
            ],
            activities1: [
                { activity: 'writing', duration: '10', unit: 'minutes' },
                { activity: 'buttoning', duration: '2', unit: 'minutes' }
            ],
            activities2: [
                { activity: 'grasping', duration: '5', unit: 'minutes', aid: 'unaided' }
            ],
            otherFunctionalLimitation: 'He is able to perform most fine motor activities with some difficulty. Heavy gripping activities remain challenging.',
            overallImprovement: '7'
        },
        objectiveFindings: {
            aromMovements: [],
            handJoints: [],
            fingersToesData: [
                {
                    name: 'Index finger',
                    joints: [
                        { jointType: 'mcpj', range: '0-85' },
                        { jointType: 'pipj', range: '0-75' },
                        { jointType: 'dipj', range: '0-60' }
                    ]
                },
                {
                    name: 'Middle finger',
                    joints: [
                        { jointType: 'mcpj', range: '0-80' },
                        { jointType: 'pipj', range: '0-70' },
                        { jointType: 'dipj', range: '0-55' }
                    ]
                },
                {
                    name: 'Ring finger',
                    joints: [
                        { jointType: 'mcpj', range: '0-75' },
                        { jointType: 'pipj', range: '0-65' },
                        { jointType: 'dipj', range: '0-50' }
                    ]
                }
            ],
            toesROM: '',
            grossFingersROM: '',
            musclePower: [],
            handGripStrength: {
                leftHandGrip: '', rightHandGrip: '22', leftPinchGrip: '',
                rightPinchGrip: '4', leftLateralPinch: '', rightLateralPinch: '5'
            },
            myotome: [],
            aromNotTested: false,
            musclePowerNotTested: false,
            includeProm: false,
            splintBraceCastInclude: false,
            splintBraceCastType: '',
            tendernessInclude: false,
            tendernessArea: '',
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
            wbStatusInclude: false,
            wbStatus: '',
            specialTests: [],
            questionnaires: [
                { name: 'QuickDASH', score: '25' }
            ]
        }
    };
    
    // Step 3: Update all form fields
    updateAllFormFields();
    
    // Step 4: Generate dynamic UI elements
    generateClinicalFields('initial', 'hand', 'right');
    generateClinicalFields('final', 'hand', 'right');
    
    // Step 5: Populate the dynamic elements with data
    populateGeneratedFields('initial');
    populateGeneratedFields('final');
    
    // Step 6: Populate treatment checkboxes
    populateTreatmentCheckboxes();
    
    // Step 7: Populate discharge data
    populateDischargeData();
    
    alert('Hand tendon rupture case mock data filled successfully!');
}

// Updated updateAllFormFields function
function updateAllFormFields() {
    // Section 1: Reference Information
    safeSetValue('ourRef', reportData.ourRef);
    safeSetValue('ourRef2', reportData.ourRef2);
    safeSetValue('yourRef', reportData.yourRef);
    safeSetValue('yourRefDate', reportData.yourRefDate);
    safeSetValue('reportDate', reportData.reportDate);
    safeSetValue('recipient', reportData.recipient);
    
    // Section 2: Patient Information
    safeSetValue('patientName', reportData.patientName);
    safeSetValue('patientSex', reportData.patientSex);
    safeSetValue('patientAge', reportData.patientAge);
    safeSetValue('hkidNo', reportData.hkidNo);
    safeSetValue('physiotherapyOpdNo', reportData.physiotherapyOpdNo);
    
    // Section 3: Diagnosis
    safeSetValue('diagnosis', reportData.diagnosis);
    
    // Section 5: Duration of Treatment
    safeSetValue('totalSessions', reportData.totalSessions);
    safeSetValue('registrationDate', reportData.registrationDate);
    safeSetValue('treatmentPeriodStart', reportData.treatmentPeriodStart);
    safeSetValue('treatmentPeriodEnd', reportData.treatmentPeriodEnd);
    safeSetValue('caseTherapists', reportData.caseTherapists);
    safeSetValue('reportWriter', reportData.reportWriter);
    safeSetValue('attendedSessions', reportData.attendedSessions);
    safeSetValue('defaultedSessions', reportData.defaultedSessions);
    
    // Section 6: Clinical Information - Initial
    if (reportData.initialFindings) {
        safeSetValue('initialDate', reportData.initialFindings.date);
        safeSetValue('initialComplaintsSide', reportData.initialFindings.complaints.side);
        safeSetValue('initialPainRegion', reportData.initialFindings.complaints.location);
        safeSetValue('initialPainIntensity', reportData.initialFindings.complaints.painIntensity);
        safeSetValue('initialOtherFunctionalLimitation', reportData.initialFindings.complaints.otherFunctionalLimitation);
        safeSetValue('initialImprovement', reportData.initialFindings.complaints.overallImprovement);
    }
    
    // Section 6: Clinical Information - Final
    if (reportData.finalFindings) {
        safeSetValue('finalDate', reportData.finalFindings.date);
        safeSetValue('finalComplaintsSide', reportData.finalFindings.complaints.side);
        safeSetValue('finalPainRegion', reportData.finalFindings.complaints.location);
        safeSetValue('finalPainIntensity', reportData.finalFindings.complaints.painIntensity);
        safeSetValue('finalOtherFunctionalLimitation', reportData.finalFindings.complaints.otherFunctionalLimitation);
        safeSetValue('finalImprovement', reportData.finalFindings.complaints.overallImprovement);
    }
    
    // Section 7: Treatment
    safeSetValue('otherTreatment', reportData.otherTreatment);
    
    // Section 8: Discharge Summary
    if (reportData.dischargeSummary && reportData.dischargeSummary.componentData) {
        safeSetValue('dischargeType', reportData.dischargeSummary.componentData.dischargeType);
        
        // Trigger discharge type change to show appropriate fields
        var dischargeTypeSelect = document.getElementById('dischargeType');
        if (dischargeTypeSelect && reportData.dischargeSummary.componentData.dischargeType) {
            dischargeTypeSelect.value = reportData.dischargeSummary.componentData.dischargeType;
            updateDischargeType(reportData.dischargeSummary.componentData.dischargeType);
            
            // Populate discharge date after fields are created
            setTimeout(function() {
                if (reportData.dischargeSummary.componentData.dischargeDate) {
                    var dischargeDateInput = document.querySelector('#dischargeFields input[type="date"]');
                    if (dischargeDateInput) {
                        dischargeDateInput.value = reportData.dischargeSummary.componentData.dischargeDate;
                    }
                }
            }, 100);
        }
    }
    
    // Section 9: Therapist Details
    safeSetValue('consentDate', reportData.consentDate);
    safeSetValue('declarationName', reportData.declarationName);
    safeSetValue('declarationTitle', reportData.declarationTitle);
    safeSetValue('educationQualifications', reportData.educationQualifications);
    
    // Render dynamic elements
    if (reportData.initialFindings) {
        renderOtherSymptoms('initial');
        renderActivities1('initial');
        renderActivities2('initial');
    }
    if (reportData.finalFindings) {
        renderOtherSymptoms('final');
        renderActivities1('final');
        renderActivities2('final');
    }
}

// New function to populate treatment checkboxes
function populateTreatmentCheckboxes() {
    if (reportData.treatments && reportData.treatments.length > 0) {
        reportData.treatments.forEach(function(treatment, index) {
            var checkbox = document.querySelector('input[value="' + treatment.method + '"]');
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

// New function to populate discharge data
function populateDischargeData() {
    if (reportData.dischargeSummary && reportData.dischargeSummary.componentData) {
        var dischargeType = document.getElementById('dischargeType');
        if (dischargeType) {
            dischargeType.value = reportData.dischargeSummary.componentData.dischargeType;
        }
        
        var dischargeDate = document.getElementById('dischargeDate');
        if (dischargeDate) {
            dischargeDate.value = reportData.dischargeSummary.componentData.dischargeDate;
        }
    }
}

// Safe value setting function
function safeSetValue(elementId, value) {
    var element = document.getElementById(elementId);
    if (element && value !== undefined && value !== null) {
        element.value = value;
    }
}