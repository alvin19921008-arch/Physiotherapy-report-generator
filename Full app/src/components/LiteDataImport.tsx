import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Upload, FileText, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportData } from '@/hooks/useReportData';

interface LiteDataImportProps {
  onImportData: (data: ReportData) => void;
  currentData: ReportData;
}

interface LiteAppData {
  // Lite app data structure - matches the standalone HTML structure
  
  // Section 1: Reference Information
  ourRef?: string;
  ourRef2?: string;
  yourRef?: string;
  yourRefDate?: string;
  reportDate?: string;
  recipient?: string;
  
  // Section 2: Patient Information
  patientName: string;
  patientAge: string;
  patientSex: string;
  hkidNo: string;
  physiotherapyOpdNo: string;
  
  // Section 3: Diagnosis
  diagnosis: string;
  
  // Section 4: Referral Sources
  referralSources: Array<{ episode: string; department: string; hospital: string }>;
  
  // Section 5: Treatment Duration
  totalSessions: string;
  treatmentDetails: string;
  registrationDate: string;
  treatmentPeriodStart?: string;
  treatmentPeriodEnd?: string;
  startDate?: string; // Lite app field name
  endDate?: string; // Lite app field name
  caseTherapists: string;
  reportWriter?: string; // Full app field name
  reportWrittenBy?: string; // Lite app field name
  attendedSessions: string;
  defaultedSessions: string;
  
  // Section 6: Clinical Findings
  initialFindings: any;
  interimFindings?: any;
  finalFindings: any;
  
  // Section 7: Treatment Methods
  treatments: Array<{ method: string; area: string }>;
  otherTreatment: string;
  
  // Section 8: Discharge Summary
  dischargeSummary?: {
    painChange?: string;
    painIntensity?: string;
    symptomChange?: string;
    symptomIntensity?: string;
    activityImprovement?: { from?: string; to?: string };
    aromImprovement?: { region?: string; movement?: string; from?: string; to?: string };
    musclePowerImprovement?: { region?: string; muscleGroup?: string; from?: string; to?: string };
    overallImprovement?: string;
    dischargeDate?: string;
    componentData?: {
      dischargeType?: string;
      dischargeDate?: string;
      defaultDate?: string;
      cancellationDate?: string;
      appointmentDate?: string;
      scheduledAppointmentDate?: string;
      cancellationReason?: string;
    };
  };
  
  // Section 9: Declaration
  consentDate: string;
  declarationName?: string;
  declarationTitle?: string;
  educationQualifications?: string;
  therapistDetails?: {
    name: string;
    title: string;
    qualifications: string;
  };
}

const LiteDataImport: React.FC<LiteDataImportProps> = ({ onImportData, currentData }) => {
  const { toast } = useToast();
  const [importText, setImportText] = useState('');
  const [parsedData, setParsedData] = useState<LiteAppData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isBase64 = (str: string): boolean => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const parseImportData = useCallback((inputText: string): LiteAppData | null => {
    try {
      let jsonString = inputText.trim();
      
      // Check if it's Base64 encoded
      if (isBase64(jsonString)) {
        try {
          jsonString = atob(jsonString);
        } catch (error) {
          throw new Error('Invalid Base64 encoding');
        }
      }
      
      // Parse JSON
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      const errors: string[] = [];
      
      if (!data.patientName) errors.push('Patient name is required');
      if (!data.patientAge) errors.push('Patient age is required');
      if (!data.patientSex) errors.push('Patient sex is required');
      if (!data.diagnosis) errors.push('Diagnosis is required');
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        return null;
      }
      
      setValidationErrors([]);
      return data as LiteAppData;
    } catch (error) {
      setValidationErrors([`Invalid data format: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      return null;
    }
  }, []);

  const handleParseData = useCallback(() => {
    if (!importText.trim()) {
      toast({
        title: "No data provided",
        description: "Please paste the lite app data to import",
        variant: "destructive",
      });
      return;
    }

    const parsed = parseImportData(importText);
    if (parsed) {
      setParsedData(parsed);
      setShowPreview(true);
      toast({
        title: "Data parsed successfully",
        description: "Review the imported data before applying",
      });
    } else {
      toast({
        title: "Parse failed",
        description: "Unable to parse the provided data",
        variant: "destructive",
      });
    }
  }, [importText, parseImportData, toast]);

  // Helper function to map lite app discharge types to full app discharge types
  const mapDischargeType = (liteDischargeType: string): string => {
    const dischargeTypeMap: { [key: string]: string } = {
      'Discharged': 'completed',
      'Discharged with static progress': 'static',
      'Still receiving physiotherapy': 'ongoing',
      'Defaulted': 'defaulted',
      'Cancelled': 'cancelled'
    };
    return dischargeTypeMap[liteDischargeType] || liteDischargeType.toLowerCase();
  };

  // Helper function to map lite app episode format to full app format
  // Lite app: 'First', 'Second', 'Third', etc.
  // Full app: '1st', '2nd', '3rd', etc.
  const mapEpisodeFormat = (liteEpisode: string): string => {
    const episodeMap: { [key: string]: string } = {
      'First': '1st',
      'Second': '2nd',
      'Third': '3rd',
      'Fourth': '4th',
      'Fifth': '5th',
      'Sixth': '6th',
      'Seventh': '7th',
      'Eighth': '8th',
      'Ninth': '9th',
      'Tenth': '10th'
    };
    // If already in correct format or not mapped, return as is
    return episodeMap[liteEpisode] || liteEpisode;
  };

  const convertLiteDataToFullData = useCallback((liteData: LiteAppData): ReportData => {
    // Convert lite app data structure to full app data structure
    const fullData: ReportData = {
      // Section 1: Reference Information - import from lite app if available
      ourRef: liteData.ourRef || currentData.ourRef || '',
      ourRef2: liteData.ourRef2 || currentData.ourRef2 || '',
      yourRef: liteData.yourRef || currentData.yourRef || '',
      yourRefDate: liteData.yourRefDate || currentData.yourRefDate || '',
      reportDate: liteData.reportDate || currentData.reportDate || new Date().toISOString().split('T')[0],
      recipient: liteData.recipient || currentData.recipient || '',
      
      // Section 2: Patient Information - from lite app
      patientName: liteData.patientName || '',
      patientSex: liteData.patientSex || '',
      patientAge: liteData.patientAge || '',
      hkidNo: liteData.hkidNo || '',
      physiotherapyOpdNo: liteData.physiotherapyOpdNo || '',
      
      // Section 3: Diagnosis - from lite app
      diagnosis: liteData.diagnosis || '',
      
      // Section 4: Source of Referral - from lite app
      // Map episode format from Lite app ('First', 'Second', etc.) to Full app ('1st', '2nd', etc.)
      referralSources: (liteData.referralSources || []).map(source => ({
        ...source,
        episode: mapEpisodeFormat(source.episode)
      })),
      
      // Section 5: Duration of Treatment - from lite app
      totalSessions: liteData.totalSessions || '',
      referralInfo: liteData.treatmentDetails || '',
      registrationDate: liteData.registrationDate || '',
      // Map Lite app field names to Full app field names
      treatmentPeriodStart: liteData.treatmentPeriodStart || liteData.startDate || '',
      treatmentPeriodEnd: liteData.treatmentPeriodEnd || liteData.endDate || '',
      caseTherapists: liteData.caseTherapists || '',
      reportWriter: liteData.reportWriter || liteData.reportWrittenBy || '',
      attendedSessions: liteData.attendedSessions || '',
      defaultedSessions: liteData.defaultedSessions || '',
      
      // Section 6: Clinical Information - from lite app with field validation
      initialFindings: {
        ...currentData.initialFindings,
        ...liteData.initialFindings,
        complaints: {
          ...currentData.initialFindings?.complaints,
          ...liteData.initialFindings?.complaints,
          // Handle field name change: otherFunctionalActivities -> otherFunctionalLimitation
          otherFunctionalLimitation: liteData.initialFindings?.complaints?.otherFunctionalLimitation ?? 
                                   liteData.initialFindings?.complaints?.otherFunctionalActivities ?? 
                                   currentData.initialFindings?.complaints?.otherFunctionalLimitation ?? ''
        },
        objectiveFindings: {
          ...currentData.initialFindings?.objectiveFindings,
          ...liteData.initialFindings?.objectiveFindings,
          // Ensure splint/brace/cast fields exist
          splintBraceCastInclude: liteData.initialFindings?.objectiveFindings?.splintBraceCastInclude ?? currentData.initialFindings?.objectiveFindings?.splintBraceCastInclude ?? false,
          splintBraceCastType: liteData.initialFindings?.objectiveFindings?.splintBraceCastType ?? currentData.initialFindings?.objectiveFindings?.splintBraceCastType ?? ''
        }
      },
      interimFindings: {
        ...currentData.interimFindings,
        ...liteData.interimFindings,
        complaints: {
          ...currentData.interimFindings?.complaints,
          ...liteData.interimFindings?.complaints,
          // Handle field name change: otherFunctionalActivities -> otherFunctionalLimitation
          otherFunctionalLimitation: liteData.interimFindings?.complaints?.otherFunctionalLimitation ?? 
                                   liteData.interimFindings?.complaints?.otherFunctionalActivities ?? 
                                   currentData.interimFindings?.complaints?.otherFunctionalLimitation ?? ''
        },
        objectiveFindings: {
          ...currentData.interimFindings?.objectiveFindings,
          ...liteData.interimFindings?.objectiveFindings,
          // Ensure splint/brace/cast fields exist
          splintBraceCastInclude: liteData.interimFindings?.objectiveFindings?.splintBraceCastInclude ?? currentData.interimFindings?.objectiveFindings?.splintBraceCastInclude ?? false,
          splintBraceCastType: liteData.interimFindings?.objectiveFindings?.splintBraceCastType ?? currentData.interimFindings?.objectiveFindings?.splintBraceCastType ?? ''
        }
      },
      finalFindings: {
        ...currentData.finalFindings,
        ...liteData.finalFindings,
        complaints: {
          ...currentData.finalFindings?.complaints,
          ...liteData.finalFindings?.complaints,
          // Handle field name change: otherFunctionalActivities -> otherFunctionalLimitation
          otherFunctionalLimitation: liteData.finalFindings?.complaints?.otherFunctionalLimitation ?? 
                                   liteData.finalFindings?.complaints?.otherFunctionalActivities ?? 
                                   currentData.finalFindings?.complaints?.otherFunctionalLimitation ?? ''
        },
        objectiveFindings: {
          ...currentData.finalFindings?.objectiveFindings,
          ...liteData.finalFindings?.objectiveFindings,
          // Ensure splint/brace/cast fields exist
          splintBraceCastInclude: liteData.finalFindings?.objectiveFindings?.splintBraceCastInclude ?? currentData.finalFindings?.objectiveFindings?.splintBraceCastInclude ?? false,
          splintBraceCastType: liteData.finalFindings?.objectiveFindings?.splintBraceCastType ?? currentData.finalFindings?.objectiveFindings?.splintBraceCastType ?? ''
        }
      },
      
      // Section 7: Treatment - from lite app
      treatments: liteData.treatments || [],
      otherTreatment: liteData.otherTreatment || '',
      
      // Section 8: Discharge Summary - import from lite app if available
      dischargeSummary: {
        // Import basic discharge summary fields from lite app
        painChange: liteData.dischargeSummary?.painChange || currentData.dischargeSummary?.painChange || '',
        painIntensity: liteData.dischargeSummary?.painIntensity || currentData.dischargeSummary?.painIntensity || '',
        symptomChange: liteData.dischargeSummary?.symptomChange || currentData.dischargeSummary?.symptomChange || '',
        symptomIntensity: liteData.dischargeSummary?.symptomIntensity || currentData.dischargeSummary?.symptomIntensity || '',
        activityImprovement: {
          from: liteData.dischargeSummary?.activityImprovement?.from || currentData.dischargeSummary?.activityImprovement?.from || '',
          to: liteData.dischargeSummary?.activityImprovement?.to || currentData.dischargeSummary?.activityImprovement?.to || ''
        },
        aromImprovement: {
          region: liteData.dischargeSummary?.aromImprovement?.region || currentData.dischargeSummary?.aromImprovement?.region || '',
          movement: liteData.dischargeSummary?.aromImprovement?.movement || currentData.dischargeSummary?.aromImprovement?.movement || '',
          from: liteData.dischargeSummary?.aromImprovement?.from || currentData.dischargeSummary?.aromImprovement?.from || '',
          to: liteData.dischargeSummary?.aromImprovement?.to || currentData.dischargeSummary?.aromImprovement?.to || ''
        },
        musclePowerImprovement: {
          region: liteData.dischargeSummary?.musclePowerImprovement?.region || currentData.dischargeSummary?.musclePowerImprovement?.region || '',
          muscleGroup: liteData.dischargeSummary?.musclePowerImprovement?.muscleGroup || currentData.dischargeSummary?.musclePowerImprovement?.muscleGroup || '',
          from: liteData.dischargeSummary?.musclePowerImprovement?.from || currentData.dischargeSummary?.musclePowerImprovement?.from || '',
          to: liteData.dischargeSummary?.musclePowerImprovement?.to || currentData.dischargeSummary?.musclePowerImprovement?.to || ''
        },
        overallImprovement: liteData.dischargeSummary?.overallImprovement || currentData.dischargeSummary?.overallImprovement || '',
        dischargeDate: liteData.dischargeSummary?.dischargeDate || currentData.dischargeSummary?.dischargeDate || '',
        summaryText: currentData.dischargeSummary?.summaryText || [],
        // Import component data (discharge status, dates, etc.) from lite app
        componentData: {
          ...currentData.dischargeSummary?.componentData,
          // Import specific discharge status fields from lite app with proper field mapping
          dischargeType: liteData.dischargeSummary?.componentData?.dischargeType ? 
                        mapDischargeType(liteData.dischargeSummary.componentData.dischargeType) : 
                        currentData.dischargeSummary?.componentData?.dischargeType,
          // Map lite app fields to full app fields
          dischargeDate: liteData.dischargeSummary?.componentData?.dischargeDate || 
                        liteData.dischargeSummary?.componentData?.defaultDate || 
                        currentData.dischargeSummary?.componentData?.dischargeDate,
          cancellationDate: liteData.dischargeSummary?.componentData?.cancellationDate || currentData.dischargeSummary?.componentData?.cancellationDate,
          appointmentDate: liteData.dischargeSummary?.componentData?.scheduledAppointmentDate || 
                          liteData.dischargeSummary?.componentData?.appointmentDate || 
                          currentData.dischargeSummary?.componentData?.appointmentDate,
          cancellationReason: liteData.dischargeSummary?.componentData?.cancellationReason || currentData.dischargeSummary?.componentData?.cancellationReason
        }
      },
      
      // Section 9: Declaration - from lite app
      consentDate: liteData.consentDate || '',
      therapistDetails: {
        name: liteData.declarationName || liteData.therapistDetails?.name || '',
        title: liteData.declarationTitle || liteData.therapistDetails?.title || '',
        qualifications: liteData.educationQualifications || liteData.therapistDetails?.qualifications || ''
      }
    };

    return fullData;
  }, [currentData]);

  const handleImport = useCallback(() => {
    if (!parsedData) return;

    try {
      const fullData = convertLiteDataToFullData(parsedData);
      onImportData(fullData);
      
      toast({
        title: "Data imported successfully",
        description: "All lite app data has been restored to the full app",
      });
      
      // Reset state
      setImportText('');
      setParsedData(null);
      setShowPreview(false);
      setShowConfirmDialog(false);
    } catch (error) {
      toast({
        title: "Import failed",
        description: `Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  }, [parsedData, convertLiteDataToFullData, onImportData, toast]);

  const getDataSummary = (data: LiteAppData) => {
    const sections = {
      'Reference Info': !!(data.ourRef || data.yourRef || data.recipient),
      'Patient Info': !!(data.patientName && data.patientAge && data.patientSex),
      'Diagnosis': !!data.diagnosis,
      'Referral Sources': data.referralSources?.length > 0,
      'Treatment Duration': !!(data.totalSessions || data.registrationDate),
      'Clinical Findings': !!(data.initialFindings || data.finalFindings),
      'Treatment Methods': data.treatments?.length > 0,
      'Discharge Summary': !!(data.dischargeSummary?.componentData?.dischargeType || data.dischargeSummary?.dischargeDate),
      'Declaration': !!(data.declarationName || data.therapistDetails?.name)
    };

    const completed = Object.values(sections).filter(Boolean).length;
    const total = Object.keys(sections).length;

    return { sections, completed, total };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Lite App Data
        </CardTitle>
        <p className="text-sm text-gray-600">
          Paste JSON or Base64-encoded data from the Lite App to restore all field values in the Full App
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="import-data">Lite App Data</Label>
          <Textarea
            id="import-data"
            placeholder="Paste your lite app data here (JSON or Base64-encoded JSON)..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="min-h-32 font-mono text-sm"
          />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText className="h-3 w-3" />
            <span>Supports both raw JSON and Base64-encoded JSON formats</span>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <AlertCircle className="h-4 w-4" />
              Validation Errors
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleParseData}
            disabled={!importText.trim()}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Parse & Preview Data
          </Button>
          <Button
            onClick={() => setImportText('')}
            variant="outline"
            disabled={!importText.trim()}
          >
            Clear
          </Button>
        </div>

        {showPreview && parsedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <CheckCircle className="h-4 w-4" />
                Data Preview
              </div>
              <Button
                onClick={() => setShowConfirmDialog(true)}
                size="sm"
              >
                Import Data
              </Button>
            </div>
            
            {(() => {
              const summary = getDataSummary(parsedData);
              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Patient:</strong> {parsedData.patientName}</div>
                    <div><strong>Age/Sex:</strong> {parsedData.patientAge}, {parsedData.patientSex}</div>
                    <div><strong>Diagnosis:</strong> {parsedData.diagnosis}</div>
                    <div><strong>Sessions:</strong> {parsedData.totalSessions}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sections:</span>
                    <Badge variant="outline">
                      {summary.completed}/{summary.total} completed
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(summary.sections).map(([section, completed]) => (
                      <div key={section} className="flex items-center gap-1">
                        {completed ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400" />
                        )}
                        <span className={completed ? 'text-green-700' : 'text-gray-500'}>
                          {section}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Import Lite App Data</AlertDialogTitle>
              <AlertDialogDescription>
                This will replace all current data in the Full App with the data from the Lite App. 
                Are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleImport}>
                Import Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Export data from the Lite App (copy the JSON or Base64 string)</li>
            <li>2. Paste the data into the textarea above</li>
            <li>3. Click "Parse & Preview Data" to validate and preview</li>
            <li>4. Review the data summary and click "Import Data" to apply</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiteDataImport;