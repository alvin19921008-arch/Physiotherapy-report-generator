import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TestTube, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DischargeSummaryComponent from '@/components/DischargeSummary';
import FinalReportDraft from '@/components/FinalReportDraft';
import ErrorBoundary from '@/components/ErrorBoundary';

// Section components
import ReferenceInformation from '@/components/sections/ReferenceInformation';
import PatientInformation from '@/components/sections/PatientInformation';
import Diagnosis from '@/components/sections/Diagnosis';
import SourceOfReferral from '@/components/sections/SourceOfReferral';
import DurationOfTreatment from '@/components/sections/DurationOfTreatment';
import ClinicalInformation from '@/components/sections/ClinicalInformation';
import TreatmentMethods from '@/components/sections/TreatmentMethods';
import Declaration from '@/components/sections/Declaration';

// Custom hooks
import { useReportData } from '@/hooks/useReportData';
import { useMockData } from '@/hooks/useMockData';
import { useReferralSources } from '@/hooks/useReferralSources';
import { useTreatmentMethods } from '@/hooks/useTreatmentMethods';
import { useFormHandlers } from '@/hooks/useFormHandlers';
import { useTabNavigation } from '@/hooks/useTabNavigation';

// Optimized hooks
import { useOptimizedTreatmentMethods } from '@/hooks/useOptimizedTreatmentMethods';
import { useOptimizedFormHandlers } from '@/hooks/useOptimizedFormHandlers';

// Performance utilities
import { measurePerformance } from '@/utils/performance';

// Lite Data Import
import LiteDataImport from '@/components/LiteDataImport';
import { getVersionInfo } from '@/utils/version';

const Index = () => {
  const { toast } = useToast();
  
  // Memoize version info to avoid recalculating on every render
  const versionInfo = useMemo(() => getVersionInfo(), []);
  const buildTimestamp = useMemo(() => {
    return new Date(versionInfo.build).toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, [versionInfo.build]);

  // Initialize custom hooks
  const {
    reportData,
    setReportData,
    updateReportData,
    updateNestedField,
    copyInitialToFinalFindings,
    copyInitialToInterimFindings,
    updateClinicalFindings,
    updateDischargeSummary,
    updateDischargeSummaryData
  } = useReportData();

  const { showMockDataSelector, setShowMockDataSelector, fillMockData } = useMockData();
  
  const { addReferralSource, removeReferralSource, updateReferralSource, getReferralPreview } = useReferralSources(reportData, updateReportData);
  
  // Use optimized versions for better performance
  const optimizedTreatmentMethods = useOptimizedTreatmentMethods(reportData, updateReportData);
  const fallbackTreatmentMethods = useTreatmentMethods(reportData, updateReportData);
  
  const optimizedFormHandlers = useOptimizedFormHandlers();
  const fallbackFormHandlers = useFormHandlers();
  
  // Choose between optimized and fallback versions
  const { treatmentOptions, handleTreatmentMethodChange, handleTreatmentAreaChange, handleOtherTreatmentChange, treatmentPreview } = optimizedTreatmentMethods;
  const { formatDateForDisplay } = optimizedFormHandlers;
  
  const { activeTab, clinicalTab, handleClinicalTabChange, navigateToTab, navigateToClinicalTab } = useTabNavigation();

  // State for interim findings
  const [includeInterim, setIncludeInterim] = useState(false);
  const [showLiteImport, setShowLiteImport] = useState(false);

  // Memoized completion status calculation
  const completionStatus = useMemo(() => {
    const sections = {
      reference: !!(reportData.ourRef && reportData.reportDate),
      patient: !!(reportData.patientName && reportData.patientSex && reportData.patientAge),
      diagnosis: !!reportData.diagnosis,
      referral: reportData.referralSources.some(r => r.department && r.hospital),
      treatment: !!reportData.totalSessions,
      clinical: !!(reportData.initialFindings.date && reportData.finalFindings.date),
      methods: reportData.treatments.length > 0,
      discharge: !!reportData.dischargeSummary?.summaryText?.length,
      declaration: !!reportData.therapistDetails.name
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
    reportData.ourRef,
    reportData.reportDate,
    reportData.patientName,
    reportData.patientSex,
    reportData.patientAge,
    reportData.diagnosis,
    reportData.referralSources,
    reportData.totalSessions,
    reportData.initialFindings.date,
    reportData.finalFindings.date,
    reportData.treatments.length,
    reportData.dischargeSummary?.summaryText?.length,
    reportData.therapistDetails.name
  ]);

  // Memoized mock data handler
  const handleFillMockData = useCallback((scenario: string) => {
    fillMockData(scenario, setReportData, setIncludeInterim);
  }, [fillMockData, setReportData]);

  // Lite data import handler
  const handleImportLiteData = useCallback((data: ReportData) => {
    setReportData(data);
    // Navigate to patient info tab after import
    navigateToTab('patient');
  }, [setReportData, navigateToTab]);

  // Memoized tab configuration
  const tabConfig = useMemo(() => [
    { value: 'reference', label: 'Report reference no.', completed: completionStatus.sections.reference },
    { value: 'patient', label: 'Patient info', completed: completionStatus.sections.patient },
    { value: 'diagnosis', label: 'Diagnosis', completed: completionStatus.sections.diagnosis },
    { value: 'referral', label: 'Source of referral', completed: completionStatus.sections.referral },
    { value: 'treatment', label: 'Treatment duration', completed: completionStatus.sections.treatment },
    { value: 'clinical', label: 'S/E, O/E', completed: completionStatus.sections.clinical },
    { value: 'methods', label: 'Treatment', completed: completionStatus.sections.methods },
    { value: 'discharge', label: 'Discharge', completed: completionStatus.sections.discharge },
    { value: 'declaration', label: 'Declaration & therapist info', completed: completionStatus.sections.declaration },
    { value: 'final-draft', label: 'Final Report Draft', completed: false }
  ], [completionStatus.sections]);

  // Memoized mock data scenarios
  const mockDataScenarios = useMemo(() => [
    { key: 'back', label: 'Back Pain', colorClass: 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800' },
    { key: 'shoulder', label: 'Shoulder Pain', colorClass: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800' },
    { key: 'ankle', label: 'Ankle Pain', colorClass: 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-800' },
    { key: 'hand', label: 'Hand Pain', colorClass: 'bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800' }
  ], []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Physiotherapy Medical Report Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Tuen Mun Hospital - Physiotherapy Department
          </p>
          
          {/* Progress indicator */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completionStatus.completed}/{completionStatus.total} sections</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionStatus.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Version Timestamp Log */}
        <div className="mb-2 flex justify-end">
          <div className="text-xs text-gray-400 font-mono">
            v{versionInfo.current} | {buildTimestamp}
          </div>
        </div>

        {/* Developer Tools Section */}
        <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Import Lite Data Button */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between h-full">
              <div>
                <h3 className="text-sm font-medium text-blue-800">Import Data</h3>
                <p className="text-xs text-blue-600 mt-1">Import data from Lite App to populate all sections</p>
              </div>
              <Button 
                onClick={() => setShowLiteImport(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800"
              >
                <Upload className="h-4 w-4" />
                Import Lite Data
              </Button>
            </div>
          </div>
          
          {/* Mock Data Button */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between h-full">
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Developer tools</h3>
                <p className="text-xs text-yellow-600 mt-1">Fill all sections with sample data for testing purposes</p>
              </div>
            {!showMockDataSelector ? (
              <Button 
                onClick={() => setShowMockDataSelector(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800"
              >
                <TestTube className="h-4 w-4" />
                Fill Mock Data
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  {mockDataScenarios.map((scenario) => (
                    <Button 
                      key={scenario.key}
                      onClick={() => handleFillMockData(scenario.key)}
                      variant="outline"
                      size="sm"
                      className={scenario.colorClass}
                    >
                      {scenario.label}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={() => setShowMockDataSelector(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={navigateToTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1">
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className={`h-auto min-h-[3rem] p-2 text-xs sm:text-sm lg:text-base whitespace-normal text-center leading-tight flex items-center justify-center relative ${
                  tab.completed ? 'bg-green-50 border-green-200 text-green-800' : ''
                }`}
              >
                <span className="break-words">{tab.label}</span>
                {tab.completed && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="reference" className="space-y-6">
            <ReferenceInformation
              reportData={reportData}
              onUpdate={updateReportData}
              formatDateForDisplay={formatDateForDisplay}
            />
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
            <PatientInformation
              reportData={reportData}
              onUpdate={updateReportData}
            />
          </TabsContent>

          <TabsContent value="diagnosis" className="space-y-6">
            <Diagnosis
              reportData={reportData}
              onUpdate={updateReportData}
            />
          </TabsContent>

          <TabsContent value="referral" className="space-y-6">
            <SourceOfReferral
              reportData={reportData}
              addReferralSource={addReferralSource}
              removeReferralSource={removeReferralSource}
              updateReferralSource={updateReferralSource}
              getReferralPreview={getReferralPreview}
            />
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <DurationOfTreatment
              reportData={reportData}
              onUpdate={updateReportData}
              formatDateForDisplay={formatDateForDisplay}
            />
          </TabsContent>

          <TabsContent value="clinical" className="space-y-6">
            <ClinicalInformation
              reportData={reportData}
              includeInterim={includeInterim}
              setIncludeInterim={setIncludeInterim}
              clinicalTab={clinicalTab}
              navigateToClinicalTab={navigateToClinicalTab}
              copyInitialToInterimFindings={copyInitialToInterimFindings}
              copyInitialToFinalFindings={copyInitialToFinalFindings}
              updateClinicalFindings={updateClinicalFindings}
              handleClinicalTabChange={handleClinicalTabChange}
            />
          </TabsContent>

          <TabsContent value="methods" className="space-y-6">
            <TreatmentMethods
              reportData={reportData}
              treatmentOptions={treatmentOptions}
              handleTreatmentMethodChange={handleTreatmentMethodChange}
              handleTreatmentAreaChange={handleTreatmentAreaChange}
              handleOtherTreatmentChange={handleOtherTreatmentChange}
              treatmentPreview={treatmentPreview}
            />
          </TabsContent>

          <TabsContent value="discharge" className="space-y-6">
            <DischargeSummaryComponent
              initialFindings={reportData.initialFindings}
              interimFindings={includeInterim ? reportData.interimFindings : undefined}
              finalFindings={reportData.finalFindings}
              patientName={reportData.patientName}
              patientSex={reportData.patientSex}
              dischargeSummaryData={reportData.dischargeSummary?.componentData}
              onSummaryChange={updateDischargeSummary}
              onDataChange={updateDischargeSummaryData}
            />
          </TabsContent>

          <TabsContent value="declaration" className="space-y-6">
            <Declaration
              reportData={reportData}
              onUpdateNested={updateNestedField}
              onUpdate={updateReportData}
              formatDateForDisplay={formatDateForDisplay}
            />
          </TabsContent>

          <TabsContent value="final-draft" className="space-y-6">
            <FinalReportDraft
              reportData={reportData}
              initialFindings={reportData.initialFindings}
              interimFindings={includeInterim ? reportData.interimFindings : undefined}
              finalFindings={reportData.finalFindings}
              dischargeSummary={reportData.dischargeSummary?.summaryText || []}
              dischargeSummaryData={reportData.dischargeSummary?.componentData}
            />
          </TabsContent>
        </Tabs>
        
        {/* Bottom Navigation Bar */}
        <div className="mt-8 border-t pt-4">
          <div className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1 bg-muted rounded-md">
            {tabConfig.map((tab) => (
              <Button
                key={`bottom-${tab.value}`}
                onClick={() => {
                  navigateToTab(tab.value);
                  // Scroll to top of content
                  setTimeout(() => {
                    const element = document.querySelector(`[data-state="active"][value="${tab.value}"]`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                variant={activeTab === tab.value ? "default" : "ghost"}
                size="sm"
                className={`h-auto min-h-[3rem] p-1 text-xs sm:text-sm lg:text-base whitespace-normal text-center leading-tight flex items-center justify-center relative border-0 rounded-sm ${
                  activeTab === tab.value 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                } ${
                  tab.completed ? 'bg-green-50 border-green-200 text-green-800' : ''
                }`}
              >
                <span className="break-words">{tab.label}</span>
                {tab.completed && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Lite Data Import Dialog */}
        <Dialog open={showLiteImport} onOpenChange={setShowLiteImport}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Lite App Data
              </DialogTitle>
            </DialogHeader>
            <LiteDataImport
              onImportData={(data) => {
                handleImportLiteData(data);
                setShowLiteImport(false);
              }}
              currentData={reportData}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Index;