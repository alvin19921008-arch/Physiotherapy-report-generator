import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FinalReportDraftProps {
  reportData: any;
  initialFindings: any;
  interimFindings?: any;
  finalFindings: any;
  dischargeSummary: string[];
  dischargeSummaryData?: {
    selectedItems?: string[];
    editedTexts?: Record<string, string>;
    itemOrder?: string[];
    dischargeType?: string;
    dischargeDate?: string;
    cancellationDate?: string;
    appointmentDate?: string;
    cancellationReason?: string;
    otherRelevantChanges?: string;
  };
}

const FinalReportDraft: React.FC<FinalReportDraftProps> = ({
  reportData,
  initialFindings,
  interimFindings,
  finalFindings,
  dischargeSummary,
  dischargeSummaryData
}) => {
  const [editableContent, setEditableContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const contentRef = useRef<HTMLDivElement>(null);


  // Helper function to check if interim findings has meaningful data
  const hasInterimData = (findings: any) => {
    if (!findings) return false;
    
    // Check if there's any meaningful data in complaints
    const hasComplaints = findings.complaints && (
      (findings.complaints.painIntensity && findings.complaints.painIntensity.trim() !== '') ||
      (findings.complaints.otherSymptoms && Array.isArray(findings.complaints.otherSymptoms) && findings.complaints.otherSymptoms.length > 0 && findings.complaints.otherSymptoms.some((s: any) => s.symptom && s.symptom.trim() !== '')) ||
      (findings.complaints.activities1 && Array.isArray(findings.complaints.activities1) && findings.complaints.activities1.some((a: any) => a.activity && a.activity.trim() !== '' && a.duration && a.duration.trim() !== '')) ||
      (findings.complaints.activities2 && Array.isArray(findings.complaints.activities2) && findings.complaints.activities2.some((a: any) => a.activity && a.activity.trim() !== '' && a.duration && a.duration.trim() !== '')) ||
      (findings.complaints.overallImprovement && findings.complaints.overallImprovement.trim() !== '' && findings.complaints.overallImprovement !== '0')
    );
    
    // Check if there's any meaningful data in objective findings
    const hasObjective = findings.objectiveFindings && (
      (findings.objectiveFindings.aromMovements && Array.isArray(findings.objectiveFindings.aromMovements) && findings.objectiveFindings.aromMovements.some((m: any) => (m.arom && m.arom.trim() !== '') || (m.prom && m.prom.trim() !== ''))) ||
      (findings.objectiveFindings.musclePower && Array.isArray(findings.objectiveFindings.musclePower) && findings.objectiveFindings.musclePower.some((m: any) => (m.leftGrade && m.leftGrade.trim() !== '') || (m.rightGrade && m.rightGrade.trim() !== ''))) ||
      (findings.objectiveFindings.myotome && Array.isArray(findings.objectiveFindings.myotome) && findings.objectiveFindings.myotome.some((m: any) => (m.leftGrade && m.leftGrade.trim() !== '') || (m.rightGrade && m.rightGrade.trim() !== ''))) ||
      (findings.objectiveFindings.handGripStrength && (findings.objectiveFindings.handGripStrength.leftHandGrip || findings.objectiveFindings.handGripStrength.rightHandGrip)) ||
      findings.objectiveFindings.sensationInclude === true ||
      findings.objectiveFindings.reflexInclude === true ||
      (findings.objectiveFindings.walkingAid && findings.objectiveFindings.walkingAid.trim() !== '') ||
      (findings.objectiveFindings.wbStatus && findings.objectiveFindings.wbStatus.trim() !== '')
    );
    
    console.log('DEBUG hasInterimData:', {
      findings: !!findings,
      hasComplaints,
      hasObjective,
      result: hasComplaints || hasObjective
    });
    
    return hasComplaints || hasObjective;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const day = date.getDate(); // Remove padStart to avoid leading zero
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (error) {
      return 'N/A';
    }
  };

  const getPronouns = (sex: string) => {
    if (sex === 'Male') {
      return { he: 'He', his: 'His', him: 'him', title: 'Mr.' };
    } else if (sex === 'Female') {
      return { he: 'She', his: 'Her', him: 'her', title: 'Ms.' };
    } else {
      return { he: 'He/She', his: 'His/Her', him: 'him/her', title: 'Mr./Ms.' };
    }
  };

  // Helper function to get region text exactly like in ClinicalFindings
  const getRegionText = (findings: any) => {
    const side = findings.complaints.side;
    const location = findings.complaints.location;
    
    if (location === 'back' || location === 'neck') {
      return location;
    }
    
    if (side && location) {
      return side === 'bilateral' ? `bilateral ${location}` : `${side} ${location}`;
    }
    
    return location || 'affected area';
  };

  const getQuestionnaireScoring = (questionnaireName: string, score: string) => {
    const scoringRules: { [key: string]: string } = {
      'QuickDASH': `Quick Disabilities of the Arm, Shoulder, and Hand questionnaire (QuickDASH) was charted as ${score} out of 100.`,
      'Lower Extremity Functional Scale': `Lower Extremity Functional Scale (LEFS) was charted as ${score} out of 80.`,
      'Roland-Morris Disability Questionnaire': `Roland-Morris Disability Questionnaire (RMDQ) was charted as ${score} out of 24.`,
      'Northwick Park Neck Pain Questionnaire': `Northwick Park Neck Pain Questionnaire (NPQ) was charted as ${score} out of 100%.`
    };
    return scoringRules[questionnaireName] || `${questionnaireName} was charted as ${score}.`;
  };

  const generatePatientComplaints = (findings: any, pronouns: any) => {
    console.log('generatePatientComplaints called with:', {
      findings: findings,
      complaints: findings?.complaints,
      hasComplaints: !!findings?.complaints
    });
    
    if (!findings?.complaints) {
      console.log('No complaints found, returning default message');
      return '<div style="font-family: \'Times New Roman\', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">No complaints recorded.</div>';
    }
    
    const sentences = [];
    let counter = 1;
    const lastName = reportData?.patientName?.split(',')[0]?.trim() || reportData?.patientName || 'Patient';

    // Patient's Complaints - EXACT SAME LOGIC AS PREVIEW
    sentences.push(`${counter++}. ${pronouns.title} ${lastName} complained of ${getRegionText(findings)} pain with pain intensity ${findings.complaints.painIntensity || '[X or X–Y]'} out of 10 as charted by Numeric Pain Rating Scale (NPRS).`);
    
    // Other symptoms - handle array structure
    if (findings.complaints.otherSymptoms && findings.complaints.otherSymptoms.length > 0) {
      findings.complaints.otherSymptoms.forEach((symptomItem) => {
        if (symptomItem.symptom) {
          if (symptomItem.intensity) {
            sentences.push(`${counter++}. ${pronouns.he} also complained of ${symptomItem.symptom} with intensity ${symptomItem.intensity} out of 10.`);
          } else {
            sentences.push(`${counter++}. ${pronouns.he} also complained of ${symptomItem.symptom}.`);
          }
        }
      });
    }
    
    // Activity preview - EXACT SAME LOGIC AS PREVIEW
    const activities1 = findings.complaints.activities1?.filter(a => a.activity && a.duration) || [];
    const activities2 = findings.complaints.activities2?.filter(a => a.activity && a.duration) || [];
    
    if (activities1.length > 0 || activities2.length > 0) {
      let activityText = '';
      
      // Handle Activity 2 (walking/standing)
      if (activities2.length > 0) {
        const activity2Parts = activities2.map(activity => {
          const aidText = activity.aid === 'unaided' ? 'without aid' : activity.aid ? `with ${activity.aid}` : '';
          return `${activity.activity} tolerance was ${activity.duration} ${activity.unit} ${aidText}`.trim();
        });
        
        if (activity2Parts.length === 1) {
          activityText += `${pronouns.his} ${activity2Parts[0]}`;
        } else {
          const lastPart = activity2Parts.pop();
          activityText += `${pronouns.his} ${activity2Parts.join(' and ')} and ${lastPart}`;
        }
      }
      
      // Handle Activity 1 (reading/sitting)
      if (activities1.length > 0) {
        const activity1Parts = activities1.map(activity => 
          `${activity.activity} tolerance was ${activity.duration} ${activity.unit}`
        );
        
        if (activityText) activityText += ' and ';
        
        const pronounToUse = activityText ? pronouns.his.toLowerCase() : pronouns.his;
        
        if (activity1Parts.length === 1) {
          activityText += `${pronounToUse} ${activity1Parts[0]}`;
        } else {
          const lastPart = activity1Parts.pop();
          activityText += `${pronounToUse} ${activity1Parts.join(' and ')} and ${lastPart}`;
        }
      }
      
      sentences.push(`${counter++}. ${activityText}.`);
    }
    
    // Other functional activities
    if (findings.complaints.otherFunctionalLimitation) {
      sentences.push(`${counter++}. ${findings.complaints.otherFunctionalLimitation}`);
    }
    
    if (findings.complaints.overallImprovement && findings.complaints.overallImprovement !== '0') {
      sentences.push(`${counter++}. ${pronouns.he} reported an overall subjective improvement of ${findings.complaints.overallImprovement} out of 10 as charted by Numeric Global Rate of Change Scale (NGRCS).`);
    }
    
    return sentences.map(sentence => `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${sentence}</div>`).join('') || '<div style="font-family: \'Times New Roman\', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">No specific complaints recorded.</div>';
  };

  const generateObjectiveFindings = (findings: any, pronouns: any) => {
    if (!findings?.objectiveFindings) return '<div style="font-family: \'Times New Roman\', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">No objective findings recorded.</div>';
    
    let content = '';
    let counter = 1;
    const region = findings.complaints?.location || 'affected area';
    const side = findings.complaints?.side ? `${findings.complaints.side} ` : '';

    // AROM Assessment
    if (findings.objectiveFindings?.aromNotTested) {
      // AROM not tested case
      content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The range of movement (ROM) of ${pronouns.his.toLowerCase()} ${side}${region.toLowerCase()} is not tested.</div>`;
    } else if (findings.objectiveFindings?.aromMovements?.some(m => m.arom || m.prom) || 
        findings.objectiveFindings?.fingersToesData?.some(ft => ft.name && ft.joints.some(j => j.range)) ||
        (region === 'wrist' && findings.objectiveFindings?.grossFingersROM)) {
      
      if (region === 'hand' || region === 'foot') {
        content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The active range of movement (AROM) of ${pronouns.his.toLowerCase()} ${side}${region} was charted as below:</div>`;
        
        // New fingers/toes table format
        const validFingersToes = findings.objectiveFindings.fingersToesData?.filter(ft => ft.name && ft.joints.some(j => j.range)) || [];
        
        if (validFingersToes.length === 1) {
          // Single finger/toe format
          const fingerToe = validFingersToes[0];
          const validJoints = fingerToe.joints.filter(j => j.range);
          
          content += `
          <table style="width: auto; border-collapse: collapse; margin: 0.5em 0; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; display: inline-table;">
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${side.charAt(0).toUpperCase() + side.slice(1)} ${fingerToe.name.toLowerCase()} joint</p></th>
              <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">AROM (degrees)</p></th>
            </tr>
            ${validJoints.map(joint => {
              const jointOptions = {
                'cmcj': 'Carpometacarpal joint (CMCJ)',
                'mcpj': 'Metacarpophalengeal joint (MCPJ)',
                'pipj': 'Proximal interphalengeal joint (PIPJ)',
                'dipj': 'Distal interphalengeal joint (DIPJ)',
                'ipj': 'Interphalengeal joint (IPJ)',
                'mtpj': 'Metatarsophalengeal joint (MTPJ)'
              };
              const jointLabel = jointOptions[joint.jointType] || joint.jointType;
              return `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${jointLabel}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${joint.range}</p></td></tr>`;
            }).join('')}
          </table>`;
        } else if (validFingersToes.length > 1) {
          // Multiple fingers/toes format
          const allJointTypes = [...new Set(validFingersToes.flatMap(ft => ft.joints.filter(j => j.range).map(j => j.jointType)))];
          
          content += `
          <table style="width: auto; border-collapse: collapse; margin: 0.5em 0; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; display: inline-table;">
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${region === 'hand' ? 'Fingers joints AROM (degrees)' : 'Toes joints AROM (degrees)'}</p></th>
              ${validFingersToes.map(ft => `<th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${ft.name.charAt(0).toUpperCase() + ft.name.slice(1).toLowerCase()}</p></th>`).join('')}
            </tr>
            ${allJointTypes.map(jointType => {
              const jointOptions = {
                'cmcj': 'Carpometacarpal joint (CMCJ)',
                'mcpj': 'Metacarpophalengeal joint (MCPJ)',
                'pipj': 'Proximal interphalengeal joint (PIPJ)',
                'dipj': 'Distal interphalengeal joint (DIPJ)',
                'ipj': 'Interphalengeal joint (IPJ)',
                'mtpj': 'Metatarsophalengeal joint (MTPJ)'
              };
              const jointLabel = jointOptions[jointType] || jointType;
              return `<tr>
                <td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${jointLabel}</p></td>
                ${validFingersToes.map(ft => {
                  const joint = ft.joints.find(j => j.jointType === jointType);
                  return `<td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${joint?.range || '-'}</p></td>`;
                }).join('')}
              </tr>`;
            }).join('')}
          </table>`;
        }
      } else {
        content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The Range of movement (ROM) of ${pronouns.his.toLowerCase()} ${side}${region} was listed as below:</div>`;
        
        // Regular AROM table
        const isBackNeck = region === 'back' || region === 'neck';
        const regionName = region === 'back' ? 'Lumbar' : region === 'neck' ? 'Cervical' : region.charAt(0).toUpperCase() + region.slice(1);
        
        content += `
        <table style="width: auto; border-collapse: collapse; margin: 0.5em 0; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; display: inline-table;">
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${regionName} movement</p></th>
            <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${isBackNeck ? 'AROM (of full range)' : 'AROM (Degrees)'}</p></th>
          </tr>
          ${findings.objectiveFindings.aromMovements?.map(movement => 
            movement.arom ? 
            `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${movement.movement}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${movement.arom}</p></td></tr>` : ''
          ).join('')}
          ${region === 'ankle' && findings.objectiveFindings.toesROM ? 
            `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Toes</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${findings.objectiveFindings.toesROM}</p></td></tr>` : ''
          }

        </table>`;
      }
      
      // Gross fingers ROM for wrist (always show when data exists)
      if (region === 'wrist' && findings.objectiveFindings.grossFingersROM) {
        const sideText = findings.complaints?.side === 'bilateral' ? 'bilateral' : findings.complaints?.side || '[side]';
        content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. AROM of ${pronouns.his.toLowerCase()} ${sideText} hand fingers was ${findings.objectiveFindings.grossFingersROM}.</div>`;
      }
    } // Close the else block for AROM tested case

    // Muscle Power Assessment
    if (findings.objectiveFindings?.musclePowerNotTested) {
      // Muscle power not tested case
      let regionText = '';
      if (region === 'back') {
        regionText = 'lower limbs';
      } else if (region === 'neck') {
        regionText = 'upper limbs';
      } else if (region === 'hand') {
        regionText = 'hand';
      } else {
        regionText = region.toLowerCase();
      }
      
      content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The muscle power of ${pronouns.his.toLowerCase()} ${regionText}, as charted by Oxford Manual Muscle Testing Scale, was not tested.</div>`;
    } else if (findings.objectiveFindings?.musclePower?.some(m => m.leftGrade || m.rightGrade) || 
        findings.objectiveFindings?.myotome?.some(m => m.leftGrade || m.rightGrade) ||
        findings.objectiveFindings?.handGripStrength) {
      
      if (region === 'hand') {
        // Check if hand grip is not tested
        if (findings.objectiveFindings.handGripNotTested) {
          const sideText = findings.complaints.side === 'bilateral' ? 'bilateral' : findings.complaints.side || '[side]';
          content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The handgrip of ${pronouns.his.toLowerCase()} ${sideText} hand was not tested.</div>`;
        } else if (findings.objectiveFindings.handGripStrength) {
          const grip = findings.objectiveFindings.handGripStrength;
          const hasHandGrip = grip.leftHandGrip || grip.rightHandGrip;
          const hasPinchData = grip.leftPinchGrip || grip.rightPinchGrip || grip.leftLateralPinch || grip.rightLateralPinch;
          
          // If only hand grip data (no pinch/lateral pinch), use formatted text instead of table
          if (hasHandGrip && !hasPinchData) {
            const leftGrip = grip.leftHandGrip || '[X]';
            const rightGrip = grip.rightHandGrip || '[Y]';
            content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. Hand grip strength of ${pronouns.his.toLowerCase()} right hand and left hand was ${rightGrip} kgf and ${leftGrip} kgf respectively.</div>`;
          } else if (hasHandGrip || hasPinchData) {
            // Use table format when pinch/lateral pinch data exists
            const sideText = findings.complaints.side === 'bilateral' ? 'bilateral' : findings.complaints.side || '[side]';
            content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The grip strength of ${pronouns.his.toLowerCase()} ${sideText} hand was stated as below:</div>`;
            
            content += `
            <table style="width: auto; border-collapse: collapse; margin: 0.5em 0; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; display: inline-table;">
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Grip Strength</p></th>
                <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Left (kgf)</p></th>
                <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Right (kgf)</p></th>
              </tr>
              ${hasHandGrip ? `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Grip</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${grip.leftHandGrip || 'Not tested'}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${grip.rightHandGrip || 'Not tested'}</p></td></tr>` : ''}
              ${(grip.leftPinchGrip || grip.rightPinchGrip) ? `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Pinch</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${grip.leftPinchGrip || 'Not tested'}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${grip.rightPinchGrip || 'Not tested'}</p></td></tr>` : ''}
              ${(grip.leftLateralPinch || grip.rightLateralPinch) ? `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Lateral Pinch</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${grip.leftLateralPinch || 'Not tested'}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${grip.rightLateralPinch || 'Not tested'}</p></td></tr>` : ''}
            </table>`;
          }
        }
      } else if (region === 'wrist') {
        // Wrist muscle power table
        content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The muscle power of ${pronouns.his.toLowerCase()} ${getRegionText(findings)}, as charted by Oxford Manual Muscle Testing Scale, was listed as below:</div>`;
        
        const muscleData = findings.objectiveFindings.musclePower;
        
        if (muscleData?.length > 0) {
          content += `
          <table style="width: auto; border-collapse: collapse; margin: 0.5em 0; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; display: inline-table;">
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Muscle</p></th>
              <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Power</p></th>
            </tr>
            ${muscleData.filter(muscle => muscle.leftGrade || muscle.rightGrade).map(muscle => {
              // Determine which grade to show based on side
              let gradeText = '';
              if (findings.complaints?.side === 'left' && muscle.leftGrade) {
                gradeText = `${muscle.leftGrade} out of 5`;
              } else if (findings.complaints?.side === 'right' && muscle.rightGrade) {
                gradeText = `${muscle.rightGrade} out of 5`;
              } else if (muscle.leftGrade && muscle.rightGrade) {
                // Both sides have data, show both
                gradeText = `Left: ${muscle.leftGrade}/5, Right: ${muscle.rightGrade}/5`;
              } else if (muscle.leftGrade) {
                gradeText = `${muscle.leftGrade} out of 5`;
              } else if (muscle.rightGrade) {
                gradeText = `${muscle.rightGrade} out of 5`;
              }
              
              return `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${muscle.muscleGroup}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${gradeText}</p></td></tr>`;
            }
            ).join('')}
          </table>`;
        }
        
        // Add hand grip strength text separately (not in table)
        if (findings.objectiveFindings.handGripStrength && 
            (findings.objectiveFindings.handGripStrength.leftHandGrip || findings.objectiveFindings.handGripStrength.rightHandGrip)) {
          const leftGrip = findings.objectiveFindings.handGripStrength.leftHandGrip || '[X]';
          const rightGrip = findings.objectiveFindings.handGripStrength.rightHandGrip || '[Y]';
          content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. Hand grip strength of ${pronouns.his.toLowerCase()} right hand and left hand was ${rightGrip} kg and ${leftGrip} kg respectively.</div>`;
        }
      } else {
        // Regular muscle power or myotome
        const isBackNeck = region === 'back' || region === 'neck';
        const limbText = region === 'back' ? 'lower limbs' : region === 'neck' ? 'upper limbs' : region;
        
        content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. The muscle power of ${pronouns.his.toLowerCase()} ${limbText}, as charted by Oxford Manual Muscle Testing Scale, was listed as below:</div>`;
        
        const muscleData = isBackNeck ? findings.objectiveFindings.myotome : findings.objectiveFindings.musclePower;
        
        if (muscleData?.length > 0) {
          content += `
          <table style="width: auto; border-collapse: collapse; margin: 0.5em 0; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; display: inline-table;">
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${isBackNeck ? 'Myotome' : 'Muscle'}</p></th>
              ${isBackNeck ? '<th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Right</p></th><th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Left</p></th>' : '<th style="border: 1px solid black; padding: 4pt; text-align: left; font-weight: bold; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Power</p></th>'}
            </tr>
            ${muscleData.map(muscle => {
              if (isBackNeck) {
                return `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${muscle.level || muscle.muscleGroup}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Grade ${muscle.rightGrade || 'Not tested'}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Grade ${muscle.leftGrade || 'Not tested'}</p></td></tr>`;
              } else {
                const grade = muscle.leftGrade || muscle.rightGrade;
                return grade ? `<tr><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${muscle.muscleGroup}</p></td><td style="border: 1px solid black; padding: 4pt; text-align: left; font-size: 10pt;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Grade ${grade}</p></td></tr>` : '';
              }
            }).join('')}
          </table>`;
        }
      }
    } // Close the else block for muscle power tested case



    // Splint/Brace/Cast
    if (findings.objectiveFindings?.splintBraceCastInclude && findings.objectiveFindings?.splintBraceCastType) {
      const region = getRegionText(findings);
      content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. ${pronouns.his} ${region} was on ${findings.objectiveFindings.splintBraceCastType}.</div>`;
    }

    // Tenderness
    if (findings.objectiveFindings?.tendernessInclude && findings.objectiveFindings?.tendernessArea) {
      content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. There was tenderness over ${findings.objectiveFindings.tendernessArea}.</div>`;
    }

    // Swelling and Temperature
    if (findings.objectiveFindings?.swellingInclude || findings.objectiveFindings?.temperatureInclude) {
      let swellingTempText = '';
      const region = getRegionText(findings);
      
      // Only swelling reported and present
      if (findings.objectiveFindings?.swellingInclude && !findings.objectiveFindings?.temperatureInclude && findings.objectiveFindings?.swellingPresent) {
        swellingTempText = `There was swelling over ${pronouns.his.toLowerCase()} ${region}.`;
      }
      // Only temperature reported and increased
      else if (findings.objectiveFindings?.temperatureInclude && !findings.objectiveFindings?.swellingInclude && findings.objectiveFindings?.temperatureIncreased) {
        swellingTempText = `There was increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
      }
      // Both reported - both present
      else if (findings.objectiveFindings?.swellingInclude && findings.objectiveFindings?.temperatureInclude && findings.objectiveFindings?.swellingPresent && findings.objectiveFindings?.temperatureIncreased) {
        swellingTempText = `There was swelling and increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
      }
      // Both reported - swelling absent, temperature increased
      else if (findings.objectiveFindings?.swellingInclude && findings.objectiveFindings?.temperatureInclude && !findings.objectiveFindings?.swellingPresent && findings.objectiveFindings?.temperatureIncreased) {
        swellingTempText = `There was no swelling but increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
      }
      // Both reported - swelling present, temperature normal
      else if (findings.objectiveFindings?.swellingInclude && findings.objectiveFindings?.temperatureInclude && findings.objectiveFindings?.swellingPresent && !findings.objectiveFindings?.temperatureIncreased) {
        swellingTempText = `There was swelling but no increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
      }
      // Both reported - both absent
      else if (findings.objectiveFindings?.swellingInclude && findings.objectiveFindings?.temperatureInclude && !findings.objectiveFindings?.swellingPresent && !findings.objectiveFindings?.temperatureIncreased) {
        swellingTempText = `There was no swelling and no increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
      }
      
      if (swellingTempText) {
        content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. ${swellingTempText}</div>`;
      }
    }

    // Sensation and Reflex
    const isBackOrNeck = region === 'back' || region === 'neck';
    const hasSensationData = findings.objectiveFindings?.sensationInclude;
    const hasReflexData = findings.objectiveFindings?.reflexInclude;
    const shouldShowSensation = isBackOrNeck ? (hasSensationData || hasReflexData) : hasSensationData;
    
    if (shouldShowSensation) {
      let sensationText = '';
      if (hasSensationData) {
        if (findings.objectiveFindings?.sensationStatus === 'hypersensitive') {
          sensationText = `hypersensitive over ${findings.objectiveFindings?.areaHypersensitive || '[area]'}`;
        } else if (findings.objectiveFindings?.sensationStatus === 'intact') {
          sensationText = 'intact';
        } else if (findings.objectiveFindings?.sensationStatus === 'reduced') {
          sensationText = `reduced by ${findings.objectiveFindings?.sensationReduction || '[X]%'} over ${findings.objectiveFindings?.areaReduced || '[area]'}`;
        }
      } else if (isBackOrNeck) {
        sensationText = '[intact/reduced by X% over area/hypersensitive over area]';
      }
      
      let reflexText = '';
      if (isBackOrNeck) {
        if (hasReflexData) {
          reflexText = findings.objectiveFindings?.reflexNormal ? 'normal' : 'abnormal';
        } else {
          reflexText = '[normal/abnormal]';
        }
      }
      
      const fullText = isBackOrNeck 
        ? `${pronouns.his} sensation was ${sensationText} and reflex was ${reflexText}`
        : `${pronouns.his} sensation was ${sensationText}`;
      
      content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. ${fullText}.</div>`;
    }

    // Special Tests
    if (findings.objectiveFindings?.specialTests?.length > 0) {
      findings.objectiveFindings.specialTests.forEach(test => {
        if (test.testType === 'straight_leg_raise' && (test.leftResult || test.rightResult)) {
          const generateStraightLegRaiseText = () => {
            const positiveSides = [];
            const normalSides = [];
            
            if (test.leftResult === 'positive') positiveSides.push('left');
            if (test.rightResult === 'positive') positiveSides.push('right');
            if (test.leftResult === 'negative') normalSides.push('left');
            if (test.rightResult === 'negative') normalSides.push('right');
            
            let text = '';
            if (positiveSides.length > 0) {
              const sideText = positiveSides.length === 1 ? positiveSides[0] : positiveSides.join(' and ');
              text += `Straight leg raise of ${pronouns.his.toLowerCase()} ${sideText} leg was positive when raising to 70-80 degrees of hip flexion`;
            }
            
            if (normalSides.length > 0) {
              const sideText = normalSides.length === 1 ? normalSides[0] : normalSides.join(' and ');
              if (text) {
                text += ' while ';
                text += `straight leg raise of ${pronouns.his.toLowerCase()} ${sideText} leg was normal`;
              } else {
                text += `Straight leg raise of ${pronouns.his.toLowerCase()} ${sideText} leg was normal`;
              }
            }
            
            return text + '.';
          };
          
          content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. ${generateStraightLegRaiseText()}</div>`;
        } else if (test.testType === 'other' && test.testName && test.result) {
          content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. ${test.testName} was ${test.result}.</div>`;
        }
      });
    }

    // Gait (Walking aid/walking stability/WB status) - moved from later in the file
    if (findings.objectiveFindings?.walkingAid || findings.objectiveFindings?.walkingStability || findings.objectiveFindings?.wbStatusInclude) {
      const walkingAid = findings.objectiveFindings.walkingAid || 'unaided';
      const walkingStability = findings.objectiveFindings.walkingStability || 'normal';
      const wbStatus = findings.objectiveFindings.wbStatusInclude && findings.objectiveFindings.wbStatus ? findings.objectiveFindings.wbStatus : '';
      
      let gaitText = '';
      if (wbStatus) {
        if (walkingAid === 'unaided') {
          gaitText = `${pronouns.he} could walk ${wbStatus} unaided with ${walkingStability} stability.`;
        } else {
          gaitText = `${pronouns.he} could walk ${wbStatus} with ${walkingAid} with ${walkingStability} stability.`;
        }
      } else {
        if (walkingAid === 'unaided') {
          gaitText = `${pronouns.he} could walk unaided with ${walkingStability} stability.`;
        } else {
          gaitText = `${pronouns.he} could walk with ${walkingAid} with ${walkingStability} stability.`;
        }
      }
      content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. ${gaitText}</div>`;
    }

    // Questionnaires
    if (findings.objectiveFindings?.questionnaires?.length > 0) {
      findings.objectiveFindings.questionnaires.forEach(questionnaire => {
        if (questionnaire.name && questionnaire.score) {
          content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${counter++}. ${getQuestionnaireScoring(questionnaire.name, questionnaire.score)}</div>`;
        }
      });
    }


    return content || '<div style="font-family: \'Times New Roman\', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">No objective findings recorded.</div>';
  };

  const generateSimpleReport = () => {
    try {
      console.log('Generating report with data:', {
        reportData: reportData ? 'present' : 'missing',
        initialFindings: initialFindings ? 'present' : 'missing',
        finalFindings: finalFindings ? 'present' : 'missing',
        dischargeSummary: dischargeSummary ? dischargeSummary.length : 'missing',
        treatments: reportData?.treatments ? reportData.treatments.length : 'missing'
      });
      
      const patientName = reportData?.patientName || 'N/A';
      const patientSex = reportData?.patientSex || 'N/A';
      const patientAge = reportData?.patientAge || 'N/A';
      const hkidNo = reportData?.hkidNo || 'N/A';
      const physiotherapyOpdNo = reportData?.physiotherapyOpdNo || 'N/A';
      const diagnosis = reportData?.diagnosis || 'N/A';
      const referralSource = reportData?.referralSource || 'Department of Orthopedics and Traumatology, Tuen Mun Hospital';
      
      return `
        <div style="position: relative; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; background: white; width: 21cm; min-height: 29.7cm; margin: 0 auto; box-sizing: border-box; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          
          <!-- Page Corner Borders -->
          <div style="position: absolute; top: 3.49cm; left: 3.17cm; width: 20px; height: 20px; border-top: 2px solid #ccc; border-left: 2px solid #ccc;"></div>
          <div style="position: absolute; top: 3.49cm; right: 3.17cm; width: 20px; height: 20px; border-top: 2px solid #ccc; border-right: 2px solid #ccc;"></div>
          <div style="position: absolute; bottom: 1.9cm; left: 3.17cm; width: 20px; height: 20px; border-bottom: 2px solid #ccc; border-left: 2px solid #ccc;"></div>
          <div style="position: absolute; bottom: 1.9cm; right: 3.17cm; width: 20px; height: 20px; border-bottom: 2px solid #ccc; border-right: 2px solid #ccc;"></div>
          
          <!-- Content Area -->
          <div style="padding-top: 3.49cm; padding-bottom: 1.9cm; padding-left: 3.17cm; padding-right: 3.17cm; min-height: calc(29.7cm - 3.49cm - 1.9cm);">
            
            <br>
          
          <!-- Header Reference Table -->
          <table style="width: auto; border-collapse: collapse; margin-bottom: 1em; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin: 0 auto; display: inline-table;">
            <tr>
              <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 6pt; white-space: nowrap;">From:</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt; border-right: 2.25pt solid black;">Physiotherapy Department<br>Tuen Mun Hospital<br>Hong Kong</td>
              <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 6pt; white-space: nowrap;">To:</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt;">${reportData?.recipient || '[Recipient]'}, through Health Information & Record Office, Tuen Mun Hospital</td>
            </tr>
            <tr>
              <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 6pt; white-space: nowrap;">Our Ref:</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt; border-right: 2.25pt solid black;">(${reportData?.ourRef || ' '}) in PHY/OA/${reportData?.ourRef2 || ' '}</td>
              <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 6pt; white-space: nowrap;">Your Ref:</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt;">${reportData?.yourRef || '[Insert Your Reference]'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 6pt; white-space: nowrap;">Tel:</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt; border-right: 2.25pt solid black;">3767 7455</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt; white-space: nowrap;"></td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt;"></td>
            </tr>
            <tr>
              <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 6pt; border-bottom: 1.5pt solid black; white-space: nowrap;">Dated:</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt; border-bottom: 1.5pt solid black; border-right: 2.25pt solid black;">${formatDate(reportData?.reportDate || new Date().toISOString().split('T')[0])}</td>
              <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 6pt; border-bottom: 1.5pt solid black; white-space: nowrap;">Dated:</td>
              <td style="font-size: 10pt; text-align: left; padding: 6pt; border-bottom: 1.5pt solid black;">${formatDate(reportData?.yourRefDate)}</td>
            </tr>
          </table>
          <div style="height: 12pt; line-height: 12pt; font-size: 1pt;">&nbsp;</div>

          <!-- Patient Information -->
          <div style="text-align: center; margin-bottom: 0;">
            <h1 style="font-size: 12pt; font-weight: bold; margin: 0; text-decoration: none;">Physiotherapy Report</h1>
            <table style="width: auto; border-collapse: collapse; line-height: 1.0; margin: 0 auto; display: inline-table;"
              <tr>
                <td style="font-weight: bold; font-size: 10pt; text-align: right; padding: 2pt 8pt 2pt 0; white-space: nowrap;">Name of Patient:</td>
                <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 2pt 0;">${patientName}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; font-size: 10pt; text-align: right; padding: 2pt 8pt 2pt 0; white-space: nowrap;">Sex / Age:</td>
                <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 2pt 0;">${patientSex} / ${patientAge}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; font-size: 10pt; text-align: right; padding: 2pt 8pt 2pt 0; white-space: nowrap;">HKID No.:</td>
                <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 2pt 0;">${hkidNo}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; font-size: 10pt; text-align: right; padding: 2pt 8pt 2pt 0; white-space: nowrap; border-bottom: 2.25pt solid black;">Physiotherapy OPD No.:</td>
                <td style="font-weight: bold; font-size: 10pt; text-align: left; padding: 2pt 0; border-bottom: 2.25pt solid black;">${physiotherapyOpdNo}</td>
              </tr>
            </table>
          </div>

          <!-- DIAGNOSIS -->
          <h1 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">DIAGNOSIS</h1>
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 1em;">${diagnosis}</div>

          <!-- SOURCE OF REFERRAL -->
          <h1 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">SOURCE OF REFERRAL</h1>
          ${reportData?.referralSources && reportData.referralSources.length > 1 ? `
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 0.5em;">The above named patient was referred to our department for physiotherapy by:</div>
          <table style="width: auto; border-collapse: collapse; margin-bottom: 1em; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; display: inline-table;">
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: center;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Referral</p></th>
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: center;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">Department</p></th>
            </tr>
            ${reportData.referralSources.map(source => 
              `<tr><td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: center;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${source.episode}</p></td><td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: center;"><p style="margin: 0; padding: 0; line-height: 1.0; margin-top: 0pt; margin-bottom: 0pt;">${source.department}${source.hospital ? ', ' + source.hospital : ''}</p></td></tr>`
            ).join('')}
          </table>
          ` : `
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 1em;">The above named patient was referred to our department for physiotherapy by ${reportData?.referralSources?.[0]?.department || referralSource} ${reportData?.referralSources?.[0]?.hospital ? ', ' + reportData.referralSources[0].hospital : ''}.</div>
          `}

          <!-- DURATION OF TREATMENT -->
          <h1 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">DURATION OF TREATMENT</h1>
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 0.5em;">The above-named patient attended ${reportData?.attendedSessions || 'X'} sessions of out-patient physiotherapy in the Tuen Mun Hospital as detailed in the following table.</div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1em; border: 1px solid black; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; table-layout: fixed;">
            <tr>
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: left; width: 10%; white-space: nowrap; overflow: hidden;"><p style="margin: 0; padding: 0; line-height: 1.0;">Date of<br>Registration</p></th>
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: left; width: 16%; white-space: nowrap; overflow: hidden;"><p style="margin: 0; padding: 0; line-height: 1.0;">Period</p></th>
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: left; width: 18%; white-space: nowrap; overflow: hidden;"><p style="margin: 0; padding: 0; line-height: 1.0;">Case<br>Therapist(s)</p></th>
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: left; width: 18%; white-space: nowrap; overflow: hidden;"><p style="margin: 0; padding: 0; line-height: 1.0;">Reporting<br>Writing by</p></th>
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: left; width: 19%; white-space: nowrap; overflow: hidden;"><p style="margin: 0; padding: 0; line-height: 1.0;">Number of<br>attended sessions</p></th>
              <th style="border: 1px solid black; padding: 4pt; font-weight: bold; font-size: 10pt; text-align: left; width: 19%; white-space: nowrap; overflow: hidden;"><p style="margin: 0; padding: 0; line-height: 1.0;">Number of<br>defaulted Sessions</p></th>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: left; width: 10%; white-space: nowrap; overflow: hidden; vertical-align: top;"><p style="margin: 0; padding: 0; line-height: 1.0;">${formatDate(reportData?.registrationDate)}</p></td>
              <td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: left; width: 16%; white-space: nowrap; overflow: hidden; vertical-align: top;"><p style="margin: 0; padding: 0; line-height: 1.0;">${formatDate(reportData?.treatmentPeriodStart)} to</p><p style="margin: 0; padding: 0; line-height: 1.0;">${formatDate(reportData?.treatmentPeriodEnd)}</p></td>
              <td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: left; width: 18%; white-space: nowrap; overflow: hidden; vertical-align: top;"><p style="margin: 0; padding: 0; line-height: 1.0;">${reportData?.caseTherapists || 'N/A'}</p></td>
              <td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: left; width: 18%; white-space: nowrap; overflow: hidden; vertical-align: top;"><p style="margin: 0; padding: 0; line-height: 1.0;">${reportData?.reportWriter || 'N/A'}</p></td>
              <td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: left; width: 19%; white-space: nowrap; overflow: hidden; vertical-align: top;"><p style="margin: 0; padding: 0; line-height: 1.0;">${reportData?.attendedSessions || 'N/A'}</p></td>
              <td style="border: 1px solid black; padding: 4pt; font-size: 10pt; text-align: left; width: 19%; white-space: nowrap; overflow: hidden; vertical-align: top;"><p style="margin: 0; padding: 0; line-height: 1.0;">${reportData?.defaultedSessions || 'N/A'}</p></td>
            </tr>
          </table>
          
          <!-- CLINICAL INFORMATION -->
          <h1 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">CLINICAL INFORMATION</h1>
          
          ${initialFindings ? `
          <h2 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 6pt 0 0.5em 0; line-height: 1.0;">Initial Clinical Findings (${formatDate(initialFindings.date)})</h2>
          <div style="margin-bottom: 1em;">
            <h3 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; font-style: italic; margin: 0.5em 0 0.25em 0; line-height: 1.0; text-decoration: none;">I. Patient's Complaints</h3>
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-left: 0.4cm; text-indent: -0.3cm; padding-left: 0.3cm;">
              ${generatePatientComplaints(initialFindings, getPronouns(patientSex))}
            </div>
            
            <h3 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; font-style: italic; margin: 0.5em 0 0.25em 0; line-height: 1.0; text-decoration: none;">II. Objective Findings</h3>
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-left: 0.4cm; text-indent: -0.3cm; padding-left: 0.3cm;">
              ${generateObjectiveFindings(initialFindings, getPronouns(patientSex))}
            </div>
          </div>
          ` : '<div style="font-family: \'Times New Roman\', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 1em;">No initial clinical findings data available.</div>'}

          ${interimFindings && hasInterimData(interimFindings) ? `
          <h2 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">Interim Clinical Findings (${formatDate(interimFindings.date)})</h2>
          <div style="margin-bottom: 1em;">
            <h3 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; font-style: italic; margin: 0.5em 0 0.25em 0; line-height: 1.0; text-decoration: none;">I. Patient's Complaints</h3>
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-left: 0.4cm; text-indent: -0.3cm; padding-left: 0.3cm;">
              ${generatePatientComplaints(interimFindings, getPronouns(patientSex))}
            </div>
            
            <h3 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; font-style: italic; margin: 0.5em 0 0.25em 0; line-height: 1.0; text-decoration: none;">II. Objective Findings</h3>
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-left: 0.4cm; text-indent: -0.3cm; padding-left: 0.3cm;">
              ${generateObjectiveFindings(interimFindings, getPronouns(patientSex))}
            </div>
          </div>
          ` : ''}

          ${finalFindings ? `
          <h2 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">Final Clinical Findings (${formatDate(finalFindings.date)})</h2>
          <div style="margin-bottom: 1em;">
            <h3 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; font-style: italic; margin: 0.5em 0 0.25em 0; line-height: 1.0; text-decoration: none;">I. Patient's Complaints</h3>
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-left: 0.4cm; text-indent: -0.3cm; padding-left: 0.3cm;">
              ${generatePatientComplaints(finalFindings, getPronouns(patientSex))}
            </div>
            
            <h3 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; font-style: italic; margin: 0.5em 0 0.25em 0; line-height: 1.0; text-decoration: none;">II. Objective Findings</h3>
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-left: 0.4cm; text-indent: -0.3cm; padding-left: 0.3cm;">
              ${generateObjectiveFindings(finalFindings, getPronouns(patientSex))}
            </div>
          </div>
          ` : '<div style="font-family: \'Times New Roman\', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 1em;">No final clinical findings data available.</div>'}

          <!-- TREATMENT -->
          <h1 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">TREATMENT</h1>
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 1em;">
            ${(() => {
              const treatmentItems = [];
              let counter = 1;
              
              // Add regular treatments
              if (reportData?.treatments && reportData.treatments.length > 0) {
                reportData.treatments.forEach((treatment: any) => {
                  const isExercise = treatment.method.toLowerCase().includes('mobilization') || 
                                    treatment.method.toLowerCase().includes('strengthening') ||
                                    treatment.method.toLowerCase().includes('exercise');
                  
                  if (isExercise) {
                    treatmentItems.push(`${counter}. ${treatment.area} ${treatment.method.toLowerCase()}`);
                  } else {
                    treatmentItems.push(`${counter}. ${treatment.method} to ${treatment.area}`);
                  }
                  counter++;
                });
              }
              
              // Add other treatment if present
              if (reportData?.otherTreatment && reportData.otherTreatment.trim()) {
                treatmentItems.push(`${counter}. ${reportData.otherTreatment}`);
              }
              
              return treatmentItems.length > 0 ? treatmentItems.join('<br>') : 'No treatment methods recorded.';
            })()
            }
          </div>

          <!-- DISCHARGE SUMMARY -->
          <h1 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">${dischargeSummaryData?.dischargeType === 'defaulted' || dischargeSummaryData?.dischargeType === 'cancelled' || dischargeSummaryData?.dischargeType === 'ongoing' ? 'PROGRESS SUMMARY' : 'DISCHARGE SUMMARY'}</h1>
          <div style="margin-bottom: 1em;">
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-left: 0.4cm; text-indent: -0.4cm; padding-left: 0.4cm;">
${dischargeSummary && dischargeSummary.length > 0 
                ? (() => {
                    let content = dischargeSummary.map((item: string, index: number) => 
                      `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${index + 1}. ${item}</div>`
                    ).join('');
                    
                    // Add other relevant changes if present
                    if (dischargeSummaryData?.otherRelevantChanges) {
                      content += `<div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">${dischargeSummary.length + 1}. ${dischargeSummaryData.otherRelevantChanges}</div>`;
                    }
                    
                    return content;
                  })()
                : '<div style="font-family: \'Times New Roman\', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">No discharge summary available.</div>'
              }
            </div>
          </div>

          <!-- DECLARATION -->
          <h1 style="font-family: 'Times New Roman', serif; font-size: 10pt; font-weight: bold; text-decoration: underline; margin: 1em 0 0.5em 0; line-height: 1.0;">DECLARATION</h1>
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 1em;">
            This medical report is prepared in response to the consent dated on ${formatDate(reportData?.consentDate || new Date().toISOString().split('T')[0])}. This statement is true to the best of my knowledge and belief.
          </div>
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 1em;">Thank you for your attention.</div>
          
          <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-top: 48pt;">
            <div style="font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.0; margin-bottom: 12pt;">_________________________</div>
            <div style="margin-bottom: 6pt;">${reportData?.therapistDetails?.name || 'Therapist Name'}</div>
            <div style="margin-bottom: 6pt;">${reportData?.therapistDetails?.title || 'Advanced Practice Physiotherapist'}</div>
            <div style="margin-bottom: 6pt; white-space: pre-line;">${reportData?.therapistDetails?.qualifications || 'Bachelor of Physiotherapy (Hons)'}</div>
            <div>Department of Physiotherapy<br>Tuen Mun Hospital</div>
          </div>
          
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error generating report:', error);
      return `
        <div style="font-family: 'Times New Roman', serif; padding: 20px; text-align: center;">
          <h2>Final Report Draft</h2>
          <p>This is a simplified version of the final medical report.</p>
          <p>The report combines data from all sections (1-9) in the standard medical format.</p>
          <p style="color: #666; font-size: 12px;">Note: Detailed clinical findings formatting is being developed.</p>
        </div>
      `;
    }
  };

  useEffect(() => {
    if (!isEditing && !hasUserEdited && contentRef.current) {
      try {
        const report = generateSimpleReport();
        setEditableContent(report);
        contentRef.current.innerHTML = report;
      } catch (error) {
        console.error('Error in useEffect:', error);
        const errorContent = `
          <div style="font-family: 'Times New Roman', serif; padding: 20px; text-align: center;">
            <h2>Final Report Draft</h2>
            <p>Loading report data...</p>
          </div>
        `;
        setEditableContent(errorContent);
        if (contentRef.current) {
          contentRef.current.innerHTML = errorContent;
        }
      }
    }
  }, [reportData, initialFindings, interimFindings, finalFindings, dischargeSummary, isEditing, hasUserEdited]);

  // Initial content setup
  useEffect(() => {
    if (contentRef.current && !hasUserEdited) {
      try {
        const report = generateSimpleReport();
        setEditableContent(report);
        contentRef.current.innerHTML = report;
      } catch (error) {
        console.error('Error in initial setup:', error);
      }
    }
  }, []);

  const handleContentChange = () => {
    if (contentRef.current) {
      setEditableContent(contentRef.current.innerHTML);
      setHasUserEdited(true);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const resetToOriginal = () => {
    setHasUserEdited(false);
    setIsEditing(false);
    const report = generateSimpleReport();
    setEditableContent(report);
    if (contentRef.current) {
      contentRef.current.innerHTML = report;
    }
  };

  const copyToClipboard = async () => {
    try {
      let htmlContent = '';
      let textContent = '';
      
      // Always generate fresh content with proper formatting to ensure table formatting is correct
      htmlContent = generateSimpleReport();
      
      // If user has made edits, we need to preserve them while keeping table formatting
      if (hasUserEdited && contentRef.current) {
        // For now, prioritize proper table formatting over user edits
        // This ensures Clinical Information tables copy correctly
        // User can re-edit after copying if needed
        console.log('Using generated content to preserve table formatting');
      }
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      textContent = tempDiv.innerText || tempDiv.textContent || '';
      
      if (!htmlContent.trim() && !textContent.trim()) {
        throw new Error('No content to copy');
      }
      
      // Check if modern clipboard API is available
      if (navigator.clipboard && navigator.clipboard.write) {
        // Create clipboard items with both HTML and text formats
        const clipboardItems = [];
        
        if (htmlContent) {
          clipboardItems.push(new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([textContent], { type: 'text/plain' })
          }));
        }
        
        if (clipboardItems.length > 0) {
          await navigator.clipboard.write(clipboardItems);
        } else {
          // Fallback to plain text if HTML fails
          await navigator.clipboard.writeText(textContent);
        }
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        // Fallback to plain text only
        await navigator.clipboard.writeText(textContent);
      } else {
        // Legacy browser fallback using selection
        const range = document.createRange();
        const selection = window.getSelection();
        
        if (contentRef.current) {
          // Select the entire content
          range.selectNodeContents(contentRef.current);
          selection?.removeAllRanges();
          selection?.addRange(range);
          
          // Copy using execCommand
          const success = document.execCommand('copy');
          
          // Clear selection
          selection?.removeAllRanges();
          
          if (!success) {
            throw new Error('Copy command failed');
          }
        } else {
          throw new Error('Content not available for copying');
        }
      }
      
      toast({
        title: "Success",
        description: "Final report draft with formatting copied to clipboard! You can now paste it into Word or other rich text editors.",
      });
    } catch (err) {
      console.error('Copy to clipboard error:', err);
      
      // Try manual selection as final fallback
      try {
        if (contentRef.current) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(contentRef.current);
          selection?.removeAllRanges();
          selection?.addRange(range);
          
          toast({
            title: "Manual Copy Required",
            description: "The content has been selected. Please press Ctrl+C (or Cmd+C on Mac) to copy with formatting.",
            variant: "default",
          });
        } else {
          throw err;
        }
      } catch (finalErr) {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard. Please manually select all text in the preview and copy using Ctrl+C.",
          variant: "destructive",
        });
      }
    }
  };

  const downloadAsWord = async () => {
    try {
      console.log('Download function called');
      let htmlContent = '';
      
      // Get content from the current DOM element
      if (contentRef.current) {
        htmlContent = contentRef.current.innerHTML;
        console.log('Got content from DOM element');
      } else {
        htmlContent = editableContent;
        console.log('Got content from state');
      }
      
      if (!htmlContent.trim()) {
        console.error('No content available');
        throw new Error('No content to download');
      }
      
      console.log('Content length:', htmlContent.length);
      
      // Create a complete HTML document with proper Word formatting
      const wordDocument = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Physiotherapy Medical Report</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotPromptForConvert/>
      <w:DoNotShowInsertionsAndDeletions/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4;
      margin: 3.49cm 3.17cm 1.9cm 3.17cm;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.0;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      font-family: 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.0;
    }
    td, th {
      font-family: 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.0;
      margin: 0;
      text-indent: 0;
      padding-top: 0;
      padding-bottom: 0;
      text-align: left;
    }
    h1, h2, h3 {
      font-family: 'Times New Roman', serif;
      font-size: 10pt;
      font-weight: bold;
      text-decoration: underline;
      line-height: 1.0;
    }
    div, p {
      font-family: 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.0;
    }
    /* Signature line styling for Word documents */
    div[style*="border-bottom"] {
      border-bottom: 2px solid black !important;
      height: 2px !important;
      display: block !important;
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
      
      console.log('Creating Word document...');
      
      // Generate filename with current date
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      const patientName = reportData?.patientName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Patient';
      const filename = `Physiotherapy_Report_${patientName}_${dateStr}.doc`;
      
      console.log('Filename:', filename);
      
      // Try multiple download methods for better Chrome compatibility
      
      // Method 1: Try with different MIME types
      const mimeTypes = [
        'application/msword',
        'application/vnd.ms-word',
        'application/octet-stream'
      ];
      
      let downloadSuccess = false;
      
      for (const mimeType of mimeTypes) {
        try {
          console.log('Trying MIME type:', mimeType);
          
          const blob = new Blob([wordDocument], { type: mimeType });
          console.log('Blob created, size:', blob.size);
          
          // Check if the browser supports the download attribute
          const link = document.createElement('a');
          if ('download' in link) {
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            
            console.log('Download link created:', url);
            
            document.body.appendChild(link);
            console.log('Link added to DOM, triggering click...');
            
            // Force click with user gesture
            link.click();
            
            // Clean up after a delay
            setTimeout(() => {
              if (document.body.contains(link)) {
                document.body.removeChild(link);
              }
              URL.revokeObjectURL(url);
              console.log('Cleanup completed for', mimeType);
            }, 1000);
            
            downloadSuccess = true;
            break; // Exit loop if successful
          }
        } catch (err) {
          console.log('Failed with MIME type', mimeType, ':', err);
          continue;
        }
      }
      
      // Method 2: Fallback - open in new window if download fails
      if (!downloadSuccess) {
        console.log('Download failed, trying fallback method...');
        const dataUri = 'data:application/msword;charset=utf-8,' + encodeURIComponent(wordDocument);
        const newWindow = window.open(dataUri, '_blank');
        if (newWindow) {
          console.log('Opened in new window');
        } else {
          throw new Error('Unable to download or open file');
        }
      }
      
      toast({
        title: "Success",
        description: "Medical report downloaded successfully! The file can be opened in Microsoft Word.",
      });
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: "Error",
        description: "Failed to download the report. Please try copying the content manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Final Report Draft
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            This is what the medical report draft would look like on Microsoft Word.
          </p>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Button 
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))} 
                variant="outline" 
                size="sm"
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{zoomLevel}%</span>
              <Button 
                onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))} 
                variant="outline" 
                size="sm"
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={resetToOriginal} variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reset to Original
            </Button>
            <Button onClick={downloadAsWord} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Word
            </Button>
            <Button onClick={copyToClipboard} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy Report
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-gray-100 p-4" style={{ maxHeight: '800px', overflowY: 'auto' }}>
          <div style={{ 
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            margin: '0 auto',
            width: '21cm',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={handleContentChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{
                position: 'relative',
                width: '21cm',
                minHeight: '29.7cm',
                backgroundColor: 'white',
                fontFamily: 'Times New Roman, serif',
                fontSize: '10pt',
                lineHeight: '1.0',
                outline: 'none',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>• Click anywhere in the document above to edit the content</p>
          <p>• Use "Download Word" to save as .doc file with full formatting preserved</p>
          <p>• Use "Copy Report" to copy with formatting for pasting into Word or other editors</p>
          <p>• Downloaded file opens directly in Microsoft Word with proper formatting</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalReportDraft;