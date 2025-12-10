import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical } from 'lucide-react';

// Date formatting function
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate(); // Remove padStart to avoid leading zero
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

interface ClinicalFindings {
  date: string;
  complaints: {
    side: string;
    location: string;
    painIntensity: string;
    otherSymptoms: string;
    symptomIntensity: string;
    activity: string;
    activityDuration: string;
    activityUnit: string;
    aidRequired: string;
    overallImprovement: string;
  };
  objectiveFindings: {
    aromMovements: Array<{ movement: string; arom: string; prom: string }>;
    fingersToesData?: Array<{ name: string; joints: Array<{ jointType: string; range: string }> }>;
    toesROM?: string;
    grossFingersROM?: string;
    handGripStrength?: {
      leftHandGrip?: string;
      rightHandGrip?: string;
      leftPinchGrip?: string;
      rightPinchGrip?: string;
      leftLateralPinch?: string;
      rightLateralPinch?: string;
    };
    musclePower: Array<{ muscleGroup: string; grade: string; gripStrength?: string }>;
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
    sensationIntact: boolean;
    sensationReduction: string;
    walkingAid: string;
    walkingStability: string;
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

interface DischargeSummaryProps {
  initialFindings: ClinicalFindings;
  interimFindings?: ClinicalFindings;
  finalFindings: ClinicalFindings;
  patientName: string;
  patientSex: string;
  dischargeSummaryData?: {
    selectedItems?: string[];
    dischargeType?: string;
    dischargeDate?: string;
    cancellationDate?: string;
    appointmentDate?: string;
    cancellationReason?: string;
    otherRelevantChanges?: string;
  };
  onSummaryChange: (summary: string[]) => void;
  onDataChange: (data: any) => void;
}

const DischargeSummaryComponent: React.FC<DischargeSummaryProps> = ({
  initialFindings,
  interimFindings,
  finalFindings,
  patientName,
  patientSex,
  dischargeSummaryData,
  onSummaryChange,
  onDataChange
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(dischargeSummaryData?.selectedItems || []);
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>(dischargeSummaryData?.editedTexts || {});
  const [itemOrder, setItemOrder] = useState<string[]>(dischargeSummaryData?.itemOrder || []);
  const [dischargeType, setDischargeType] = useState<string>(dischargeSummaryData?.dischargeType || 'completed');
  const [dischargeDate, setDischargeDate] = useState<string>(dischargeSummaryData?.dischargeDate || '');
  const [cancellationDate, setCancellationDate] = useState<string>(dischargeSummaryData?.cancellationDate || '');
  const [appointmentDate, setAppointmentDate] = useState<string>(dischargeSummaryData?.appointmentDate || '');
  const [cancellationReason, setCancellationReason] = useState<string>(dischargeSummaryData?.cancellationReason || '');
  const [otherRelevantChanges, setOtherRelevantChanges] = useState<string>(dischargeSummaryData?.otherRelevantChanges || '');

  // Update parent state whenever local state changes
  useEffect(() => {
    const currentData = {
      selectedItems,
      editedTexts,
      itemOrder,
      dischargeType,
      dischargeDate,
      cancellationDate,
      appointmentDate,
      cancellationReason,
      otherRelevantChanges
    };
    onDataChange(currentData);
  }, [selectedItems, editedTexts, itemOrder, dischargeType, dischargeDate, cancellationDate, appointmentDate, cancellationReason, otherRelevantChanges, onDataChange]);

  // Sync with parent data when props change
  useEffect(() => {
    if (dischargeSummaryData) {
      setSelectedItems(dischargeSummaryData.selectedItems || []);
      setDischargeType(dischargeSummaryData.dischargeType || 'completed');
      setDischargeDate(dischargeSummaryData.dischargeDate || '');
      setCancellationDate(dischargeSummaryData.cancellationDate || '');
      setAppointmentDate(dischargeSummaryData.appointmentDate || '');
      setCancellationReason(dischargeSummaryData.cancellationReason || '');
      setOtherRelevantChanges(dischargeSummaryData.otherRelevantChanges || '');
    }
  }, [dischargeSummaryData]);

  const getPronouns = () => {
    if (patientSex === 'Male') {
      return { he: 'He', his: 'His', him: 'him', title: 'Mr.' };
    } else if (patientSex === 'Female') {
      return { he: 'She', his: 'Her', him: 'her', title: 'Ms.' };
    }
    return { he: 'He/She', his: 'His/Her', him: 'him/her', title: 'Mr./Ms.' };
  };

  const pronouns = getPronouns();
  const lastName = patientName.split(',')[0] || patientName.split(' ')[0] || '[Last Name]';

  const getRegionText = (findings: ClinicalFindings) => {
    const side = findings.complaints.side;
    const location = findings.complaints.location;
    
    if (location === 'back' || location === 'neck') {
      return location;
    }
    
    if (side && location) {
      return side === 'bilateral' ? `bilateral ${location}` : `${side} ${location}`;
    }
    
    return location || '[region]';
  };

  const generateComparisonData = () => {
    const comparisons = [];

    // Pain comparison
    if (initialFindings.complaints.painIntensity && finalFindings.complaints.painIntensity) {
      const initial = initialFindings.complaints.painIntensity;
      const final = finalFindings.complaints.painIntensity;
      const region = getRegionText(initialFindings);
      
      let changeText = 'no change of';
      if (final < initial) changeText = 'reduction of';
      if (final > initial) changeText = 'increase of';
      
      comparisons.push({
        id: 'pain',
        category: 'Pain',
        text: `${pronouns.title} ${lastName} reported ${changeText} ${region} pain with pain intensity ${final} out of 10 as charted by NPRS.`
      });
    }

    // Other symptoms comparison
    if (initialFindings.complaints.otherSymptoms && finalFindings.complaints.otherSymptoms && 
        Array.isArray(initialFindings.complaints.otherSymptoms) && Array.isArray(finalFindings.complaints.otherSymptoms) &&
        initialFindings.complaints.otherSymptoms.length > 0 && finalFindings.complaints.otherSymptoms.length > 0) {
      
      // Get the first symptom for comparison (or could aggregate all symptoms)
      const initialSymptom = initialFindings.complaints.otherSymptoms[0];
      const finalSymptom = finalFindings.complaints.otherSymptoms.find(s => s.symptom === initialSymptom.symptom) || finalFindings.complaints.otherSymptoms[0];
      
      const initialIntensity = parseInt(initialSymptom.intensity) || 0;
      const finalIntensity = parseInt(finalSymptom.intensity) || 0;
      
      let changeText = 'no change of';
      if (finalIntensity < initialIntensity) changeText = 'reduction of';
      if (finalIntensity > initialIntensity) changeText = 'increase of';
      
      // Create symptom list text
      const finalSymptomsList = finalFindings.complaints.otherSymptoms.map(s => s.symptom).join(', ');
      
      comparisons.push({
        id: 'symptoms',
        category: 'Other Symptoms',
        text: `${pronouns.he} reported ${changeText} ${finalSymptomsList} with intensity ${finalIntensity} out of 10.`
      });
    }

    // Functional activity comparison - handle activities1 and activities2
    const activityImprovements = [];
    
    // Compare activities1 (sitting/reading)
    const initialActivities1 = initialFindings.complaints.activities1?.filter(a => a.activity && a.duration) || [];
    const finalActivities1 = finalFindings.complaints.activities1?.filter(a => a.activity && a.duration) || [];
    
    initialActivities1.forEach((initialActivity) => {
      const finalActivity = finalActivities1.find(f => f.activity === initialActivity.activity);
      if (finalActivity && initialActivity.duration !== finalActivity.duration) {
        activityImprovements.push(`${pronouns.his.toLowerCase()} ${initialActivity.activity} tolerance improved from ${initialActivity.duration} ${initialActivity.unit} to ${finalActivity.duration} ${finalActivity.unit}`);
      }
    });
    
    // Compare activities2 (walking/standing)
    const initialActivities2 = initialFindings.complaints.activities2?.filter(a => a.activity && a.duration) || [];
    const finalActivities2 = finalFindings.complaints.activities2?.filter(a => a.activity && a.duration) || [];
    
    initialActivities2.forEach((initialActivity) => {
      const finalActivity = finalActivities2.find(f => f.activity === initialActivity.activity);
      if (finalActivity && (initialActivity.duration !== finalActivity.duration || initialActivity.aid !== finalActivity.aid)) {
        const initialAid = initialActivity.aid === 'unaided' ? 'without aid' : initialActivity.aid ? `with ${initialActivity.aid}` : '';
        const finalAid = finalActivity.aid === 'unaided' ? 'without aid' : finalActivity.aid ? `with ${finalActivity.aid}` : '';
        activityImprovements.push(`${pronouns.his.toLowerCase()} ${initialActivity.activity} tolerance improved from ${initialActivity.duration} ${initialActivity.unit} ${initialAid} to ${finalActivity.duration} ${finalActivity.unit} ${finalAid}`.trim());
      }
    });
    
    if (activityImprovements.length > 0) {
      let improvementText = '';
      
      if (activityImprovements.length === 1) {
        improvementText = activityImprovements[0];
      } else {
        const lastImprovement = activityImprovements.pop();
        improvementText = `${activityImprovements.join(' and ')} and ${lastImprovement}`;
      }
      
      // Capitalize only the first letter
      improvementText = improvementText.charAt(0).toUpperCase() + improvementText.slice(1);
      
      comparisons.push({
        id: 'functional_activity',
        category: 'Functional Activity',
        text: `${improvementText}.`
      });
    }

    // WB status comparison
    if (initialFindings.objectiveFindings.wbStatus && finalFindings.objectiveFindings.wbStatus &&
        initialFindings.objectiveFindings.wbStatus !== finalFindings.objectiveFindings.wbStatus) {
      
      const initialWalkingAid = initialFindings.objectiveFindings.walkingAid || 'unaided';
      const finalWalkingAid = finalFindings.objectiveFindings.walkingAid || 'unaided';
      
      // Format walking aid text
      const formatWalkingAidText = (aid: string, wbStatus: string) => {
        if (aid === 'unaided') {
          return `unaided (${wbStatus.toLowerCase()})`;
        } else {
          return `with ${aid} (${wbStatus.toLowerCase()})`;
        }
      };
      
      const initialText = formatWalkingAidText(initialWalkingAid, initialFindings.objectiveFindings.wbStatus);
      const finalText = formatWalkingAidText(finalWalkingAid, finalFindings.objectiveFindings.wbStatus);
      
      comparisons.push({
        id: 'wb_status',
        category: 'WB Status',
        text: `${pronouns.he} improved from walking ${initialText} to walking ${finalText}.`
      });
    }

    // AROM comparison - handle hand/foot regions separately
    console.log('DEBUG: Initial location:', initialFindings.complaints.location);
    console.log('DEBUG: Final location:', finalFindings.complaints.location);
    
    if (initialFindings.complaints.location === 'hand' || initialFindings.complaints.location === 'foot') {
      // Handle ONLY fingers/toes AROM comparison (small joint ranges) for hand/foot regions
      const side = initialFindings.complaints.side ? `${initialFindings.complaints.side} ` : '';
      
      console.log('DEBUG: Hand/Foot region detected - checking small joint ranges only');
      
      // Handle fingers/toes AROM comparison (small joint ranges)
      const initialFingersToesData = initialFindings.objectiveFindings?.fingersToesData || [];
      const finalFingersToesData = finalFindings.objectiveFindings?.fingersToesData || [];
      
      console.log('DEBUG: Initial fingersToesData:', JSON.stringify(initialFingersToesData, null, 2));
      console.log('DEBUG: Final fingersToesData:', JSON.stringify(finalFingersToesData, null, 2));
      console.log('DEBUG: Initial fingersToesData length:', initialFingersToesData.length);
      console.log('DEBUG: Final fingersToesData length:', finalFingersToesData.length);
      
      // Additional debugging for manual input
      console.log('DEBUG: Initial objectiveFindings:', JSON.stringify(initialFindings.objectiveFindings, null, 2));
      console.log('DEBUG: Final objectiveFindings:', JSON.stringify(finalFindings.objectiveFindings, null, 2));
      
      console.log('DEBUG: About to start forEach loop for fingersToesData comparison');
      
      initialFingersToesData.forEach((initialFingerToe, fingerIndex) => {
        const finalFingerToe = finalFingersToesData[fingerIndex];
        console.log(`DEBUG: Comparing finger ${fingerIndex}:`, initialFingerToe, 'vs', finalFingerToe);
        console.log(`DEBUG: Name comparison - Initial: '${initialFingerToe?.name}', Final: '${finalFingerToe?.name}'`);
        // Use case-insensitive comparison for finger/toe names
        if (initialFingerToe && finalFingerToe && 
            initialFingerToe.name && finalFingerToe.name &&
            initialFingerToe.name.toLowerCase().trim() === finalFingerToe.name.toLowerCase().trim()) {
          console.log(`DEBUG: Names match, checking joints for ${initialFingerToe.name}`);
          const jointImprovements = [];
          
          initialFingerToe.joints.forEach((initialJoint, jointIndex) => {
            const finalJoint = finalFingerToe.joints.find(fj => fj.jointType === initialJoint.jointType);
            console.log(`DEBUG: Comparing joint:`, initialJoint, 'vs', finalJoint);
            console.log(`DEBUG: Joint comparison - Initial range: '${initialJoint?.range}', Final range: '${finalJoint?.range}'`);
            console.log(`DEBUG: Range different?`, initialJoint?.range !== finalJoint?.range);
            if (initialJoint && finalJoint && initialJoint.range && finalJoint.range && initialJoint.range !== finalJoint.range) {
              console.log(`DEBUG: Joint improvement detected for ${initialJoint.jointType}`);
              const jointOptions = {
                'cmcj': 'Carpometacarpal joint (CMCJ)',
                'mcpj': 'Metacarpophalengeal joint (MCPJ)',
                'pipj': 'Proximal interphalengeal joint (PIPJ)',
                'dipj': 'Distal interphalengeal joint (DIPJ)',
                'ipj': 'Interphalengeal joint (IPJ)',
                'mtpj': 'Metatarsophalengeal joint (MTPJ)'
              };
              const jointLabel = jointOptions[initialJoint.jointType] || initialJoint.jointType;
              // Apply capitalization rules: first word + specific joint abbreviations
              const formattedJointLabel = jointLabel.toLowerCase().replace(/\b(pipj|dipj|mcpj|ipj|cmcj|mtpj)\b/gi, (match) => match.toUpperCase());
              jointImprovements.push({
                jointLabel: formattedJointLabel,
                initialRange: initialJoint.range,
                finalRange: finalJoint.range
              });
            }
          });
          
          if (jointImprovements.length > 0) {
            let improvementText = '';
            if (jointImprovements.length === 1) {
              const joint = jointImprovements[0];
              improvementText = `${joint.jointLabel} from ${joint.initialRange} degrees to ${joint.finalRange} degrees`;
            } else {
              const jointTexts = jointImprovements.map(joint => `${joint.jointLabel} from ${joint.initialRange} degrees to ${joint.finalRange} degrees`);
              const lastImprovement = jointTexts.pop();
              improvementText = `${jointTexts.join(', ')} and ${lastImprovement}`;
            }
            
            const comparisonItem = {
              id: `arom_${initialFingerToe.name.replace(/\s+/g, '_').toLowerCase()}`,
              category: 'AROM',
              text: `The AROM of ${pronouns.his.toLowerCase()} ${side}${initialFingerToe.name.toLowerCase()} improved, notably in ${improvementText}.`
            };
            console.log('DEBUG: Adding AROM comparison:', comparisonItem);
            comparisons.push(comparisonItem);
          }
        }
      });
      
      console.log('DEBUG: Finished processing all fingersToesData');
      console.log('DEBUG: Total comparisons added so far:', comparisons.length);
      
      // Handle small joint ROM "not tested" to "tested" comparison for hand/foot regions
      if (initialFindings.objectiveFindings.aromNotTested && !finalFindings.objectiveFindings.aromNotTested) {
        const finalFingersToesData = finalFindings.objectiveFindings?.fingersToesData || [];
        const side = initialFindings.complaints.side ? `${initialFindings.complaints.side.toLowerCase()} ` : '';
        
        console.log('DEBUG: Processing not tested to tested for small joints');
        console.log('DEBUG: Final fingersToesData for not tested case:', JSON.stringify(finalFingersToesData, null, 2));
        
        finalFingersToesData.forEach((finalFingerToe) => {
          if (finalFingerToe.name && finalFingerToe.joints.some(j => j.range)) {
            const jointImprovements = [];
            
            finalFingerToe.joints.forEach((finalJoint) => {
              if (finalJoint.range) {
                const jointOptions = {
                  'cmcj': 'Carpometacarpal joint (CMCJ)',
                  'mcpj': 'Metacarpophalengeal joint (MCPJ)',
                  'pipj': 'Proximal interphalengeal joint (PIPJ)',
                  'dipj': 'Distal interphalengeal joint (DIPJ)',
                  'ipj': 'Interphalengeal joint (IPJ)',
                  'mtpj': 'Metatarsophalengeal joint (MTPJ)'
                };
                const jointLabel = jointOptions[finalJoint.jointType] || finalJoint.jointType;
                // Apply capitalization rules: first word + specific joint abbreviations
                const formattedJointLabel = jointLabel.toLowerCase().replace(/\b(pipj|dipj|mcpj|ipj|cmcj|mtpj)\b/gi, (match) => match.toUpperCase());
                jointImprovements.push(`${formattedJointLabel} to ${finalJoint.range} degrees`);
              }
            });
            
            if (jointImprovements.length > 0) {
              let improvementText = '';
              if (jointImprovements.length === 1) {
                improvementText = jointImprovements[0];
              } else {
                const lastImprovement = jointImprovements.pop();
                improvementText = `${jointImprovements.join(' and ')} and ${lastImprovement}`;
              }
              
              const comparisonItem = {
                id: `arom_not_tested_${finalFingerToe.name.replace(/\s+/g, '_').toLowerCase()}`,
                category: 'AROM',
                text: `The active range of movement (AROM) of ${pronouns.his.toLowerCase()} ${side}${finalFingerToe.name.toLowerCase()} improved, notably in ${improvementText}.`
              };
              console.log('DEBUG: Adding not tested to tested AROM comparison:', comparisonItem);
              comparisons.push(comparisonItem);
            }
          }
        });
      }
    } else if (initialFindings.complaints.location === 'ankle') {
      // Handle ankle region with Toes ROM
      const aromImprovements = [];
      
      // Regular AROM movements
      initialFindings.objectiveFindings.aromMovements.forEach((initialMovement, index) => {
        const finalMovement = finalFindings.objectiveFindings.aromMovements[index];
        if (initialMovement && finalMovement && initialMovement.arom && finalMovement.arom) {
          // Check if AROM changed or PROM changed
          const aromChanged = initialMovement.arom !== finalMovement.arom;
          const promChanged = initialMovement.prom && finalMovement.prom && initialMovement.prom !== finalMovement.prom;
          
          if (aromChanged || promChanged) {
            const hasPromData = initialMovement.prom && finalMovement.prom;
            if (hasPromData) {
              aromImprovements.push(`${initialMovement.movement.toLowerCase()} from ${initialMovement.arom}/${initialMovement.prom} to ${finalMovement.arom}/${finalMovement.prom} degrees`);
            } else {
              aromImprovements.push(`${initialMovement.movement.toLowerCase()} from ${initialMovement.arom} to ${finalMovement.arom} degrees`);
            }
          }
        }
      });
      
      // Toes ROM comparison
      const initialToesROM = initialFindings.objectiveFindings.toesROM;
      const finalToesROM = finalFindings.objectiveFindings.toesROM;
      if (initialToesROM && finalToesROM && initialToesROM !== finalToesROM) {
        aromImprovements.push(`toes from ${initialToesROM} to ${finalToesROM}`);
      }
      
      if (aromImprovements.length > 0) {
        const region = getRegionText(initialFindings);
        let improvementText = '';
        
        if (aromImprovements.length === 1) {
          improvementText = aromImprovements[0];
        } else {
          const lastImprovement = aromImprovements.pop();
          improvementText = `${aromImprovements.join(' and ')} and ${lastImprovement}`;
        }
        
        const hasPromData = initialFindings.objectiveFindings.aromMovements.some(m => m.prom) || finalFindings.objectiveFindings.aromMovements.some(m => m.prom);
        const aromPromText = hasPromData ? 'active/passive range of movement (AROM/PROM)' : 'active range of movement (AROM)';
        
        comparisons.push({
          id: 'arom_ankle',
          category: 'AROM',
          text: `The ${aromPromText} of ${pronouns.his.toLowerCase()} ${region} improved, notably in ${improvementText}.`
        });
      }
      
      // Handle ankle AROM "not tested" to "tested" comparison
      if (initialFindings.objectiveFindings.aromNotTested && !finalFindings.objectiveFindings.aromNotTested) {
        const region = getRegionText(initialFindings);
        const aromImprovements = [];
        
        console.log('DEBUG: Processing ankle not tested to tested');
        
        // Regular AROM movements for ankle
        finalFindings.objectiveFindings.aromMovements.forEach((finalMovement) => {
          if (finalMovement.arom) {
            if (finalMovement.prom) {
              aromImprovements.push(`${finalMovement.movement.toLowerCase()} to ${finalMovement.arom}/${finalMovement.prom} degrees`);
            } else {
              aromImprovements.push(`${finalMovement.movement.toLowerCase()} to ${finalMovement.arom} degrees`);
            }
          }
        });
        
        // Toes ROM for ankle
        const finalToesROM = finalFindings.objectiveFindings.toesROM;
        if (finalToesROM) {
          aromImprovements.push(`toes' range of movement to ${finalToesROM.toLowerCase()}`);
        }
        
        if (aromImprovements.length > 0) {
          let improvementText = '';
          if (aromImprovements.length === 1) {
            improvementText = aromImprovements[0];
          } else {
            const lastImprovement = aromImprovements.pop();
            improvementText = `${aromImprovements.join(' and ')} and ${lastImprovement}`;
          }
          
          // Check if PROM data is provided
          const hasPromData = finalFindings.objectiveFindings.aromMovements.some(m => m.prom);
          const aromPromText = hasPromData ? 'active/passive range of movement (AROM/PROM)' : 'active range of movement (AROM)';
          
          comparisons.push({
            id: 'arom_ankle_not_tested',
            category: 'AROM',
          text: `The ${aromPromText} of ${pronouns.his.toLowerCase()} ${region.toLowerCase()} improved, notably in ${improvementText}.`
          });
        }
      }
    } else {
      // Handle regular AROM comparison for other regions
      const aromImprovements = [];
      initialFindings.objectiveFindings.aromMovements.forEach((initialMovement, index) => {
        const finalMovement = finalFindings.objectiveFindings.aromMovements[index];
        if (initialMovement && finalMovement && initialMovement.arom && finalMovement.arom) {
          // Check if AROM changed or PROM changed
          const aromChanged = initialMovement.arom !== finalMovement.arom;
          const promChanged = initialMovement.prom && finalMovement.prom && initialMovement.prom !== finalMovement.prom;
          
          if (aromChanged || promChanged) {
            const isBackNeck = initialFindings.complaints.location === 'back' || initialFindings.complaints.location === 'neck';
            const hasPromData = initialMovement.prom && finalMovement.prom;
            
            if (isBackNeck) {
              if (hasPromData) {
                aromImprovements.push(`${initialMovement.movement.toLowerCase()} from ${initialMovement.arom}/${initialMovement.prom} to ${finalMovement.arom}/${finalMovement.prom} of full range`);
              } else {
                aromImprovements.push(`${initialMovement.movement.toLowerCase()} from ${initialMovement.arom} to ${finalMovement.arom} of full range`);
              }
            } else {
              if (hasPromData) {
                aromImprovements.push(`${initialMovement.movement.toLowerCase()} from ${initialMovement.arom}/${initialMovement.prom} to ${finalMovement.arom}/${finalMovement.prom} degrees`);
              } else {
                aromImprovements.push(`${initialMovement.movement.toLowerCase()} from ${initialMovement.arom} to ${finalMovement.arom} degrees`);
              }
            }
          }
        }
      });
      
      if (aromImprovements.length > 0) {
        const region = getRegionText(initialFindings);
        let improvementText = '';
        
        if (aromImprovements.length === 1) {
          improvementText = aromImprovements[0];
        } else {
          const lastImprovement = aromImprovements.pop();
          improvementText = `${aromImprovements.join(', ')} and ${lastImprovement}`;
        }
        
        // Check if any movement has PROM data to determine header text
        const hasAnyPromData = finalFindings.objectiveFindings.aromMovements.some(m => m.prom);
        const aromPromText = hasAnyPromData ? 'active/passive range of movement (AROM/PROM)' : 'active range of movement (AROM)';
        
        comparisons.push({
          id: 'arom_combined',
          category: 'AROM',
          text: `The ${aromPromText} of ${pronouns.his.toLowerCase()} ${region} improved, notably in ${improvementText}.`
        });
      }
    }

    // Handle AROM "not tested" to "tested" comparison for non-hand/foot regions
    if (initialFindings.complaints.location !== 'hand' && initialFindings.complaints.location !== 'foot' && 
        initialFindings.complaints.location !== 'ankle' && initialFindings.objectiveFindings.aromNotTested && 
        !finalFindings.objectiveFindings.aromNotTested && finalFindings.objectiveFindings.aromMovements.some(m => m.arom)) {
      
      const region = getRegionText(initialFindings);
      const isBackNeck = initialFindings.complaints.location === 'back' || initialFindings.complaints.location === 'neck';
      
      const aromImprovements = [];
      finalFindings.objectiveFindings.aromMovements.forEach((finalMovement) => {
        if (finalMovement.arom) {
          const unit = isBackNeck ? '' : ' degrees';
          if (finalMovement.prom) {
            // Include PROM data when available
            aromImprovements.push(`${finalMovement.movement.toLowerCase()} to ${finalMovement.arom}/${finalMovement.prom}${unit}`);
          } else {
            // AROM only
            aromImprovements.push(`${finalMovement.movement.toLowerCase()} to ${finalMovement.arom}${unit}`);
          }
        }
      });
      
      if (aromImprovements.length > 0) {
        let improvementText = '';
        if (aromImprovements.length === 1) {
          improvementText = aromImprovements[0];
        } else {
          const lastImprovement = aromImprovements.pop();
          improvementText = `${aromImprovements.join(', ')} and ${lastImprovement}`;
        }
        
        // Check if PROM data is provided for non-back/neck regions
        const hasPromData = !isBackNeck && finalFindings.objectiveFindings.aromMovements.some(m => m.prom);
        const aromPromText = hasPromData ? 'active/passive range of movement (AROM/PROM)' : 'active range of movement (AROM)';
        
        comparisons.push({
          id: 'arom_not_tested_to_tested',
          category: 'AROM',
          text: `The ${aromPromText} of ${pronouns.his.toLowerCase()} ${region.toLowerCase()} improved, notably in ${improvementText}.`
        });
      }
    }

    // Muscle power comparison - handle all regions
    if (initialFindings.complaints.location === 'hand' || initialFindings.complaints.location === 'wrist') {
      // Handle hand grip strength
      const initialGrip = initialFindings.objectiveFindings.handGripStrength;
      const finalGrip = finalFindings.objectiveFindings.handGripStrength;
      const side = initialFindings.complaints.side || '';
      
      // Check if initial was not tested but final has data
      if (initialFindings.objectiveFindings.musclePowerNotTested && !finalFindings.objectiveFindings.musclePowerNotTested && finalGrip) {
        const gripImprovements = [];
        
        // Only report the side chosen in patient's complaints
        if (side.toLowerCase().includes('left') && finalGrip.leftHandGrip) {
          gripImprovements.push(`${side.toLowerCase()} hand improved to ${finalGrip.leftHandGrip} kgf`);
        }
        if (side.toLowerCase().includes('right') && finalGrip.rightHandGrip) {
          gripImprovements.push(`${side.toLowerCase()} hand improved to ${finalGrip.rightHandGrip} kgf`);
        }
        if (side.toLowerCase().includes('bilateral')) {
          if (finalGrip.leftHandGrip) {
            gripImprovements.push(`left hand improved to ${finalGrip.leftHandGrip} kgf`);
          }
          if (finalGrip.rightHandGrip) {
            gripImprovements.push(`right hand improved to ${finalGrip.rightHandGrip} kgf`);
          }
        }
        
        if (gripImprovements.length > 0) {
          const improvementText = gripImprovements.length === 1 ? gripImprovements[0] : `${gripImprovements.join(' and ')}`;
          comparisons.push({
            id: 'hand_grip',
            category: 'Hand Grip',
            text: `Hand grip strength of ${improvementText}.`
          });
        }
      } else if (initialGrip && finalGrip) {
        // Normal comparison for tested cases
        const gripImprovements = [];
        
        // Only report the side chosen in patient's complaints
        if (side.toLowerCase().includes('left') && initialGrip.leftHandGrip && finalGrip.leftHandGrip && initialGrip.leftHandGrip !== finalGrip.leftHandGrip) {
          gripImprovements.push(`${side.toLowerCase()} hand improved from ${initialGrip.leftHandGrip} to ${finalGrip.leftHandGrip} kgf`);
        }
        if (side.toLowerCase().includes('right') && initialGrip.rightHandGrip && finalGrip.rightHandGrip && initialGrip.rightHandGrip !== finalGrip.rightHandGrip) {
          gripImprovements.push(`${side.toLowerCase()} hand improved from ${initialGrip.rightHandGrip} to ${finalGrip.rightHandGrip} kgf`);
        }
        if (side.toLowerCase().includes('bilateral')) {
          if (initialGrip.leftHandGrip && finalGrip.leftHandGrip && initialGrip.leftHandGrip !== finalGrip.leftHandGrip) {
            gripImprovements.push(`left hand improved from ${initialGrip.leftHandGrip} to ${finalGrip.leftHandGrip} kgf`);
          }
          if (initialGrip.rightHandGrip && finalGrip.rightHandGrip && initialGrip.rightHandGrip !== finalGrip.rightHandGrip) {
            gripImprovements.push(`right hand improved from ${initialGrip.rightHandGrip} to ${finalGrip.rightHandGrip} kgf`);
          }
        }
        
        if (gripImprovements.length > 0) {
          const improvementText = gripImprovements.length === 1 ? gripImprovements[0] : `${gripImprovements.join(' and ')}`;
          comparisons.push({
            id: 'hand_grip',
            category: 'Hand Grip',
            text: `Hand grip strength of ${improvementText}.`
          });
        }
      }
      
      // Gross Fingers ROM comparison for wrist region
      if (initialFindings.complaints.location === 'wrist') {
        const initialGrossFingersROM = initialFindings.objectiveFindings.grossFingersROM;
        const finalGrossFingersROM = finalFindings.objectiveFindings.grossFingersROM;
        
        if (initialGrossFingersROM && finalGrossFingersROM && initialGrossFingersROM !== finalGrossFingersROM) {
          const sideText = initialFindings.complaints.side === 'bilateral' ? 'bilateral' : initialFindings.complaints.side || '[side]';
          comparisons.push({
            id: 'gross_fingers_rom',
            category: 'Gross Fingers AROM',
            text: `The AROM of ${pronouns.his.toLowerCase()} ${sideText} hand fingers improved from ${initialGrossFingersROM} to ${finalGrossFingersROM}.`
          });
        }
      }
      
      // Muscle power comparison for wrist region
      if (initialFindings.complaints.location === 'wrist') {
        const muscleImprovements = [];
        
        // Check if initial was not tested but final has data
        if (initialFindings.objectiveFindings.musclePowerNotTested && !finalFindings.objectiveFindings.musclePowerNotTested) {
          finalFindings.objectiveFindings.musclePower?.forEach((finalMuscle) => {
            if (finalMuscle.leftGrade) {
              muscleImprovements.push(`${finalMuscle.muscleGroup.toLowerCase()} to grade ${finalMuscle.leftGrade} out of 5`);
            }
          });
        } else {
          // Normal comparison for tested cases
          initialFindings.objectiveFindings.musclePower.forEach((initialMuscle, index) => {
            const finalMuscle = finalFindings.objectiveFindings.musclePower[index];
            if (initialMuscle && finalMuscle && initialMuscle.leftGrade && finalMuscle.leftGrade && initialMuscle.leftGrade !== finalMuscle.leftGrade) {
              muscleImprovements.push(`${initialMuscle.muscleGroup.toLowerCase()} from grade ${initialMuscle.leftGrade} to ${finalMuscle.leftGrade} out of 5`);
            }
          });
        }
        
        if (muscleImprovements.length > 0) {
          const region = getRegionText(initialFindings);
          const side = initialFindings.complaints.side ? `${initialFindings.complaints.side} ` : '';
          let improvementText = '';
          
          if (muscleImprovements.length === 1) {
            improvementText = muscleImprovements[0];
          } else {
            const lastImprovement = muscleImprovements.pop();
            improvementText = `${muscleImprovements.join(', ')} and ${lastImprovement}`;
          }
          
          comparisons.push({
            id: 'wrist_muscle_power',
            category: 'Muscle Power',
            text: `The muscle power of ${pronouns.his.toLowerCase()} ${side}${region}, as charted by Oxford Manual Muscle Testing Scale, improved, notably in ${improvementText}.`
          });
        }
      }
    }
    
    // Comprehensive muscle power comparison for ALL regions (except hand/wrist which are handled above)
    if (initialFindings.complaints.location !== 'hand' && initialFindings.complaints.location !== 'wrist') {
      const muscleImprovements = [];
      
      // Check if initial was not tested but final has data
      if (initialFindings.objectiveFindings.musclePowerNotTested && !finalFindings.objectiveFindings.musclePowerNotTested) {
        // Handle back/neck regions (myotome)
        if (initialFindings.complaints.location === 'back' || initialFindings.complaints.location === 'neck') {
          finalFindings.objectiveFindings.myotome?.forEach((finalLevel) => {
            if (finalLevel.leftGrade || finalLevel.rightGrade) {
              const grade = finalLevel.leftGrade || finalLevel.rightGrade;
              muscleImprovements.push(`${finalLevel.level.toUpperCase()} to grade ${grade} out of 5`);
            }
          });
        } else {
          // Handle other regions (regular muscle power)
          finalFindings.objectiveFindings.musclePower?.forEach((finalMuscle) => {
            if (finalMuscle.leftGrade || finalMuscle.rightGrade) {
              const grade = finalMuscle.leftGrade || finalMuscle.rightGrade;
              const muscleGroup = initialFindings.complaints.location === 'back' || initialFindings.complaints.location === 'neck' 
                ? finalMuscle.muscleGroup.toUpperCase() 
                : finalMuscle.muscleGroup.toLowerCase();
              muscleImprovements.push(`${muscleGroup} to grade ${grade} out of 5`);
            }
          });
        }
      } else if (initialFindings.objectiveFindings.musclePower || initialFindings.objectiveFindings.myotome) {
        // Normal comparison - tested to tested
        if (initialFindings.complaints.location === 'back' || initialFindings.complaints.location === 'neck') {
          // Handle myotome comparison for back/neck regions
          initialFindings.objectiveFindings.myotome?.forEach((initialLevel, index) => {
            const finalLevel = finalFindings.objectiveFindings.myotome?.[index];
            if (initialLevel && finalLevel) {
              // Check left side
              if (initialLevel.leftGrade && finalLevel.leftGrade && initialLevel.leftGrade !== finalLevel.leftGrade) {
                muscleImprovements.push(`${initialLevel.level.toUpperCase()} from grade ${initialLevel.leftGrade} to grade ${finalLevel.leftGrade} out of 5`);
              }
              // Check right side
              if (initialLevel.rightGrade && finalLevel.rightGrade && initialLevel.rightGrade !== finalLevel.rightGrade) {
                muscleImprovements.push(`${initialLevel.level.toUpperCase()} from grade ${initialLevel.rightGrade} to grade ${finalLevel.rightGrade} out of 5`);
              }
            }
          });
        } else {
          // Handle regular muscle power comparison for ALL other regions
          initialFindings.objectiveFindings.musclePower?.forEach((initialMuscle, index) => {
            const finalMuscle = finalFindings.objectiveFindings.musclePower?.[index];
            if (initialMuscle && finalMuscle) {
              // Check left side
              if (initialMuscle.leftGrade && finalMuscle.leftGrade && initialMuscle.leftGrade !== finalMuscle.leftGrade) {
                const muscleGroup = initialMuscle.muscleGroup.toLowerCase();
                muscleImprovements.push(`${muscleGroup} from grade ${initialMuscle.leftGrade} to grade ${finalMuscle.leftGrade} out of 5`);
              }
              // Check right side
              if (initialMuscle.rightGrade && finalMuscle.rightGrade && initialMuscle.rightGrade !== finalMuscle.rightGrade) {
                const muscleGroup = initialMuscle.muscleGroup.toLowerCase();
                muscleImprovements.push(`${muscleGroup} from grade ${initialMuscle.rightGrade} to grade ${finalMuscle.rightGrade} out of 5`);
              }
            }
          });
        }
      }
      
      if (muscleImprovements.length > 0) {
        const region = getRegionText(initialFindings);
        let improvementText = '';
        
        if (muscleImprovements.length === 1) {
          improvementText = muscleImprovements[0];
        } else {
          const lastImprovement = muscleImprovements.pop();
          improvementText = `${muscleImprovements.join(', ')} and ${lastImprovement}`;
        }
        
        comparisons.push({
          id: 'muscle_power',
          category: 'Muscle Power',
          text: `The muscle power of ${pronouns.his.toLowerCase()} ${region} improved, notably in ${improvementText}.`
        });
      }
    }

    // Other functional activities comparison
    if (finalFindings.complaints.otherFunctionalLimitation && 
        finalFindings.complaints.otherFunctionalLimitation.trim()) {
      comparisons.push({
        id: 'other_functional_limitation',
        category: 'Other Functional Limitation',
        text: finalFindings.complaints.otherFunctionalLimitation
      });
    }

    // NGRCS comparison
    if (finalFindings.complaints.overallImprovement && finalFindings.complaints.overallImprovement !== '0') {
      comparisons.push({
        id: 'ngrcs',
        category: 'NGRCS',
        text: `${pronouns.he} reported an overall subjective improvement of ${finalFindings.complaints.overallImprovement} out of 10 as charted by NGRCS.`
      });
    }

    console.log('DEBUG: Final comparisons array:', comparisons);
    return comparisons;
  };

  const comparisonData = generateComparisonData();
  console.log('DEBUG: Generated comparison data:', comparisonData);

  // Define the predefined order for comparison items
  const getPredefinedOrder = (items: typeof comparisonData) => {
    const orderMap = {
      'pain': 1,
      'ngrcs': 2,
      'other_symptoms': 3,
      'functional_activity': 4,
      'other_functional_limitation': 5,
      'wb_status': 6,
      'arom': 7,
      'muscle_power': 8
    };
    
    const getOrderValue = (id: string) => {
      if (id === 'pain') return orderMap.pain;
      if (id === 'ngrcs') return orderMap.ngrcs;
      if (id === 'symptoms' || id.startsWith('other_symptoms')) return orderMap.other_symptoms;
      if (id === 'functional_activity') return orderMap.functional_activity;
      if (id === 'other_functional_limitation') return orderMap.other_functional_limitation;
      if (id === 'wb_status') return orderMap.wb_status;
      if (id.startsWith('arom') || id.includes('joint') || id.includes('ankle') || id.includes('not_tested')) return orderMap.arom;
      if (id.includes('muscle') || id.includes('myotome') || id.includes('grip')) return orderMap.muscle_power;
      return 999; // Unknown items go to the end
    };
    
    return items
      .map(item => ({ ...item, orderValue: getOrderValue(item.id) }))
      .sort((a, b) => a.orderValue - b.orderValue)
      .map(item => item.id);
  };

  // Initialize item order when comparison data changes
  useEffect(() => {
    const currentIds = comparisonData.map(item => item.id);
    
    if (itemOrder.length === 0) {
      // First time initialization - use predefined order
      const predefinedOrder = getPredefinedOrder(comparisonData);
      setItemOrder(predefinedOrder);
    } else {
      // Preserve existing user order and handle new/removed items
      const existingIds = itemOrder.filter(id => currentIds.includes(id));
      const newIds = currentIds.filter(id => !itemOrder.includes(id));
      
      if (existingIds.length !== itemOrder.length || newIds.length > 0) {
        // Add new items using predefined order, but preserve existing user order
        if (newIds.length > 0) {
          // Get predefined positions for new items
          const newItemsWithOrder = newIds.map(id => ({
            id,
            orderValue: (() => {
              if (id === 'pain') return 1;
              if (id === 'ngrcs') return 2;
              if (id === 'symptoms' || id.startsWith('other_symptoms')) return 3;
              if (id === 'functional_activity') return 4;
              if (id === 'other_functional_activities') return 5;
              if (id === 'wb_status') return 6;
              if (id.startsWith('arom') || id.includes('joint') || id.includes('ankle') || id.includes('not_tested')) return 7;
              if (id.includes('muscle') || id.includes('myotome') || id.includes('grip')) return 8;
              return 999;
            })()
          })).sort((a, b) => a.orderValue - b.orderValue);
          
          // Insert new items in their predefined positions while preserving existing order
          let updatedOrder = [...existingIds];
          newItemsWithOrder.forEach(newItem => {
            // Find the correct insertion position based on predefined order
            let insertIndex = updatedOrder.length;
            for (let i = 0; i < updatedOrder.length; i++) {
              const existingItemOrder = (() => {
                const id = updatedOrder[i];
                if (id === 'pain') return 1;
                if (id === 'ngrcs') return 2;
                if (id === 'symptoms' || id.startsWith('other_symptoms')) return 3;
                if (id === 'functional_activity') return 4;
                if (id === 'other_functional_activities') return 5;
                if (id === 'wb_status') return 6;
                if (id.startsWith('arom') || id.includes('joint') || id.includes('ankle') || id.includes('not_tested')) return 7;
                if (id.includes('muscle') || id.includes('myotome') || id.includes('grip')) return 8;
                return 999;
              })();
              
              if (newItem.orderValue < existingItemOrder) {
                insertIndex = i;
                break;
              }
            }
            updatedOrder.splice(insertIndex, 0, newItem.id);
          });
          
          setItemOrder(updatedOrder);
        } else {
          // Just remove deleted items
          setItemOrder(existingIds);
        }
      }
    }
  }, [comparisonData]);

  // Get ordered comparison data with edited texts
  const getOrderedComparisonData = () => {
    const orderedData = itemOrder
      .map(id => comparisonData.find(item => item.id === id))
      .filter(Boolean) as typeof comparisonData;
    
    return orderedData.map(item => ({
      ...item,
      text: editedTexts[item.id] || item.text
    }));
  };

  const orderedComparisonData = getOrderedComparisonData();

  // Handle text editing
  const handleTextEdit = (itemId: string, newText: string) => {
    setEditedTexts(prev => ({
      ...prev,
      [itemId]: newText
    }));
  };

  // Regenerate summary when edited texts or discharge data changes
  useEffect(() => {
    regenerateSummary();
  }, [editedTexts, itemOrder, dischargeType, dischargeDate, cancellationDate, appointmentDate, cancellationReason, otherRelevantChanges]);

  // Handle drag and drop with insertion-based logic
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewOrder, setPreviewOrder] = useState<string[]>([]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
    setDraggedItem(itemId);
    setPreviewOrder([...itemOrder]);
  };

  // Calculate insertion index based on mouse position
  const calculateInsertionIndex = (e: React.DragEvent, targetIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const elementMiddle = rect.top + rect.height / 2;
    
    // If mouse is in upper half, insert before; if lower half, insert after
    return mouseY < elementMiddle ? targetIndex : targetIndex + 1;
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedItem) {
      const insertionIndex = calculateInsertionIndex(e, targetIndex);
      setDragOverIndex(insertionIndex);
      
      // Create real-time preview of new order
      const newOrder = [...itemOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      
      if (draggedIndex !== -1) {
        // Remove dragged item
        newOrder.splice(draggedIndex, 1);
        
        // Adjust insertion index if we removed an item before it
        const adjustedInsertionIndex = draggedIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
        
        // Insert at new position
        newOrder.splice(adjustedInsertionIndex, 0, draggedItem);
        setPreviewOrder(newOrder);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're actually leaving the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Always apply the preview order (what the user sees is what they get)
    if (previewOrder.length > 0) {
      setItemOrder(previewOrder);
    }
    
    // Reset drag state
    setDraggedItem(null);
    setDragOverIndex(null);
    setPreviewOrder([]);
  };

  const handleDragEnd = () => {
    // Reset drag state if drag is cancelled
    setDraggedItem(null);
    setDragOverIndex(null);
    setPreviewOrder([]);
  };

  // Function to regenerate summary text
  const regenerateSummary = (currentSelectedItems: string[] = selectedItems) => {
    const selectedTexts = orderedComparisonData
      .filter(item => currentSelectedItems.includes(item.id))
      .map(item => item.text);
    
    // Add discharge status
    if (dischargeType === 'completed' && dischargeDate) {
      selectedTexts.push(`${pronouns.title} ${lastName} was discharged from physiotherapy on ${formatDate(dischargeDate)}.`);
    } else if (dischargeType === 'static' && dischargeDate) {
      selectedTexts.push(`${pronouns.title} ${lastName} showed static progress and was discharged from physiotherapy on ${formatDate(dischargeDate)}.`);
    } else if (dischargeType === 'ongoing') {
      selectedTexts.push(`${pronouns.title} ${lastName} is still receiving physiotherapy until further notice.`);
    } else if (dischargeType === 'defaulted' && dischargeDate) {
      selectedTexts.push(`${pronouns.title} ${lastName} was defaulted from the scheduled physiotherapy session since ${formatDate(dischargeDate)}. ${pronouns.his} case was closed thereafter.`);
    } else if (dischargeType === 'cancelled' && cancellationDate && appointmentDate && cancellationReason) {
      selectedTexts.push(`${pronouns.title} ${lastName} called back on ${formatDate(cancellationDate)} to cancel ${pronouns.his.toLowerCase()} physiotherapy appointment scheduled on ${formatDate(appointmentDate)} as ${cancellationReason}. ${pronouns.his} case was closed thereafter.`);
    }
    
    onSummaryChange(selectedTexts);
  };

  const handleItemToggle = (itemId: string, text: string) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelected);
    
    // Regenerate summary with new selection
    regenerateSummary(newSelected);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 8: Discharge Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Comparison Data Selection</h4>
          <p className="text-sm text-gray-600">
            Select the items you want to include in the discharge summary. The system automatically compares initial and final findings. You can drag items to rearrange their order and edit the comparison text directly in the table.
          </p>
          
          {comparisonData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Include</TableHead>
                  <TableHead className="w-32">Category</TableHead>
                  <TableHead className="flex-1">Comparison Text</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  // Use preview order during drag, otherwise use normal order
                  const currentOrder = previewOrder.length > 0 ? previewOrder : itemOrder;
                  const currentData = currentOrder
                    .map(id => comparisonData.find(item => item.id === id))
                    .filter(Boolean)
                    .map(item => ({
                      ...item!,
                      text: editedTexts[item!.id] || item!.text
                    }));
                  
                  return currentData.map((item, index) => (
                    <TableRow 
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                      className={`cursor-move transition-all duration-200 relative ${
                        draggedItem === item.id 
                          ? 'opacity-50 bg-blue-50 border-2 border-blue-300' 
                          : dragOverIndex === index 
                          ? 'bg-blue-100' 
                          : dragOverIndex === index + 1
                          ? 'bg-blue-100'
                          : 'hover:bg-gray-50'
                      } ${
                        dragOverIndex === index 
                          ? 'border-t-4 border-t-blue-500' 
                          : dragOverIndex === index + 1
                          ? 'border-b-4 border-b-blue-500'
                          : ''
                      }`}
                  >
                    <TableCell className="w-20">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleItemToggle(item.id, item.text)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium w-32">{item.category}</TableCell>
                    <TableCell className="text-sm flex-1">
                      <Textarea
                        value={item.text}
                        onChange={(e) => handleTextEdit(item.id, e.target.value)}
                        className="min-h-[60px] text-sm border border-blue-200 bg-blue-50 p-2 resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 rounded-md"
                        placeholder="Click to edit this comparison text..."
                      />
                    </TableCell>
                  </TableRow>
                  ));
                })()
                }
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No comparison data available.</p>
              <p className="text-sm">Please complete both initial and final clinical findings to generate comparisons.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Discharge Status</h4>
          
          {/* Other Relevant Changes - Free Text Field */}
          <div className="space-y-2">
            <Label htmlFor="otherRelevantChanges">Other Relevant Changes</Label>
            <Textarea
              id="otherRelevantChanges"
              value={otherRelevantChanges}
              onChange={(e) => setOtherRelevantChanges(e.target.value)}
              placeholder="e.g., The patient demonstrated improved confidence in performing daily activities and reported better sleep quality throughout the treatment period."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Optional: Add any other relevant changes or observations not captured in the comparison data above.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Discharge Type</Label>
            <Select value={dischargeType} onValueChange={setDischargeType}>
              <SelectTrigger>
                <SelectValue placeholder="Select discharge type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Discharged</SelectItem>
                <SelectItem value="static">Discharged with static progress</SelectItem>
                <SelectItem value="ongoing">Still receiving physiotherapy</SelectItem>
                <SelectItem value="defaulted">Defaulted</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(dischargeType === 'completed' || dischargeType === 'static') && (
            <div className="space-y-2">
              <Label htmlFor="dischargeDate">Discharge Date</Label>
              <Input
                id="dischargeDate"
                type="date"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
              />
            </div>
          )}

          {dischargeType === 'defaulted' && (
            <div className="space-y-2">
              <Label htmlFor="defaultDate">Default Date (since last scheduled appointment date)</Label>
              <Input
                id="defaultDate"
                type="date"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
              />
            </div>
          )}

          {dischargeType === 'cancelled' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cancellationDate">Cancellation Date</Label>
                  <Input
                    id="cancellationDate"
                    type="date"
                    value={cancellationDate}
                    onChange={(e) => setCancellationDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Last Scheduled Appointment Date</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cancellationReason">Cancellation Reason</Label>
                <Input
                  id="cancellationReason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g., personal reasons, medical condition"
                />
              </div>
            </div>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">
              {dischargeType === 'completed' || dischargeType === 'static'
                ? 'Discharge Summary'
                : 'Progress Summary'
              }:
            </h4>
            <div className="text-sm space-y-2">
              {orderedComparisonData
                .filter(item => selectedItems.includes(item.id))
                .map((item, index) => (
                  <p key={item.id}>{index + 1}. {item.text}</p>
                ))}
              
              {/* Other Relevant Changes */}
              {otherRelevantChanges && (
                <p>{orderedComparisonData.filter(item => selectedItems.includes(item.id)).length + 1}. {otherRelevantChanges}</p>
              )}
              
              {dischargeType === 'completed' && dischargeDate && (
                <p>{orderedComparisonData.filter(item => selectedItems.includes(item.id)).length + (otherRelevantChanges ? 2 : 1)}. {pronouns.title} {lastName} was discharged from physiotherapy on {formatDate(dischargeDate)}.</p>
              )}
              
              {dischargeType === 'static' && dischargeDate && (
                <p>{orderedComparisonData.filter(item => selectedItems.includes(item.id)).length + (otherRelevantChanges ? 2 : 1)}. {pronouns.title} {lastName} showed static progress and was discharged from physiotherapy on {formatDate(dischargeDate)}.</p>
              )}
              
              {dischargeType === 'ongoing' && (
                <p>{orderedComparisonData.filter(item => selectedItems.includes(item.id)).length + (otherRelevantChanges ? 2 : 1)}. {pronouns.title} {lastName} is still receiving physiotherapy until further notice.</p>
              )}
              
              {dischargeType === 'defaulted' && dischargeDate && (
                <p>{orderedComparisonData.filter(item => selectedItems.includes(item.id)).length + (otherRelevantChanges ? 2 : 1)}. {pronouns.title} {lastName} was defaulted from the scheduled physiotherapy session since {formatDate(dischargeDate)}. {pronouns.his} case was closed thereafter.</p>
              )}
              
              {dischargeType === 'cancelled' && cancellationDate && appointmentDate && cancellationReason && (
                <p>{orderedComparisonData.filter(item => selectedItems.includes(item.id)).length + (otherRelevantChanges ? 2 : 1)}. {pronouns.title} {lastName} called back on {formatDate(cancellationDate)} to cancel {pronouns.his.toLowerCase()} physiotherapy appointment scheduled on {formatDate(appointmentDate)} as {cancellationReason}. {pronouns.his} case was closed thereafter.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DischargeSummaryComponent;