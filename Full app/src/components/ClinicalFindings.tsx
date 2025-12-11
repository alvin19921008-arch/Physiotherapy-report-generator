import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

// Auto-lowercase first word utility function
const autoLowercaseFirstWord = (value: string): string => {
  if (!value) return value;
  const parts = value.split(' ');
  if (parts[0]) {
    parts[0] = parts[0].toLowerCase();
  }
  return parts.join(' ');
};

// Auto-add percentage sign for numeric values
const autoAddPercentage = (value: string): string => {
  if (!value) return value;
  // Check if the value is only numbers (no decimal, no existing %, no text)
  if (/^\d+$/.test(value.trim())) {
    return value.trim() + '%';
  }
  return value;
};

interface ClinicalFindings {
  date: string;
  complaints: {
    side: string;
    location: string;
    painIntensity: string;
    otherSymptoms: Array<{ symptom: string; intensity: string }>;
    activities1: Array<{ activity: string; duration: string; unit: string }>; // reading/sitting
    activities2: Array<{ activity: string; duration: string; unit: string; aid: string }>; // walking/standing
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
    handGripNotTested: boolean;
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
    sensationStatus: string; // 'intact' | 'reduced' | 'hypersensitive'
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

interface ClinicalFindingsProps {
  findings: ClinicalFindings;
  onChange: (findings: ClinicalFindings) => void;
  title: string;
  patientName: string;
  patientSex: string;
  isInitial?: boolean;
  initialDate?: string;
  onTabChange?: (tab: string) => void;
}

const ClinicalFindingsComponent: React.FC<ClinicalFindingsProps> = ({
  findings,
  onChange,
  title,
  patientName,
  patientSex,
  isInitial = false,
  initialDate = '',
  onTabChange
}) => {
  const locationOptions = [
    { value: 'back', label: 'Back' },
    { value: 'neck', label: 'Neck' },
    { value: 'shoulder', label: 'Shoulder' },
    { value: 'elbow', label: 'Elbow' },
    { value: 'wrist', label: 'Wrist' },
    { value: 'hand', label: 'Hand' },
    { value: 'hip', label: 'Hip' },
    { value: 'knee', label: 'Knee' },
    { value: 'ankle', label: 'Ankle' },
    { value: 'foot', label: 'Foot' }
  ];

  const activityOptions = [
    { value: 'reading', label: 'Reading' },
    { value: 'walking', label: 'Walking' },
    { value: 'standing', label: 'Standing' },
    { value: 'sitting', label: 'Sitting' }
  ];

  const aidOptions = [
    { value: 'unaided', label: 'Unaided' },
    { value: 'stick', label: 'Stick' },
    { value: 'quadruped', label: 'Quadruped' },
    { value: 'frame', label: 'Frame' },
    { value: 'elbow crutches', label: 'Elbow Crutches' },
    { value: 'rollator', label: 'Rollator' }
  ];

  const getSmallJointOptions = (location: string) => {
    if (location === 'hand') {
      return [
        { value: 'cmcj', label: 'Carpometacarpal joint (CMCJ)' },
        { value: 'mcpj', label: 'Metacarpophalengeal joint (MCPJ)' },
        { value: 'pipj', label: 'Proximal interphalengeal joint (PIPJ)' },
        { value: 'dipj', label: 'Distal interphalengeal joint (DIPJ)' },
        { value: 'ipj', label: 'Interphalengeal joint (IPJ)' }
      ];
    } else if (location === 'foot') {
      return [
        { value: 'mtpj', label: 'Metatarsophalengeal joint (MTPJ)' },
        { value: 'pipj', label: 'Proximal interphalengeal joint (PIPJ)' },
        { value: 'dipj', label: 'Distal interphalengeal joint (DIPJ)' },
        { value: 'ipj', label: 'Interphalengeal joint (IPJ)' }
      ];
    }
    return [];
  };

  const getAromMovements = (location: string) => {
    const movements: { [key: string]: string[] } = {
      back: ['Flexion', 'Extension', 'Right Rotation', 'Left Rotation', 'Right Side Flexion', 'Left Side Flexion'],
      neck: ['Flexion', 'Extension', 'Right Rotation', 'Left Rotation', 'Right Side Flexion', 'Left Side Flexion'],
      shoulder: ['Flexion', 'Abduction', 'Extension', 'External Rotation', 'Internal Rotation', 'Hand behind back', 'Hand behind neck'],
      elbow: ['Flexion', 'Extension', 'Pronation', 'Supination'],
      wrist: ['Flexion', 'Extension', 'Pronation', 'Supination', 'Radial Deviation', 'Ulnar Deviation'],
      hand: [], // Hand uses joint-specific entries
      hip: ['Flexion', 'Abduction', 'Extension', 'External Rotation', 'Internal Rotation'],
      knee: ['Flexion', 'Extension'],
      ankle: ['Plantarflexion', 'Dorsiflexion', 'Eversion', 'Inversion'],
      foot: [] // Foot uses joint-specific entries
    };
    return movements[location] || [];
  };

  const getMuscleGroups = (location: string) => {
    const muscles: { [key: string]: string[] } = {
      shoulder: ['Flexor', 'Abductor', 'Extensor', 'External Rotator', 'Internal Rotator'],
      elbow: ['Flexor', 'Extensor', 'Pronator', 'Supinator'],
      wrist: ['Flexor', 'Extensor', 'Pronator', 'Supinator', 'Radial Deviator', 'Ulnar Deviator'],
      hand: [], // Hand uses grip strength testing
      hip: ['Flexor', 'Extensor', 'Abductor', 'External Rotator', 'Internal Rotator'],
      knee: ['Flexor', 'Extensor'],
      ankle: ['Plantarflexor', 'Dorsiflexor', 'Evertor', 'Invertor', 'Toes'],
      foot: ['Plantarflexor', 'Dorsiflexor', 'Evertor', 'Invertor', 'Toes'],
      back: [], // Back uses myotome testing
      neck: [] // Neck uses myotome testing
    };
    return muscles[location] || [];
  };

  const getMyotomeLevels = (location: string) => {
    const levels: { [key: string]: string[] } = {
      back: ['L2', 'L3', 'L4', 'L5', 'S1'],
      neck: ['C5', 'C6', 'C7', 'C8', 'T1']
    };
    return levels[location] || [];
  };

  const getRegionQuestionnaires = (location: string) => {
    const questionnaires: { [key: string]: string[] } = {
      shoulder: ['QuickDASH'],
      elbow: ['QuickDASH'],
      wrist: ['QuickDASH'],
      hand: ['QuickDASH'],
      hip: ['Lower Extremity Functional Scale'],
      ankle: ['Lower Extremity Functional Scale'],
      foot: ['Lower Extremity Functional Scale'],
      neck: ['Northwick Park Neck Pain Questionnaire'],
      back: ['Roland-Morris Disability Questionnaire'],
      knee: ['Lower Extremity Functional Scale', 'Knee Injury & Osteoarthritis Outcome Score-Pain', 'Knee Injury & Osteoarthritis Outcome Score-PS', 'Knee Injury & Osteoarthritis Outcome Score-QoL']
    };
    return questionnaires[location] || [];
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

  const handleComplaintChange = (field: string, value: string) => {
    const newComplaints = {
      ...findings.complaints,
      [field]: value
    };

    // Auto-update AROM and muscle power when location changes
    if (field === 'location') {
      const aromMovements = getAromMovements(value).map(movement => ({ movement, arom: '', prom: '' }));
      const handJoints = (value === 'hand' || value === 'foot') ? [{ joint: '', range: '' }] : [];
      const fingersToesData = (value === 'hand' || value === 'foot') ? [{ name: '', joints: [] }] : [];
      
      let musclePower = [];
      let myotome = [];
      
      // Check if existing muscle power has valid data to preserve
      const existingMusclePower = findings.objectiveFindings.musclePower || [];
      const hasValidMusclePowerData = existingMusclePower.some(m => m.leftGrade || m.rightGrade);
      
      // Check if existing myotome has valid data to preserve
      const existingMyotome = findings.objectiveFindings.myotome || [];
      const hasValidMyotomeData = existingMyotome.some(m => m.leftGrade || m.rightGrade);
      
      if (value === 'back' || value === 'neck') {
        // Preserve existing myotome data if it has valid entries, otherwise create new
        if (hasValidMyotomeData && existingMyotome.length > 0) {
          myotome = existingMyotome;
        } else {
          myotome = getMyotomeLevels(value).map(level => ({ level, leftGrade: '', rightGrade: '' }));
        }
      } else if (value === 'hand') {
        // Preserve existing muscle power data if it has valid entries, otherwise create new
        if (hasValidMusclePowerData && existingMusclePower.length > 0) {
          musclePower = existingMusclePower;
        } else {
          musclePower = [{ muscleGroup: 'Hand Grip', leftGrade: '', rightGrade: '', leftGrip: '', rightGrip: '', pinchGrip: '', lateralPinch: '' }];
        }
      } else {
        // Preserve existing muscle power data if it has valid entries, otherwise create new
        if (hasValidMusclePowerData && existingMusclePower.length > 0) {
          musclePower = existingMusclePower;
        } else {
          musclePower = getMuscleGroups(value).map(muscleGroup => ({ 
            muscleGroup, 
            leftGrade: '', 
            rightGrade: '',
            leftGrip: undefined,
            rightGrip: undefined,
            pinchGrip: undefined,
            lateralPinch: undefined
          }));
        }
      }
      
      onChange({
        ...findings,
        complaints: newComplaints,
        objectiveFindings: {
          ...findings.objectiveFindings,
          aromMovements,
          handJoints,
          fingersToesData,
          musclePower,
          myotome
        }
      });
    } else {
      onChange({
        ...findings,
        complaints: newComplaints
      });
    }
  };

  const handleObjectiveFindingChange = (field: string, value: any) => {
    onChange({
      ...findings,
      objectiveFindings: {
        ...findings.objectiveFindings,
        [field]: value
      }
    });
  };

  const updateArrayItem = (field: string, index: number, updatedItem: any) => {
    const array = findings.objectiveFindings[field as keyof typeof findings.objectiveFindings] as any[];
    const newArray = [...array];
    newArray[index] = updatedItem;
    onChange({
      ...findings,
      objectiveFindings: {
        ...findings.objectiveFindings,
        [field]: newArray
      }
    });
  };

  const addArrayItem = (field: string, newItem: any) => {
    onChange({
      ...findings,
      objectiveFindings: {
        ...findings.objectiveFindings,
        [field]: [...findings.objectiveFindings[field as keyof typeof findings.objectiveFindings] as any[], newItem]
      }
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const array = findings.objectiveFindings[field as keyof typeof findings.objectiveFindings] as any[];
    onChange({
      ...findings,
      objectiveFindings: {
        ...findings.objectiveFindings,
        [field]: array.filter((_, i) => i !== index)
      }
    });
  };

  const getRegionText = () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`${title}-date`}>Date</Label>
          <Input
            id={`${title}-date`}
            type="date"
            value={findings.date}
            onChange={(e) => onChange({ ...findings, date: e.target.value })}
            min={!isInitial && initialDate ? initialDate : undefined}
          />
          {!isInitial && initialDate && findings.date && findings.date < initialDate && (
            <p className="text-sm text-red-600">Date cannot be earlier than initial findings date</p>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold">I. Patient's Complaints</h4>
          
          <div className="space-y-4">
            <h5 className="font-medium">Pain Region</h5>
            <div className={`grid gap-4 ${findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {findings.complaints.location !== 'back' && findings.complaints.location !== 'neck' && (
                <div className="space-y-2">
                  <Label htmlFor="side">Side</Label>
                  <Select value={findings.complaints.side} onValueChange={(value) => handleComplaintChange('side', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="bilateral">Bilateral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={findings.complaints.location} onValueChange={(value) => handleComplaintChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="painIntensity">Pain Intensity (NPRS)</Label>
            <Input
              id="painIntensity"
              value={findings.complaints.painIntensity}
              onChange={(e) => handleComplaintChange('painIntensity', e.target.value)}
              placeholder="e.g., 7 or 6-8"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Other Symptoms (if any)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newSymptom = { symptom: '', intensity: '' };
                  const updated = [...(findings.complaints.otherSymptoms || []), newSymptom];
                  onChange({
                    ...findings,
                    complaints: {
                      ...findings.complaints,
                      otherSymptoms: updated
                    }
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Other Symptom
              </Button>
            </div>
            
            <div className="space-y-3">
              {findings.complaints.otherSymptoms?.map((symptomItem, index) => (
                <div key={index} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Other Symptom {index + 1}</span>
                    {findings.complaints.otherSymptoms && findings.complaints.otherSymptoms.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = findings.complaints.otherSymptoms?.filter((_, i) => i !== index) || [];
                          onChange({
                            ...findings,
                            complaints: {
                              ...findings.complaints,
                              otherSymptoms: updated
                            }
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Other symptoms (if any)</Label>
                      <Input
                        value={symptomItem.symptom}
                        onChange={(e) => {
                          const normalizedValue = autoLowercaseFirstWord(e.target.value);
                          const updated = [...(findings.complaints.otherSymptoms || [])];
                          updated[index] = { ...updated[index], symptom: normalizedValue };
                          onChange({
                            ...findings,
                            complaints: {
                              ...findings.complaints,
                              otherSymptoms: updated
                            }
                          });
                        }}
                        placeholder="e.g., tingling, numbness"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Other symptoms intensity (if applicable)</Label>
                      <Input
                        value={symptomItem.intensity}
                        onChange={(e) => {
                          const updated = [...(findings.complaints.otherSymptoms || [])];
                          updated[index] = { ...updated[index], intensity: e.target.value };
                          onChange({
                            ...findings,
                            complaints: {
                              ...findings.complaints,
                              otherSymptoms: updated
                            }
                          });
                        }}
                        placeholder="e.g., 5 or 4-6"
                      />
                    </div>
                  </div>
                </div>
              )) || []}

            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Functional Activity</Label>
            
            {/* Activity 1: Reading/Sitting */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="font-medium">Activity: Sitting/Reading</h6>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newActivity = { activity: '', duration: '', unit: 'minutes' };
                    const updated = [...(findings.complaints.activities1 || []), newActivity];
                    handleComplaintChange('activities1', updated);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Activity
                </Button>
              </div>
              
              <div className="space-y-3">
                {findings.complaints.activities1?.map((activityItem, index) => (
                  <div key={index} className="border rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Activity {index + 1}</span>
                      {findings.complaints.activities1 && findings.complaints.activities1.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = findings.complaints.activities1?.filter((_, i) => i !== index) || [];
                            handleComplaintChange('activities1', updated);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Activity Type</Label>
                        <Select 
                          value={activityItem.activity} 
                          onValueChange={(value) => {
                            const updated = [...(findings.complaints.activities1 || [])];
                            updated[index] = { ...updated[index], activity: value === 'none' ? '' : value };
                            handleComplaintChange('activities1', updated);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None (Clear Selection)</SelectItem>
                            <SelectItem value="reading">Reading</SelectItem>
                            <SelectItem value="sitting">Sitting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={activityItem.duration}
                          onChange={(e) => {
                            const updated = [...(findings.complaints.activities1 || [])];
                            updated[index] = { ...updated[index], duration: e.target.value };
                            handleComplaintChange('activities1', updated);
                          }}
                          placeholder="e.g., 30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select 
                          value={activityItem.unit} 
                          onValueChange={(value) => {
                            const updated = [...(findings.complaints.activities1 || [])];
                            updated[index] = { ...updated[index], unit: value };
                            handleComplaintChange('activities1', updated);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Activity 2: Walking/Standing */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="font-medium">Activity: Walking/Standing</h6>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newActivity = { activity: '', duration: '', unit: 'minutes', aid: '' };
                    const updated = [...(findings.complaints.activities2 || []), newActivity];
                    handleComplaintChange('activities2', updated);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Activity
                </Button>
              </div>
              
              <div className="space-y-3">
                {findings.complaints.activities2?.map((activityItem, index) => (
                  <div key={index} className="border rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Activity {index + 1}</span>
                      {findings.complaints.activities2 && findings.complaints.activities2.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = findings.complaints.activities2?.filter((_, i) => i !== index) || [];
                            handleComplaintChange('activities2', updated);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Activity Type</Label>
                        <Select 
                          value={activityItem.activity} 
                          onValueChange={(value) => {
                            const updated = [...(findings.complaints.activities2 || [])];
                            updated[index] = { ...updated[index], activity: value === 'none' ? '' : value };
                            handleComplaintChange('activities2', updated);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None (Clear Selection)</SelectItem>
                            <SelectItem value="walking">Walking</SelectItem>
                            <SelectItem value="standing">Standing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={activityItem.duration}
                          onChange={(e) => {
                            const updated = [...(findings.complaints.activities2 || [])];
                            updated[index] = { ...updated[index], duration: e.target.value };
                            handleComplaintChange('activities2', updated);
                          }}
                          placeholder="e.g., 10"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select 
                          value={activityItem.unit} 
                          onValueChange={(value) => {
                            const updated = [...(findings.complaints.activities2 || [])];
                            updated[index] = { ...updated[index], unit: value };
                            handleComplaintChange('activities2', updated);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Aid Required</Label>
                        <Select 
                          value={activityItem.aid} 
                          onValueChange={(value) => {
                            const updated = [...(findings.complaints.activities2 || [])];
                            updated[index] = { ...updated[index], aid: value };
                            handleComplaintChange('activities2', updated);
                            
                            // Smart auto-fill: Update walking aid in objective findings
                            // Only auto-fill if walking aid is not already set or is currently 'unaided'
                            if (!findings.objectiveFindings.walkingAid || findings.objectiveFindings.walkingAid === 'unaided') {
                              handleObjectiveFindingChange('walkingAid', value);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select aid" />
                          </SelectTrigger>
                          <SelectContent>
                            {aidOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherFunctionalLimitation">Other Functional Limitation</Label>
            <Textarea
              id="otherFunctionalLimitation"
              value={findings.complaints.otherFunctionalLimitation}
              onChange={(e) => handleComplaintChange('otherFunctionalLimitation', e.target.value)}
              placeholder={`Please input full sentence, e.g. ${pronouns.he} complaints of ${findings.complaints.location || '[region]'} pain when... or ${pronouns.he} no longer complaints of ${findings.complaints.location || '[region]'} pain when...`}
              className="min-h-[80px]"
            />
            <p className="text-sm text-gray-600">
              Examples include lifting heavy objects, walking stairs, reaching overhead, etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overallImprovement">Overall Subjective Improvement (NGRCS)</Label>
            <Select value={findings.complaints.overallImprovement} onValueChange={(value) => handleComplaintChange('overallImprovement', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select improvement" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>{i} out of 10</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Patient's Complaints Preview */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h5 className="font-medium mb-2">I. Patient's Complaints</h5>
            <div className="text-sm space-y-1">
              {(() => {
                const sentences = [];
                let counter = 1;
                
                // Patient's Complaints
                sentences.push(`${counter++}. ${pronouns.title} ${lastName} complained of ${getRegionText()} pain with pain intensity ${findings.complaints.painIntensity || '[X or X–Y]'} out of 10 as charted by Numeric Pain Rating Scale (NPRS).`);
                
                // Other symptoms
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
                
                // Activity preview
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
                
                // Other functional activities preview
                if (findings.complaints.otherFunctionalLimitation) {
                  sentences.push(`${counter++}. ${findings.complaints.otherFunctionalLimitation}`);
                }
                
                if (findings.complaints.overallImprovement && findings.complaints.overallImprovement !== '0') {
                  sentences.push(`${counter++}. ${pronouns.he} reported an overall subjective improvement of ${findings.complaints.overallImprovement} out of 10 as charted by Numeric Global Rate of Change Scale (NGRCS).`);
                }
                
                return sentences.map((sentence, index) => (
                  <p key={index}>{sentence}</p>
                ));
              })()}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold">II. Objective Findings</h4>
          
          {findings.complaints.location && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Active Range of Movement (AROM)</h5>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aromNotTested"
                        checked={findings.objectiveFindings.aromNotTested}
                        onCheckedChange={(checked) => handleObjectiveFindingChange('aromNotTested', checked)}
                      />
                      <Label htmlFor="aromNotTested" className="text-sm">Not tested</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeProm"
                        checked={findings.objectiveFindings.includeProm}
                        onCheckedChange={(checked) => handleObjectiveFindingChange('includeProm', checked)}
                      />
                      <Label htmlFor="includeProm" className="text-sm">Include PROM</Label>
                    </div>
                  </div>
                </div>
                
                {!findings.objectiveFindings.aromNotTested && (
                  <div className="space-y-2">
                    {findings.objectiveFindings.aromMovements.map((movement, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Label className="w-32">{movement.movement}</Label>
                        <Input
                          value={movement.arom}
                          onChange={(e) => updateArrayItem('aromMovements', index, { ...movement, arom: e.target.value })}
                          placeholder={findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'e.g., 3/5' : 'e.g., 90°'}
                          className="flex-1"
                        />
                        {findings.objectiveFindings.includeProm && (
                          <Input
                            value={movement.prom}
                            onChange={(e) => updateArrayItem('aromMovements', index, { ...movement, prom: e.target.value })}
                            placeholder={findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'e.g., 4/5' : 'e.g., 95°'}
                            className="flex-1"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {findings.complaints.location === 'ankle' && (
                  <div className="space-y-4">
                    <h6 className="font-medium">Toes ROM</h6>
                    <div className="space-y-2">
                      <Label htmlFor="toesROM">Toes Range of Motion</Label>
                      <Input
                        id="toesROM"
                        value={findings.objectiveFindings.toesROM || ''}
                        onChange={(e) => handleObjectiveFindingChange('toesROM', e.target.value)}
                        placeholder="***input format, e.g.: 2/3 of full range***"
                      />
                    </div>
                  </div>
                )}
                
                {findings.complaints.location === 'wrist' && (
                  <div className="space-y-4">
                    <h6 className="font-medium">Gross Fingers AROM</h6>
                    <div className="space-y-2">
                      <Label htmlFor="grossFingersROM">Gross fingers AROM</Label>
                      <Input
                        id="grossFingersROM"
                        value={findings.objectiveFindings.grossFingersROM || ''}
                        onChange={(e) => handleObjectiveFindingChange('grossFingersROM', e.target.value)}
                        placeholder="e.g., 2/3 of full range"
                      />
                    </div>
                  </div>
                )}
                
                {(findings.complaints.location === 'hand' || findings.complaints.location === 'foot') && (
                  <div className="space-y-4">
                    <h6 className="font-medium">{findings.complaints.location === 'hand' ? 'Fingers' : 'Toes'} Range of Motion</h6>
                    
                    <div className="space-y-4">
                      {findings.objectiveFindings.fingersToesData?.map((fingerToe, fingerIndex) => (
                        <div key={fingerIndex} className="border rounded p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-2">
                              <Label>{findings.complaints.location === 'hand' ? 'Finger' : 'Toe'} Name</Label>
                              <Input
                                value={fingerToe.name}
                                onChange={(e) => {
                                  const updated = [...(findings.objectiveFindings.fingersToesData || [])];
                                  updated[fingerIndex] = { ...updated[fingerIndex], name: e.target.value };
                                  handleObjectiveFindingChange('fingersToesData', updated);
                                }}
                                placeholder={findings.complaints.location === 'hand' ? 'e.g., Middle finger' : 'e.g., 2nd toe'}
                              />
                            </div>
                            {findings.objectiveFindings.fingersToesData && findings.objectiveFindings.fingersToesData.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updated = findings.objectiveFindings.fingersToesData?.filter((_, i) => i !== fingerIndex) || [];
                                  handleObjectiveFindingChange('fingersToesData', updated);
                                }}
                                className="ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <Label>Small Joints</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {getSmallJointOptions(findings.complaints.location).map((option) => {
                                const isSelected = fingerToe.joints.some(j => j.jointType === option.value);
                                return (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${fingerIndex}-${option.value}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const updated = [...(findings.objectiveFindings.fingersToesData || [])];
                                        if (checked) {
                                          updated[fingerIndex].joints.push({ jointType: option.value, range: '' });
                                        } else {
                                          updated[fingerIndex].joints = updated[fingerIndex].joints.filter(j => j.jointType !== option.value);
                                        }
                                        handleObjectiveFindingChange('fingersToesData', updated);
                                      }}
                                    />
                                    <Label htmlFor={`${fingerIndex}-${option.value}`} className="text-sm">
                                      {option.label}
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {fingerToe.joints.length > 0 && (
                              <div className="space-y-2">
                                <Label>Joint Ranges</Label>
                                {fingerToe.joints.map((joint, jointIndex) => {
                                  const jointOption = getSmallJointOptions(findings.complaints.location).find(o => o.value === joint.jointType);
                                  return (
                                    <div key={jointIndex} className="flex gap-2 items-center">
                                      <Label className="w-48 text-sm">{jointOption?.label}</Label>
                                      <Input
                                        value={joint.range}
                                        onChange={(e) => {
                                          const updated = [...(findings.objectiveFindings.fingersToesData || [])];
                                          updated[fingerIndex].joints[jointIndex].range = e.target.value;
                                          handleObjectiveFindingChange('fingersToesData', updated);
                                        }}
                                        placeholder="e.g., 5-70°"
                                        className="w-32"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )) || []}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = [...(findings.objectiveFindings.fingersToesData || []), { name: '', joints: [] }];
                          handleObjectiveFindingChange('fingersToesData', updated);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add {findings.complaints.location === 'hand' ? 'Finger' : 'Toe'}
                      </Button>
                    </div>
                  </div>
                )}
                
                {!findings.objectiveFindings.aromNotTested && (findings.objectiveFindings.aromMovements.some(m => m.arom || m.prom) || 
                  ((findings.complaints.location === 'hand' || findings.complaints.location === 'foot') && findings.objectiveFindings.fingersToesData?.some(ft => ft.name && ft.joints.some(j => j.range)))) && (
                  <div className="bg-gray-100 p-3 rounded">
                    <h6 className="font-medium mb-2">AROM Preview:</h6>
                    <p className="text-sm mb-2">1. The active range of movement (AROM) of {pronouns.his.toLowerCase()} {getRegionText()} was charted as below:</p>
                    
                    {(findings.complaints.location === 'hand' || findings.complaints.location === 'foot') ? (
                      <div className="space-y-3">
                        {findings.objectiveFindings.fingersToesData?.filter(ft => ft.name && ft.joints.some(j => j.range)).map((fingerToe, index) => {
                          const validJoints = fingerToe.joints.filter(j => j.range);
                          if (validJoints.length === 0) return null;
                          
                          const fingersToesCount = findings.objectiveFindings.fingersToesData?.filter(ft => ft.name && ft.joints.some(j => j.range)).length || 0;
                          
                          if (fingersToesCount === 1) {
                            // Single finger/toe format
                            return (
                              <Table key={index}>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>{findings.complaints.side.charAt(0).toUpperCase() + findings.complaints.side.slice(1).toLowerCase()} {fingerToe.name.toLowerCase()} movement</TableHead>
                                    <TableHead>AROM</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {validJoints.map((joint, jointIndex) => {
                                    const jointOption = getSmallJointOptions(findings.complaints.location).find(o => o.value === joint.jointType);
                                    return (
                                      <TableRow key={jointIndex}>
                                        <TableCell>{jointOption?.label}</TableCell>
                                        <TableCell>{joint.range}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            );
                          } else {
                            // Multiple fingers/toes format - return null here, will be handled below
                            return null;
                          }
                        })}
                        
                        {/* Multiple fingers/toes table */}
                        {(() => {
                          const validFingersToes = findings.objectiveFindings.fingersToesData?.filter(ft => ft.name && ft.joints.some(j => j.range)) || [];
                          if (validFingersToes.length > 1) {
                            const allJointTypes = [...new Set(validFingersToes.flatMap(ft => ft.joints.filter(j => j.range).map(j => j.jointType)))];
                            
                            return (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>{findings.complaints.location === 'hand' ? 'Fingers joints' : 'Toes joints'}</TableHead>
                                    {validFingersToes.map((ft, index) => (
                                      <TableHead key={index}>{ft.name.charAt(0).toUpperCase() + ft.name.slice(1).toLowerCase()}</TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {allJointTypes.map((jointType, jointIndex) => {
                                    const jointOption = getSmallJointOptions(findings.complaints.location).find(o => o.value === jointType);
                                    return (
                                      <TableRow key={jointIndex}>
                                        <TableCell>{jointOption?.label}</TableCell>
                                        {validFingersToes.map((ft, ftIndex) => {
                                          const joint = ft.joints.find(j => j.jointType === jointType);
                                          return (
                                            <TableCell key={ftIndex}>{joint?.range || '-'}</TableCell>
                                          );
                                        })}
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Movement</TableHead>
                            <TableHead>AROM {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? '(of full range)' : '(in degree)'}</TableHead>
                            {findings.objectiveFindings.includeProm && (
                              <TableHead>PROM {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? '(of full range)' : '(in degree)'}</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {findings.objectiveFindings.aromMovements.filter(m => m.arom || m.prom).map((movement, index) => (
                            <TableRow key={index}>
                              <TableCell>{movement.movement}</TableCell>
                            <TableCell>{movement.arom || '[Range]'}</TableCell>
                            {findings.objectiveFindings.includeProm && (
                              <TableCell>{movement.prom || '[Range]'}</TableCell>
                            )}
                          </TableRow>
                        ))}
                        {findings.complaints.location === 'ankle' && findings.objectiveFindings.toesROM && (
                          <TableRow>
                            <TableCell>Toes</TableCell>
                            <TableCell>{findings.objectiveFindings.toesROM}</TableCell>
                            {findings.objectiveFindings.includeProm && (
                              <TableCell>-</TableCell>
                            )}
                          </TableRow>
                        )}

                      </TableBody>
                    </Table>
                    )}
                  </div>
                )}
                
                {/* Gross Fingers ROM Text for Wrist */}
                {findings.complaints.location === 'wrist' && findings.objectiveFindings.grossFingersROM && (
                  <div className="bg-gray-100 p-3 rounded mt-2">
                    <p className="text-sm">AROM of {pronouns.his.toLowerCase()} {findings.complaints.side === 'bilateral' ? 'bilateral' : findings.complaints.side || '[side]'} hand fingers was {findings.objectiveFindings.grossFingersROM}.</p>
                  </div>
                )}
              </div>

              {/* Muscle Power Block - Hidden for hand region */}
              {findings.complaints.location !== 'hand' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">
                      {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'Myotome Testing' : 'Muscle Power (Oxford Manual Muscle Testing Scale)'}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="musclePowerNotTested"
                        checked={findings.objectiveFindings.musclePowerNotTested}
                        onCheckedChange={(checked) => handleObjectiveFindingChange('musclePowerNotTested', checked)}
                      />
                      <Label htmlFor="musclePowerNotTested" className="text-sm">Not tested</Label>
                    </div>
                  </div>
                  
                  {!findings.objectiveFindings.musclePowerNotTested && (
                    findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? (
                      <>
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Smart Auto-fill:</strong> Select a grade to apply to all levels, then modify individual levels as needed.
                          </p>
                          <div className="flex gap-2 items-center">
                            <Select onValueChange={(value) => {
                              const updatedMyotome = findings.objectiveFindings.myotome.map(level => ({
                                ...level,
                                leftGrade: value,
                                rightGrade: value
                              }));
                              handleObjectiveFindingChange('myotome', updatedMyotome);
                            }}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0/5</SelectItem>
                                <SelectItem value="1">1/5</SelectItem>
                                <SelectItem value="2">2/5</SelectItem>
                                <SelectItem value="3">3/5</SelectItem>
                                <SelectItem value="4">4/5</SelectItem>
                                <SelectItem value="5">5/5</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-600">Auto-fill all levels</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                        {findings.objectiveFindings.myotome.map((level, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 items-center">
                            <Label className="w-16">{level.level}</Label>
                            <Select
                              value={level.leftGrade}
                              onValueChange={(value) => updateArrayItem('myotome', index, { ...level, leftGrade: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Left" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0/5</SelectItem>
                                <SelectItem value="1">1/5</SelectItem>
                                <SelectItem value="2">2/5</SelectItem>
                                <SelectItem value="3">3/5</SelectItem>
                                <SelectItem value="4">4/5</SelectItem>
                                <SelectItem value="5">5/5</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              value={level.rightGrade}
                              onValueChange={(value) => updateArrayItem('myotome', index, { ...level, rightGrade: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Right" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0/5</SelectItem>
                                <SelectItem value="1">1/5</SelectItem>
                                <SelectItem value="2">2/5</SelectItem>
                                <SelectItem value="3">3/5</SelectItem>
                                <SelectItem value="4">4/5</SelectItem>
                                <SelectItem value="5">5/5</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : findings.complaints.location === 'wrist' ? (
                  <>
                    {/* Wrist Muscle Power - moved to first position */}
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Smart Auto-fill:</strong> Select a grade to apply to all muscle groups, then modify individual groups as needed.
                      </p>
                      <div className="flex gap-2 items-center">
                        <Select onValueChange={(value) => {
                          const updatedMusclePower = findings.objectiveFindings.musclePower.map(muscle => ({
                            ...muscle,
                            ...(findings.complaints.side !== 'right' && { leftGrade: value }),
                            ...(findings.complaints.side !== 'left' && { rightGrade: value })
                          }));
                          handleObjectiveFindingChange('musclePower', updatedMusclePower);
                        }}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0/5</SelectItem>
                            <SelectItem value="1">1/5</SelectItem>
                            <SelectItem value="2">2/5</SelectItem>
                            <SelectItem value="3">3/5</SelectItem>
                            <SelectItem value="4">4/5</SelectItem>
                            <SelectItem value="5">5/5</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className="text-sm">Apply to all muscle groups</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const clearedMusclePower = findings.objectiveFindings.musclePower.map(muscle => ({
                              ...muscle,
                              ...(findings.complaints.side !== 'right' && { leftGrade: '' }),
                              ...(findings.complaints.side !== 'left' && { rightGrade: '' })
                            }));
                            handleObjectiveFindingChange('musclePower', clearedMusclePower);
                          }}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`grid gap-4 mb-2 ${
                      findings.complaints.side === 'left' ? 'grid-cols-2' :
                      findings.complaints.side === 'right' ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      <div className="text-center font-medium">Muscle Group</div>
                      {(findings.complaints.side !== 'right') && <div className="text-center font-medium">Left</div>}
                      {(findings.complaints.side !== 'left') && <div className="text-center font-medium">Right</div>}
                    </div>
                    <div className="space-y-2">
                      {findings.objectiveFindings.musclePower.map((muscle, index) => (
                        <div key={index} className={`grid gap-2 items-center ${
                          findings.complaints.side === 'left' ? 'grid-cols-2' :
                          findings.complaints.side === 'right' ? 'grid-cols-2' :
                          'grid-cols-3'
                        }`}>
                          <Label className="flex items-center">{muscle.muscleGroup}</Label>
                          {(findings.complaints.side !== 'right') && (
                            <Select
                              value={muscle.leftGrade}
                              onValueChange={(value) => updateArrayItem('musclePower', index, { ...muscle, leftGrade: value })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0/5</SelectItem>
                                <SelectItem value="1">1/5</SelectItem>
                                <SelectItem value="2">2/5</SelectItem>
                                <SelectItem value="3">3/5</SelectItem>
                                <SelectItem value="4">4/5</SelectItem>
                                <SelectItem value="5">5/5</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {(findings.complaints.side !== 'left') && (
                            <Select
                              value={muscle.rightGrade}
                              onValueChange={(value) => updateArrayItem('musclePower', index, { ...muscle, rightGrade: value })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0/5</SelectItem>
                                <SelectItem value="1">1/5</SelectItem>
                                <SelectItem value="2">2/5</SelectItem>
                                <SelectItem value="3">3/5</SelectItem>
                                <SelectItem value="4">4/5</SelectItem>
                                <SelectItem value="5">5/5</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Hand Grip Strength for Wrist - moved after muscle power */}
                    <div className="space-y-4">
                      <h6 className="font-medium">Hand Grip Strength</h6>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center font-medium">Test Type</div>
                        <div className="text-center font-medium">Left (kgf)</div>
                        <div className="text-center font-medium">Right (kgf)</div>
                        
                        <Label className="flex items-center">Hand Grip</Label>
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.leftHandGrip || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, leftHandGrip: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 25"
                        />
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.rightHandGrip || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, rightHandGrip: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 28"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Smart Auto-fill:</strong> Select a grade to apply to all muscle groups, then modify individual groups as needed.
                      </p>
                      <div className="flex gap-2 items-center">
                        <Select onValueChange={(value) => {
                          const updatedMusclePower = findings.objectiveFindings.musclePower.map(muscle => ({
                            ...muscle,
                            ...(findings.complaints.side !== 'right' && { leftGrade: value }),
                            ...(findings.complaints.side !== 'left' && { rightGrade: value })
                          }));
                          handleObjectiveFindingChange('musclePower', updatedMusclePower);
                        }}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0/5</SelectItem>
                            <SelectItem value="1">1/5</SelectItem>
                            <SelectItem value="2">2/5</SelectItem>
                            <SelectItem value="3">3/5</SelectItem>
                            <SelectItem value="4">4/5</SelectItem>
                            <SelectItem value="5">5/5</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className="text-sm">Apply to all muscle groups</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const clearedMusclePower = findings.objectiveFindings.musclePower.map(muscle => ({
                              ...muscle,
                              ...(findings.complaints.side !== 'right' && { leftGrade: '' }),
                              ...(findings.complaints.side !== 'left' && { rightGrade: '' })
                            }));
                            handleObjectiveFindingChange('musclePower', clearedMusclePower);
                          }}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`grid gap-4 mb-2 ${
                      findings.complaints.side === 'left' ? 'grid-cols-2' :
                      findings.complaints.side === 'right' ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      <div className="text-center font-medium">Muscle Group</div>
                      {(findings.complaints.side !== 'right') && <div className="text-center font-medium">Left</div>}
                      {(findings.complaints.side !== 'left') && <div className="text-center font-medium">Right</div>}
                    </div>
                    <div className="space-y-2">
                      {findings.objectiveFindings.musclePower.map((muscle, index) => (
                        <div key={index} className={`grid gap-2 items-center ${
                          findings.complaints.side === 'left' ? 'grid-cols-2' :
                          findings.complaints.side === 'right' ? 'grid-cols-2' :
                          'grid-cols-3'
                        }`}>
                          <Label className="flex items-center">{muscle.muscleGroup}</Label>
                          {(findings.complaints.side !== 'right') && (
                            <Select
                              value={muscle.leftGrade}
                              onValueChange={(value) => updateArrayItem('musclePower', index, { ...muscle, leftGrade: value })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0 out of 5</SelectItem>
                                <SelectItem value="1">1 out of 5</SelectItem>
                                <SelectItem value="2">2 out of 5</SelectItem>
                                <SelectItem value="3">3 out of 5</SelectItem>
                                <SelectItem value="4">4 out of 5</SelectItem>
                                <SelectItem value="5">5 out of 5</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {(findings.complaints.side !== 'left') && (
                            <Select
                              value={muscle.rightGrade}
                              onValueChange={(value) => updateArrayItem('musclePower', index, { ...muscle, rightGrade: value })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0 out of 5</SelectItem>
                                <SelectItem value="1">1 out of 5</SelectItem>
                                <SelectItem value="2">2 out of 5</SelectItem>
                                <SelectItem value="3">3 out of 5</SelectItem>
                                <SelectItem value="4">4 out of 5</SelectItem>
                                <SelectItem value="5">5 out of 5</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                  )
                )}
                </div>
              )}

              {/* Hand Grip Strength Block - Only for hand region */}
              {findings.complaints.location === 'hand' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Hand Grip Strength</h5>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="handGripNotTested"
                        checked={findings.objectiveFindings.handGripNotTested}
                        onCheckedChange={(checked) => handleObjectiveFindingChange('handGripNotTested', checked)}
                      />
                      <Label htmlFor="handGripNotTested" className="text-sm">Not tested</Label>
                    </div>
                  </div>
                  
                  {!findings.objectiveFindings.handGripNotTested && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center font-medium">Test Type</div>
                        <div className="text-center font-medium">Left (kgf)</div>
                        <div className="text-center font-medium">Right (kgf)</div>
                        
                        <Label className="flex items-center">Hand Grip</Label>
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.leftHandGrip || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, leftHandGrip: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 25"
                        />
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.rightHandGrip || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, rightHandGrip: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 28"
                        />
                        
                        <Label className="flex items-center">Pinch Grip</Label>
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.leftPinchGrip || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, leftPinchGrip: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 8"
                        />
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.rightPinchGrip || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, rightPinchGrip: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 8"
                        />
                        
                        <Label className="flex items-center">Lateral Pinch</Label>
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.leftLateralPinch || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, leftLateralPinch: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 10"
                        />
                        <Input
                          value={findings.objectiveFindings.handGripStrength?.rightLateralPinch || ''}
                          onChange={(e) => {
                            const updated = { ...findings.objectiveFindings.handGripStrength, rightLateralPinch: e.target.value };
                            handleObjectiveFindingChange('handGripStrength', updated);
                          }}
                          placeholder="e.g., 10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Muscle Power Preview - Hidden for hand region */}
              {findings.complaints.location !== 'hand' && 
               !findings.objectiveFindings.musclePowerNotTested && (((findings.complaints.location === 'back' || findings.complaints.location === 'neck') && 
                  findings.objectiveFindings.myotome.some(m => m.leftGrade || m.rightGrade)) ||
                 // Hand region: No standalone preview for any handgrip data
                 (findings.complaints.location === 'wrist' && 
                  ((findings.objectiveFindings.handGripStrength?.leftHandGrip || findings.objectiveFindings.handGripStrength?.rightHandGrip) ||
                   findings.objectiveFindings.musclePower.some(m => m.leftGrade || m.rightGrade))) ||
                 (findings.complaints.location !== 'back' && findings.complaints.location !== 'neck' && findings.complaints.location !== 'hand' && findings.complaints.location !== 'wrist' &&
                  findings.objectiveFindings.musclePower.some(m => m.leftGrade || m.rightGrade))) && (
                  <div className="bg-gray-100 p-3 rounded">
                    <h6 className="font-medium mb-2">
                      {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'Myotome Preview:' : 'Muscle Power Preview:'}
                    </h6>
                    <p className="text-sm mb-2">
                      2. The {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'myotome' : 'muscle power'} of {pronouns.his.toLowerCase()} {getRegionText()}, as charted by Oxford Manual Muscle Testing Scale, was stated as below:
                    </p>
                    
                    {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Level</TableHead>
                            <TableHead>Left</TableHead>
                            <TableHead>Right</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {findings.objectiveFindings.myotome.filter(m => m.leftGrade || m.rightGrade).map((level, index) => (
                            <TableRow key={index}>
                              <TableCell>{level.level}</TableCell>
                              <TableCell>{level.leftGrade ? `${level.leftGrade}/5` : '[Grade]'}</TableCell>
                              <TableCell>{level.rightGrade ? `${level.rightGrade}/5` : '[Grade]'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : findings.complaints.location === 'hand' ? (
                      (() => {
                        const grip = findings.objectiveFindings.handGripStrength;
                        const hasHandGrip = grip?.leftHandGrip || grip?.rightHandGrip;
                        const hasPinchData = grip?.leftPinchGrip || grip?.rightPinchGrip || grip?.leftLateralPinch || grip?.rightLateralPinch;
                        const hasData = hasHandGrip || hasPinchData;
                        
                        // If only hand grip data (no pinch/lateral pinch), don't show table preview
                        if (hasHandGrip && !hasPinchData) {
                          return null;
                        }
                        
                        if (!hasData) return null;
                        
                        return (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Grip Strength</TableHead>
                                <TableHead>Left (kgf)</TableHead>
                                <TableHead>Right (kgf)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {hasHandGrip && (
                                <TableRow>
                                  <TableCell>Hand Grip</TableCell>
                                  <TableCell>{grip?.leftHandGrip || '[X]'}</TableCell>
                                  <TableCell>{grip?.rightHandGrip || '[X]'}</TableCell>
                                </TableRow>
                              )}
                              {(grip?.leftPinchGrip || grip?.rightPinchGrip) && (
                                <TableRow>
                                  <TableCell>Pinch Grip</TableCell>
                                  <TableCell>{grip?.leftPinchGrip || '[X]'}</TableCell>
                                  <TableCell>{grip?.rightPinchGrip || '[X]'}</TableCell>
                                </TableRow>
                              )}
                              {(grip?.leftLateralPinch || grip?.rightLateralPinch) && (
                                <TableRow>
                                  <TableCell>Lateral Pinch</TableCell>
                                  <TableCell>{grip?.leftLateralPinch || '[X]'}</TableCell>
                                  <TableCell>{grip?.rightLateralPinch || '[X]'}</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        );
                      })()
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/2">Muscle Group</TableHead>
                            {findings.complaints.side === 'left' && <TableHead className="w-1/2">Grade</TableHead>}
                            {findings.complaints.side === 'right' && <TableHead className="w-1/2">Grade</TableHead>}
                            {(findings.complaints.side === 'bilateral' || !findings.complaints.side) && (
                              <>
                                <TableHead className="w-1/4">Left</TableHead>
                                <TableHead className="w-1/4">Right</TableHead>
                              </>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {findings.objectiveFindings.musclePower.filter(m => m.leftGrade || m.rightGrade).map((muscle, index) => (
                            <TableRow key={index}>
                              <TableCell className="w-1/2">{muscle.muscleGroup}</TableCell>
                              {findings.complaints.side === 'left' && (
                                <TableCell className="w-1/2">{muscle.leftGrade ? `${muscle.leftGrade}/5` : '[Grade]'}</TableCell>
                              )}
                              {findings.complaints.side === 'right' && (
                                <TableCell className="w-1/2">{muscle.rightGrade ? `${muscle.rightGrade}/5` : '[Grade]'}</TableCell>
                              )}
                              {(findings.complaints.side === 'bilateral' || !findings.complaints.side) && (
                                <>
                                  <TableCell className="w-1/4">{muscle.leftGrade ? `${muscle.leftGrade}/5` : '[Grade]'}</TableCell>
                                  <TableCell className="w-1/4">{muscle.rightGrade ? `${muscle.rightGrade}/5` : '[Grade]'}</TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
            </>
          )}

          {/* Splint/Brace/Cast Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="splintBraceCastInclude"
                checked={findings.objectiveFindings.splintBraceCastInclude}
                onCheckedChange={(checked) => handleObjectiveFindingChange('splintBraceCastInclude', checked)}
              />
              <Label htmlFor="splintBraceCastInclude">Include splint/brace/cast?</Label>
            </div>
            
            {findings.objectiveFindings.splintBraceCastInclude && (
              <div className="space-y-2">
                <Label htmlFor="splintBraceCastType">Which kind of splint/brace/cast?</Label>
                <Input
                  id="splintBraceCastType"
                  value={findings.objectiveFindings.splintBraceCastType}
                  onChange={(e) => handleObjectiveFindingChange('splintBraceCastType', e.target.value)}
                  placeholder="e.g., hinged knee brace, short leg cast, dynamic extension splint"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tendernessInclude"
                checked={findings.objectiveFindings.tendernessInclude}
                onCheckedChange={(checked) => handleObjectiveFindingChange('tendernessInclude', checked)}
              />
              <Label htmlFor="tendernessInclude">Include tenderness finding</Label>
            </div>
            
            {findings.objectiveFindings.tendernessInclude && (
              <div className="space-y-2">
                <Label htmlFor="tendernessArea">Tenderness Area</Label>
                <Input
                  id="tendernessArea"
                  value={findings.objectiveFindings.tendernessArea}
                  onChange={(e) => handleObjectiveFindingChange('tendernessArea', autoLowercaseFirstWord(e.target.value))}
                  placeholder="e.g., lateral epicondyle"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="swellingInclude"
                checked={findings.objectiveFindings.swellingInclude}
                onCheckedChange={(checked) => handleObjectiveFindingChange('swellingInclude', checked)}
              />
              <Label htmlFor="swellingInclude">Include swelling assessment</Label>
            </div>
            
            {findings.objectiveFindings.swellingInclude && (
              <div className="space-y-2 ml-6">
                <Label>Swelling Present?</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="swellingYes"
                      name="swelling"
                      checked={findings.objectiveFindings.swellingPresent}
                      onChange={() => handleObjectiveFindingChange('swellingPresent', true)}
                    />
                    <Label htmlFor="swellingYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="swellingNo"
                      name="swelling"
                      checked={!findings.objectiveFindings.swellingPresent}
                      onChange={() => handleObjectiveFindingChange('swellingPresent', false)}
                    />
                    <Label htmlFor="swellingNo">No</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="temperatureInclude"
                checked={findings.objectiveFindings.temperatureInclude}
                onCheckedChange={(checked) => handleObjectiveFindingChange('temperatureInclude', checked)}
              />
              <Label htmlFor="temperatureInclude">Include temperature assessment</Label>
            </div>
            
            {findings.objectiveFindings.temperatureInclude && (
              <div className="space-y-2 ml-6">
                <Label>Increased Temperature?</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="temperatureYes"
                      name="temperature"
                      checked={findings.objectiveFindings.temperatureIncreased}
                      onChange={() => handleObjectiveFindingChange('temperatureIncreased', true)}
                    />
                    <Label htmlFor="temperatureYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="temperatureNo"
                      name="temperature"
                      checked={!findings.objectiveFindings.temperatureIncreased}
                      onChange={() => handleObjectiveFindingChange('temperatureIncreased', false)}
                    />
                    <Label htmlFor="temperatureNo">No</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Prompts for Back/Neck regions */}
            {(findings.complaints.location === 'back' || findings.complaints.location === 'neck') && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  Please input sensation and reflex assessment finding for {findings.complaints.location} region.
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sensationInclude"
                checked={findings.objectiveFindings.sensationInclude}
                onCheckedChange={(checked) => handleObjectiveFindingChange('sensationInclude', checked)}
              />
              <Label htmlFor="sensationInclude">Include sensation assessment</Label>
            </div>
            
            {findings.objectiveFindings.sensationInclude && (
              <div className="space-y-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="sensationStatus">Sensation Status</Label>
                  <Select 
                    value={findings.objectiveFindings.sensationStatus || 'intact'} 
                    onValueChange={(value) => {
                      handleObjectiveFindingChange('sensationStatus', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sensation status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intact">Intact</SelectItem>
                      <SelectItem value="reduced">Reduced</SelectItem>
                      <SelectItem value="hypersensitive">Hypersensitivity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Show fields for Reduced sensation only */}
                {findings.objectiveFindings.sensationStatus === 'reduced' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sensationReduction">Reduction Percentage</Label>
                      <Input
                        id="sensationReduction"
                        value={findings.objectiveFindings.sensationReduction}
                        onChange={(e) => handleObjectiveFindingChange('sensationReduction', e.target.value)}
                        onBlur={(e) => {
                          const formattedValue = autoAddPercentage(e.target.value);
                          e.target.value = formattedValue; // Update the input field to show the formatted value
                          handleObjectiveFindingChange('sensationReduction', formattedValue);
                        }}
                        placeholder="e.g., 50%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="areaReduced">Over Which Area</Label>
                      <Input
                        id="areaReduced"
                        value={findings.objectiveFindings.areaReduced}
                        onChange={(e) => handleObjectiveFindingChange('areaReduced', autoLowercaseFirstWord(e.target.value))}
                        placeholder="e.g., dorsal aspect of hand"
                      />
                    </div>
                  </div>
                )}
                
                {/* Show field for Hypersensitivity only */}
                {findings.objectiveFindings.sensationStatus === 'hypersensitive' && (
                  <div className="space-y-2">
                    <Label htmlFor="areaHypersensitive">Over Which Area</Label>
                    <Input
                      id="areaHypersensitive"
                      value={findings.objectiveFindings.areaHypersensitive}
                      onChange={(e) => handleObjectiveFindingChange('areaHypersensitive', autoLowercaseFirstWord(e.target.value))}
                      placeholder="e.g., dorsal aspect of hand"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reflexInclude"
                checked={findings.objectiveFindings.reflexInclude}
                onCheckedChange={(checked) => handleObjectiveFindingChange('reflexInclude', checked)}
              />
              <Label htmlFor="reflexInclude">Include reflex finding</Label>
            </div>
            
            {findings.objectiveFindings.reflexInclude && (
              <div className="space-y-4">
                <h5 className="font-medium">Reflex</h5>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="reflexNormal"
                      name="reflex"
                      checked={findings.objectiveFindings.reflexNormal}
                      onChange={() => handleObjectiveFindingChange('reflexNormal', true)}
                    />
                    <Label htmlFor="reflexNormal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="reflexAbnormal"
                      name="reflex"
                      checked={!findings.objectiveFindings.reflexNormal}
                      onChange={() => handleObjectiveFindingChange('reflexNormal', false)}
                    />
                    <Label htmlFor="reflexAbnormal">Abnormal</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h5 className="font-medium">Gait</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="walkingAid">Walking Aid</Label>
              <Select value={findings.objectiveFindings.walkingAid} onValueChange={(value) => handleObjectiveFindingChange('walkingAid', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select walking aid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unaided">Unaided</SelectItem>
                  <SelectItem value="stick">Stick</SelectItem>
                  <SelectItem value="quadruped">Quadruped</SelectItem>
                  <SelectItem value="frame">Frame</SelectItem>
                  <SelectItem value="elbow crutches">Elbow Crutches</SelectItem>
                  <SelectItem value="rollator">Rollator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="walkingStability">Walking Stability</Label>
              <Select value={findings.objectiveFindings.walkingStability} onValueChange={(value) => handleObjectiveFindingChange('walkingStability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="acceptable">Acceptable</SelectItem>
                  <SelectItem value="satisfactory">Satisfactory</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wbStatusInclude"
                  checked={findings.objectiveFindings.wbStatusInclude}
                  onCheckedChange={(checked) => handleObjectiveFindingChange('wbStatusInclude', checked)}
                />
                <Label htmlFor="wbStatusInclude">WB Status</Label>
              </div>
              {findings.objectiveFindings.wbStatusInclude && (
                <Select value={findings.objectiveFindings.wbStatus} onValueChange={(value) => handleObjectiveFindingChange('wbStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select WB status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partial weight bearing">Partial weight bearing</SelectItem>
                    <SelectItem value="full weight bearing">Full weight bearing</SelectItem>
                    <SelectItem value="non weight bearing">Non weight bearing</SelectItem>
                    <SelectItem value="toe touching down">Toe touching down</SelectItem>
                    <SelectItem value="weight bearing as tolerated">Weight bearing as tolerated</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Special Tests</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('specialTests', { testName: '', testType: 'other', result: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Test
              </Button>
            </div>
            
            {/* Prompt for Back region special tests */}
            {findings.complaints.location === 'back' && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-yellow-800">
                  Please input straight leg raise result for back region.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              {findings.objectiveFindings.specialTests.map((test, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex gap-2 items-center">
                    <Select
                      value={test.testType || 'other'}
                      onValueChange={(value) => {
                        const testType = value as 'straight_leg_raise' | 'other';
                        if (testType === 'straight_leg_raise') {
                          updateArrayItem('specialTests', index, { 
                            ...test, 
                            testType, 
                            testName: 'Straight leg raise',
                            result: undefined,
                            leftResult: test.leftResult || '',
                            rightResult: test.rightResult || ''
                          });
                        } else {
                          updateArrayItem('specialTests', index, { 
                            ...test, 
                            testType, 
                            testName: test.testName || '',
                            result: test.result || '',
                            leftResult: undefined,
                            rightResult: undefined
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="straight_leg_raise">Straight leg raise</SelectItem>
                        <SelectItem value="other">Other test</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('specialTests', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {test.testType === 'straight_leg_raise' ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-sm">Left Result</Label>
                          <Select
                            value={test.leftResult || ''}
                            onValueChange={(value) => updateArrayItem('specialTests', index, { ...test, leftResult: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Left result" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positive">Positive</SelectItem>
                              <SelectItem value="negative">Negative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Right Result</Label>
                          <Select
                            value={test.rightResult || ''}
                            onValueChange={(value) => updateArrayItem('specialTests', index, { ...test, rightResult: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Right result" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positive">Positive</SelectItem>
                              <SelectItem value="negative">Negative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Input
                          value={test.testName || ''}
                          onChange={(e) => updateArrayItem('specialTests', index, { ...test, testName: e.target.value })}
                          placeholder="Test Name (e.g., Phalen's test)"
                          className="flex-1"
                        />
                        <Select
                          value={test.result || ''}
                          onValueChange={(value) => updateArrayItem('specialTests', index, { ...test, result: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Result" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="negative">Negative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-gray-600 ml-1">
                        Type full name of the test, e.g. straight leg raise
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Questionnaires</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('questionnaires', { name: '', score: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Questionnaire
              </Button>
            </div>
            
            <div className="space-y-2">
              {findings.objectiveFindings.questionnaires.map((questionnaire, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select
                    value={questionnaire.name}
                    onValueChange={(value) => updateArrayItem('questionnaires', index, { ...questionnaire, name: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select questionnaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {getRegionQuestionnaires(findings.complaints.location).map((q) => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={questionnaire.name}
                    onChange={(e) => updateArrayItem('questionnaires', index, { ...questionnaire, name: e.target.value })}
                    placeholder="Questionnaire Name (e.g., QuickDASH)"
                    className="flex-1"
                  />
                  <Input
                    value={questionnaire.score}
                    onChange={(e) => updateArrayItem('questionnaires', index, { ...questionnaire, score: e.target.value })}
                    placeholder="Score (e.g., 45%)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('questionnaires', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>



          {/* Objective Findings Preview */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h5 className="font-medium mb-2">II. Objective Findings Preview</h5>
            <div className="text-sm space-y-3">
              {(() => {
                const elements = [];
                let counter = 1;
                
                // Objective Findings - AROM
                if (findings.objectiveFindings.aromNotTested) {
                  // AROM not tested case
                  elements.push(
                    <div key={`arom-not-tested-${counter}`}>
                      <p>{counter++}. The range of movement (ROM) of {pronouns.his.toLowerCase()} {getRegionText().toLowerCase()} is not tested.</p>
                    </div>
                  );
                } else {
                  // AROM tested case
                  const hasAromData = findings.objectiveFindings.aromMovements.some(m => m.arom || m.prom) || 
                    ((findings.complaints.location === 'hand' || findings.complaints.location === 'foot') && findings.objectiveFindings.fingersToesData?.some(ft => ft.name && ft.joints.some(j => j.range)));
                  
                  if (hasAromData) {
                  elements.push(
                    <div key={`arom-${counter}`}>
                      <p>{counter++}. The active range of movement (AROM) of {pronouns.his.toLowerCase()} {getRegionText()} was charted as below:</p>
                      <div className="mt-2">
                        {(findings.complaints.location === 'hand' || findings.complaints.location === 'foot') ? (
                          <div className="space-y-3">
                            {findings.objectiveFindings.fingersToesData?.filter(ft => ft.name && ft.joints.some(j => j.range)).map((fingerToe, index) => {
                              const validJoints = fingerToe.joints.filter(j => j.range);
                              if (validJoints.length === 0) return null;
                              
                              const fingersToesCount = findings.objectiveFindings.fingersToesData?.filter(ft => ft.name && ft.joints.some(j => j.range)).length || 0;
                              
                              if (fingersToesCount === 1) {
                                return (
                                  <Table key={index}>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>{findings.complaints.side.charAt(0).toUpperCase() + findings.complaints.side.slice(1).toLowerCase()} {fingerToe.name.toLowerCase()} movement</TableHead>
                                        <TableHead>AROM</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {validJoints.map((joint, jointIndex) => {
                                        const jointOption = getSmallJointOptions(findings.complaints.location).find(o => o.value === joint.jointType);
                                        return (
                                          <TableRow key={jointIndex}>
                                            <TableCell>{jointOption?.label}</TableCell>
                                            <TableCell>{joint.range}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                );
                              }
                              return null;
                            })}
                            
                            {(() => {
                              const validFingersToes = findings.objectiveFindings.fingersToesData?.filter(ft => ft.name && ft.joints.some(j => j.range)) || [];
                              if (validFingersToes.length > 1) {
                                const allJointTypes = [...new Set(validFingersToes.flatMap(ft => ft.joints.filter(j => j.range).map(j => j.jointType)))];
                                
                                return (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>{findings.complaints.location === 'hand' ? 'Fingers joints' : 'Toes joints'}</TableHead>
                                        {validFingersToes.map((ft, index) => (
                                          <TableHead key={index}>{ft.name.charAt(0).toUpperCase() + ft.name.slice(1).toLowerCase()}</TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {allJointTypes.map((jointType, jointIndex) => {
                                        const jointOption = getSmallJointOptions(findings.complaints.location).find(o => o.value === jointType);
                                        return (
                                          <TableRow key={jointIndex}>
                                            <TableCell>{jointOption?.label}</TableCell>
                                            {validFingersToes.map((ft, ftIndex) => {
                                              const joint = ft.joints.find(j => j.jointType === jointType);
                                              return (
                                                <TableCell key={ftIndex}>{joint?.range || '-'}</TableCell>
                                              );
                                            })}
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Movement</TableHead>
                                <TableHead>AROM {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'of full range' : 'in degrees'}</TableHead>
                                {findings.objectiveFindings.includeProm && <TableHead>PROM {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? 'of full range' : 'in degrees'}</TableHead>}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {findings.objectiveFindings.aromMovements.filter(m => m.arom || m.prom).map((movement, index) => (
                                <TableRow key={index}>
                                  <TableCell>{movement.movement}</TableCell>
                                  <TableCell>{movement.arom || '[X]'}</TableCell>
                                  {findings.objectiveFindings.includeProm && <TableCell>{movement.prom || '[X]'}</TableCell>}
                                </TableRow>
                              ))}
                              {findings.complaints.location === 'ankle' && findings.objectiveFindings.toesROM && (
                                <TableRow>
                                  <TableCell>Toes</TableCell>
                                  <TableCell>{findings.objectiveFindings.toesROM}</TableCell>
                                  {findings.objectiveFindings.includeProm && <TableCell>-</TableCell>}
                                </TableRow>
                              )}

                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </div>
                  );
                }
                } // Close the else block for AROM tested case
                
                // Gross Fingers ROM for Wrist (separate from AROM table)
                if (findings.complaints.location === 'wrist' && findings.objectiveFindings.grossFingersROM) {
                  const sideText = findings.complaints.side === 'bilateral' ? 'bilateral' : findings.complaints.side || '[side]';
                  elements.push(<p key={`gross-fingers-${counter}`}>{counter++}. AROM of {pronouns.his.toLowerCase()} {sideText} hand fingers was {findings.objectiveFindings.grossFingersROM}.</p>);
                }
                
                // Objective Findings - Muscle Power
                if (findings.objectiveFindings.musclePowerNotTested) {
                  let regionText = '';
                  if (findings.complaints.location === 'back') {
                    regionText = 'lower limbs';
                  } else if (findings.complaints.location === 'neck') {
                    regionText = 'upper limbs';
                  } else {
                    regionText = getRegionText();
                  }
                  
                  elements.push(<p key={`muscle-not-tested-${counter}`}>{counter++}. The muscle power of {regionText}, as charted by Oxford Manual Muscle Testing Scale, was not tested.</p>);
                }
                
                const hasMusclePowerData = !findings.objectiveFindings.musclePowerNotTested && (
                  ((findings.complaints.location === 'back' || findings.complaints.location === 'neck') && 
                    findings.objectiveFindings.myotome.some(m => m.leftGrade || m.rightGrade)) ||
                  (findings.complaints.location === 'hand' && !findings.objectiveFindings.handGripNotTested &&
                    // Only show table format when there's pinch/lateral pinch data (not just handgrip)
                    (findings.objectiveFindings.handGripStrength?.leftPinchGrip || findings.objectiveFindings.handGripStrength?.rightPinchGrip || 
                     findings.objectiveFindings.handGripStrength?.leftLateralPinch || findings.objectiveFindings.handGripStrength?.rightLateralPinch)) ||
                  (findings.complaints.location === 'wrist' && 
                    ((findings.objectiveFindings.handGripStrength?.leftHandGrip || findings.objectiveFindings.handGripStrength?.rightHandGrip) ||
                     findings.objectiveFindings.musclePower.some(m => m.leftGrade || m.rightGrade))) ||
                  (findings.complaints.location !== 'back' && findings.complaints.location !== 'neck' && findings.complaints.location !== 'hand' && findings.complaints.location !== 'wrist' &&
                    findings.objectiveFindings.musclePower.some(m => m.leftGrade || m.rightGrade))
                );
                
                if (hasMusclePowerData) {
                  let muscleText = '';
                  if (findings.complaints.location === 'back') {
                    muscleText = `The muscle power of ${pronouns.his.toLowerCase()} lower limbs, as charted by Oxford Manual Muscle Testing Scale, was stated as below:`;
                  } else if (findings.complaints.location === 'neck') {
                    muscleText = `The muscle power of ${pronouns.his.toLowerCase()} upper limbs, as charted by Oxford Manual Muscle Testing Scale, was stated as below:`;
                  } else if (findings.complaints.location === 'hand') {
                    // For hand region with multiple grip data (pinch/lateral pinch)
                    const sideText = findings.complaints.side === 'bilateral' ? 'bilateral' : findings.complaints.side || '[side]';
                    muscleText = `The grip strength of ${pronouns.his.toLowerCase()} ${sideText} hand was stated as below:`;
                  } else {
                    muscleText = `The muscle power of ${pronouns.his.toLowerCase()} ${getRegionText()}, as charted by Oxford Manual Muscle Testing Scale, was stated as below:`;
                  }
                  
                  elements.push(
                    <div key={`muscle-${counter}`}>
                      <p>{counter++}. {muscleText}</p>
                      <div className="mt-2">
                        {findings.complaints.location === 'back' || findings.complaints.location === 'neck' ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Myotome</TableHead>
                                <TableHead>Left</TableHead>
                                <TableHead>Right</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {findings.objectiveFindings.myotome.filter(m => m.leftGrade || m.rightGrade).map((level, index) => (
                                <TableRow key={index}>
                                  <TableCell>{level.level}</TableCell>
                                  <TableCell>{level.leftGrade ? `${level.leftGrade} out of 5` : '[X] out of 5'}</TableCell>
                                  <TableCell>{level.rightGrade ? `${level.rightGrade} out of 5` : '[X] out of 5'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : findings.complaints.location === 'hand' ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Grip Strength</TableHead>
                                <TableHead>Left (kgf)</TableHead>
                                <TableHead>Right (kgf)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(() => {
                                const grip = findings.objectiveFindings.handGripStrength;
                                const rows = [];
                                if (grip?.leftHandGrip || grip?.rightHandGrip) {
                                  rows.push(
                                    <TableRow key="hand-grip">
                                      <TableCell>Hand Grip</TableCell>
                                      <TableCell>{grip?.leftHandGrip || '[X]'}</TableCell>
                                      <TableCell>{grip?.rightHandGrip || '[X]'}</TableCell>
                                    </TableRow>
                                  );
                                }
                                if (grip?.leftPinchGrip || grip?.rightPinchGrip) {
                                  rows.push(
                                    <TableRow key="pinch-grip">
                                      <TableCell>Pinch Grip</TableCell>
                                      <TableCell>{grip?.leftPinchGrip || '[X]'}</TableCell>
                                      <TableCell>{grip?.rightPinchGrip || '[X]'}</TableCell>
                                    </TableRow>
                                  );
                                }
                                if (grip?.leftLateralPinch || grip?.rightLateralPinch) {
                                  rows.push(
                                    <TableRow key="lateral-pinch">
                                      <TableCell>Lateral Pinch</TableCell>
                                      <TableCell>{grip?.leftLateralPinch || '[X]'}</TableCell>
                                      <TableCell>{grip?.rightLateralPinch || '[X]'}</TableCell>
                                    </TableRow>
                                  );
                                }
                                return rows;
                              })()}
                            </TableBody>
                          </Table>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/2">Muscle Group</TableHead>
                                {findings.complaints.side === 'left' && <TableHead className="w-1/2">Grade</TableHead>}
                                {findings.complaints.side === 'right' && <TableHead className="w-1/2">Grade</TableHead>}
                                {(findings.complaints.side === 'bilateral' || !findings.complaints.side) && (
                                  <>
                                    <TableHead className="w-1/4">Left</TableHead>
                                    <TableHead className="w-1/4">Right</TableHead>
                                  </>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {findings.objectiveFindings.musclePower.filter(m => m.leftGrade || m.rightGrade).map((muscle, index) => (
                                <TableRow key={index}>
                                  <TableCell className="w-1/2">{muscle.muscleGroup}</TableCell>
                                  {findings.complaints.side === 'left' && (
                                    <TableCell className="w-1/2">{muscle.leftGrade ? `${muscle.leftGrade} out of 5` : '[X] out of 5'}</TableCell>
                                  )}
                                  {findings.complaints.side === 'right' && (
                                    <TableCell className="w-1/2">{muscle.rightGrade ? `${muscle.rightGrade} out of 5` : '[X] out of 5'}</TableCell>
                                  )}
                                  {(findings.complaints.side === 'bilateral' || !findings.complaints.side) && (
                                    <>
                                      <TableCell className="w-1/4">{muscle.leftGrade ? `${muscle.leftGrade} out of 5` : '[X] out of 5'}</TableCell>
                                      <TableCell className="w-1/4">{muscle.rightGrade ? `${muscle.rightGrade} out of 5` : '[X] out of 5'}</TableCell>
                                    </>
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </div>
                  );
                }
                
                // Hand grip strength for hand region
                if (findings.complaints.location === 'hand') {
                  if (findings.objectiveFindings.handGripNotTested) {
                    // Hand grip not tested case
                    const sideText = findings.complaints.side === 'bilateral' ? 'bilateral' : findings.complaints.side || '[side]';
                    elements.push(<p key={`handgrip-not-tested-${counter}`}>{counter++}. The handgrip of {pronouns.his.toLowerCase()} {sideText} hand was not tested.</p>);
                  } else {
                    // Hand grip tested case
                    const grip = findings.objectiveFindings.handGripStrength;
                    const hasHandGrip = grip?.leftHandGrip || grip?.rightHandGrip;
                    const hasPinchData = grip?.leftPinchGrip || grip?.rightPinchGrip || grip?.leftLateralPinch || grip?.rightLateralPinch;
                    
                    // Only show formatted text if ONLY hand grip data exists (no pinch/lateral pinch)
                    if (hasHandGrip && !hasPinchData) {
                      const leftGrip = grip?.leftHandGrip;
                      const rightGrip = grip?.rightHandGrip;
                      
                      // Check if only one side has data
                      if (leftGrip && !rightGrip) {
                        // Only left hand has data
                        elements.push(<p key={`handgrip-${counter}`}>{counter++}. Hand grip strength of {pronouns.his.toLowerCase()} left hand was {leftGrip} kgf.</p>);
                      } else if (rightGrip && !leftGrip) {
                        // Only right hand has data
                        elements.push(<p key={`handgrip-${counter}`}>{counter++}. Hand grip strength of {pronouns.his.toLowerCase()} right hand was {rightGrip} kgf.</p>);
                      } else if (leftGrip && rightGrip) {
                        // Both sides have data
                        elements.push(<p key={`handgrip-${counter}`}>{counter++}. Hand grip strength of {pronouns.his.toLowerCase()} right hand and left hand was {rightGrip} kgf and {leftGrip} kgf respectively.</p>);
                      }
                    }
                  }
                }
                
                // Hand grip strength for wrist (separate from muscle power table)
                if (findings.complaints.location === 'wrist' && 
                    (findings.objectiveFindings.handGripStrength?.leftHandGrip || findings.objectiveFindings.handGripStrength?.rightHandGrip)) {
                  const leftGrip = findings.objectiveFindings.handGripStrength?.leftHandGrip;
                  const rightGrip = findings.objectiveFindings.handGripStrength?.rightHandGrip;
                  
                  // Check if only one side has data
                  if (leftGrip && !rightGrip) {
                    // Only left hand has data
                    elements.push(<p key={`handgrip-wrist-${counter}`}>{counter++}. Hand grip strength of {pronouns.his.toLowerCase()} left hand was {leftGrip} kgf.</p>);
                  } else if (rightGrip && !leftGrip) {
                    // Only right hand has data
                    elements.push(<p key={`handgrip-wrist-${counter}`}>{counter++}. Hand grip strength of {pronouns.his.toLowerCase()} right hand was {rightGrip} kgf.</p>);
                  } else if (leftGrip && rightGrip) {
                    // Both sides have data
                    elements.push(<p key={`handgrip-wrist-${counter}`}>{counter++}. Hand grip strength of {pronouns.his.toLowerCase()} right hand and left hand was {rightGrip} kg and {leftGrip} kg respectively.</p>);
                  }
                }
                
                // Splint/Brace/Cast finding
                if (findings.objectiveFindings.splintBraceCastInclude && findings.objectiveFindings.splintBraceCastType) {
                  const region = getRegionText();
                  elements.push(<p key={`splint-${counter}`}>{counter++}. {pronouns.his} {region} was on {findings.objectiveFindings.splintBraceCastType}.</p>);
                }
                
                // Additional findings
                if (findings.objectiveFindings.tendernessInclude && findings.objectiveFindings.tendernessArea) {
                  elements.push(<p key={`tenderness-${counter}`}>{counter++}. There was tenderness over {findings.objectiveFindings.tendernessArea}.</p>);
                }
                
                if (findings.objectiveFindings.swellingInclude || findings.objectiveFindings.temperatureInclude) {
                  let swellingTempText = '';
                  const region = getRegionText();
                  
                  // Only swelling reported and present
                  if (findings.objectiveFindings.swellingInclude && !findings.objectiveFindings.temperatureInclude && findings.objectiveFindings.swellingPresent) {
                    swellingTempText = `There was swelling over ${pronouns.his.toLowerCase()} ${region}.`;
                  }
                  // Only temperature reported and increased
                  else if (findings.objectiveFindings.temperatureInclude && !findings.objectiveFindings.swellingInclude && findings.objectiveFindings.temperatureIncreased) {
                    swellingTempText = `There was increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
                  }
                  // Both reported - both present
                  else if (findings.objectiveFindings.swellingInclude && findings.objectiveFindings.temperatureInclude && findings.objectiveFindings.swellingPresent && findings.objectiveFindings.temperatureIncreased) {
                    swellingTempText = `There was swelling and increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
                  }
                  // Both reported - swelling absent, temperature increased
                  else if (findings.objectiveFindings.swellingInclude && findings.objectiveFindings.temperatureInclude && !findings.objectiveFindings.swellingPresent && findings.objectiveFindings.temperatureIncreased) {
                    swellingTempText = `There was no swelling but increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
                  }
                  // Both reported - swelling present, temperature normal
                  else if (findings.objectiveFindings.swellingInclude && findings.objectiveFindings.temperatureInclude && findings.objectiveFindings.swellingPresent && !findings.objectiveFindings.temperatureIncreased) {
                    swellingTempText = `There was swelling but no increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
                  }
                  // Both reported - both absent
                  else if (findings.objectiveFindings.swellingInclude && findings.objectiveFindings.temperatureInclude && !findings.objectiveFindings.swellingPresent && !findings.objectiveFindings.temperatureIncreased) {
                    swellingTempText = `There was no swelling and no increase in temperature over ${pronouns.his.toLowerCase()} ${region}.`;
                  }
                  
                  if (swellingTempText) {
                    elements.push(<p key={`swelling-${counter}`}>{counter++}. {swellingTempText}</p>);
                  }
                }
                
                // Sensation and Reflex
                const isBackOrNeck = findings.complaints.location === 'back' || findings.complaints.location === 'neck';
                const hasSensationData = findings.objectiveFindings.sensationInclude;
                const hasReflexData = findings.objectiveFindings.reflexInclude;
                const shouldShowSensation = isBackOrNeck ? (hasSensationData || hasReflexData) : hasSensationData;
                
                if (shouldShowSensation) {
                  let sensationText = '';
                  if (hasSensationData) {
                    if (findings.objectiveFindings.sensationStatus === 'hypersensitive') {
                      sensationText = `hypersensitive over ${findings.objectiveFindings.areaHypersensitive || '[area]'}`;
                    } else if (findings.objectiveFindings.sensationStatus === 'intact') {
                      sensationText = 'intact';
                    } else if (findings.objectiveFindings.sensationStatus === 'reduced') {
                      sensationText = `reduced by ${findings.objectiveFindings.sensationReduction || '[X]%'} over ${findings.objectiveFindings.areaReduced || '[area]'}`;
                    }
                  } else if (isBackOrNeck) {
                    sensationText = '[intact/reduced by X% over area/hypersensitive over area]';
                  }
                  
                  let reflexText = '';
                  if (isBackOrNeck) {
                    if (hasReflexData) {
                      reflexText = findings.objectiveFindings.reflexNormal ? 'normal' : 'abnormal';
                    } else {
                      reflexText = '[normal/abnormal]';
                    }
                  }
                  
                  const fullText = isBackOrNeck 
                    ? `${pronouns.his} sensation was ${sensationText} and reflex was ${reflexText}`
                    : `${pronouns.his} sensation was ${sensationText}`;
                  
                  elements.push(<p key={`sensation-${counter}`}>{counter++}. {fullText}.</p>);
                }
                
                // Special Tests
                findings.objectiveFindings.specialTests.forEach((test, index) => {
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
                          // Capitalize first word when starting the sentence
                          text += `Straight leg raise of ${pronouns.his.toLowerCase()} ${sideText} leg was normal`;
                        }
                      }
                      
                      return text + '.';
                    };
                    
                    elements.push(<p key={`test-${counter}-${index}`}>{counter++}. {generateStraightLegRaiseText()}</p>);
                  } else if (test.testType === 'other' && test.testName && test.result) {
                    elements.push(<p key={`test-${counter}-${index}`}>{counter++}. {test.testName} was {test.result}.</p>);
                  }
                });
                
                // Gait
                // Generate gait text with WB status
                const generateGaitText = () => {
                  const walkingAid = findings.objectiveFindings.walkingAid || '[unaided/with aid]';
                  const walkingStability = findings.objectiveFindings.walkingStability || '[good/normal/acceptable/satisfactory/fair]';
                  const wbStatus = findings.objectiveFindings.wbStatusInclude && findings.objectiveFindings.wbStatus ? findings.objectiveFindings.wbStatus : '';
                  
                  if (wbStatus) {
                    if (walkingAid === 'unaided') {
                      return `${pronouns.he} could walk ${wbStatus} unaided with ${walkingStability} stability.`;
                    } else {
                      return `${pronouns.he} could walk ${wbStatus} with ${walkingAid} with ${walkingStability} stability.`;
                    }
                  } else {
                    if (walkingAid === 'unaided') {
                      return `${pronouns.he} could walk unaided with ${walkingStability} stability.`;
                    } else {
                      return `${pronouns.he} could walk with ${walkingAid} with ${walkingStability} stability.`;
                    }
                  }
                };
                elements.push(<p key={`gait-${counter}`}>{counter++}. {generateGaitText()}</p>);
                
                // Questionnaires
                findings.objectiveFindings.questionnaires.forEach((questionnaire, index) => {
                  if (questionnaire.name && questionnaire.score) {
                    elements.push(<p key={`questionnaire-${counter}-${index}`}>{counter++}. {getQuestionnaireScoring(questionnaire.name, questionnaire.score)}</p>);
                  }
                });
                
                return elements;
              })()}
            </div>
          </div>
          
          {/* Quick Navigation Tabs */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium mb-3 text-blue-800">Quick Navigation - Jump to Section:</h5>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onTabChange('initial');
                  // Scroll to top of the page after a short delay to allow tab change
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-white hover:bg-blue-100 border-blue-300 text-blue-700"
              >
                → Initial Clinical Findings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onTabChange('interim');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-white hover:bg-blue-100 border-blue-300 text-blue-700"
              >
                → Interim Clinical Findings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onTabChange('final');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-white hover:bg-blue-100 border-blue-300 text-blue-700"
              >
                → Final Clinical Findings
              </Button>
            </div>
            <p className="text-xs text-blue-600 mt-2">Click any button to switch tabs and scroll to the top of that section</p>
          </div>

      </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalFindingsComponent;