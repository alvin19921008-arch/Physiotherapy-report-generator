import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DischargeSummaryComponent from '@/components/DischargeSummary';
import FinalReportDraft from '@/components/FinalReportDraft';

// Optimized section components
import ReferenceInformationOptimized from '@/components/sections/ReferenceInformationOptimized';
import PatientInformationOptimized from '@/components/sections/PatientInformationOptimized';
import DiagnosisOptimized from '@/components/sections/DiagnosisOptimized';
import SourceOfReferral from '@/components/sections/SourceOfReferral';
import DurationOfTreatment from '@/components/sections/DurationOfTreatment';
import ClinicalInformation from '@/components/sections/ClinicalInformation';
import TreatmentMethods from '@/components/sections/TreatmentMethods';
import Declaration from '@/components/sections/Declaration';

// Optimized custom hooks
import { useOptimizedReportData } from '@/hooks/useOptimizedReportData';
import { useMockData } from '@/hooks/useMockData';
import { useReferralSources } from '@/hooks/useReferralSources';
import { useTreatmentMethods } from '@/hooks/useTreatmentMethods';
import { useOptimizedFormHandlers } from '@/hooks/useOptimizedFormHandlers';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import { useRenderTracker, usePerformanceTimer } from '@/hooks/usePerformanceMonitoring';

const IndexOptimized = () => {
  const { toast } = useToast();

  // Performance monitoring (development only)
  useRenderTracker('IndexOptimized');
  usePerformanceTimer('IndexOptimized');

  // Initialize optimized hooks
  const {
    reportData,
    setReportData,
    updateReportData,
    updateNestedField,
    copyInitialToFinalFindings,
    copyInitialToInterimFindings,
    updateClinicalFindings,
    updateDischargeSummary,
    updateDischargeSummaryData,
    patientData,
    referenceData,
    treatmentData,
    clinicalData,
    updatePatientData,
    updateReferenceData,
    updateTreatmentData,
    completionStatus
  } = useOptimizedReportData();

  const { showMockDataSelector, setShowMockDataSelector, fillMockData } = useMockData();
  
  const { addReferralSource, removeReferralSource, updateReferralSource, getReferralPreview } = useReferralSources(reportData, updateReportData);
  
  const { treatmentOptions, handleTreatmentMethodChange, handleTreatmentAreaChange, handleOtherTreatmentChange, treatmentPreview } = useTreatmentMethods(reportData, updateReportData);
  
  const { formatDateForDisplay } = useOptimizedFormHandlers();
  
  const { activeTab, clinicalTab, handleClinicalTabChange, navigateToTab, navigateToClinicalTab } = useTabNavigation();

  // State for interim findings
  const [includeInterim, setIncludeInterim] = useState(false);

  // Memoized mock data handler
  const handleFillMockData = useCallback((scenario: string) => {
    fillMockData(scenario, setReportData, setIncludeInterim);
  }, [fillMockData, setReportData, setIncludeInterim]);

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
    { key: 'back', label: 'Back Pain', color: 'blue' },
    { key: 'shoulder', label: 'Shoulder Pain', color: 'green' },
    { key: 'ankle', label: 'Ankle Pain', color: 'purple' },
    { key: 'hand', label: 'Hand Pain', color: 'orange' }
  ], []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Physiotherapy Medical Report Generator
          </h1>
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

        {/* Development Mock Data Button */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Development Tools</h3>
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
                      className={`bg-${scenario.color}-100 hover:bg-${scenario.color}-200 border-${scenario.color}-300 text-${scenario.color}-800`}
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
            <ReferenceInformationOptimized
              reportData={referenceData}
              onUpdate={updateReferenceData}
              formatDateForDisplay={formatDateForDisplay}
            />
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
            <PatientInformationOptimized
              reportData={patientData}
              onUpdate={updatePatientData}
            />
          </TabsContent>

          <TabsContent value="diagnosis" className="space-y-6">
            <DiagnosisOptimized
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
              reportData={treatmentData}
              onUpdate={updateTreatmentData}
              formatDateForDisplay={formatDateForDisplay}
            />
          </TabsContent>

          <TabsContent value="clinical" className="space-y-6">
            <ClinicalInformation
              reportData={clinicalData}
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
              initialFindings={clinicalData.initialFindings}
              interimFindings={includeInterim ? clinicalData.interimFindings : undefined}
              finalFindings={clinicalData.finalFindings}
              patientName={patientData.patientName}
              patientSex={patientData.patientSex}
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
              initialFindings={clinicalData.initialFindings}
              interimFindings={includeInterim ? clinicalData.interimFindings : undefined}
              finalFindings={clinicalData.finalFindings}
              dischargeSummary={reportData.dischargeSummary?.summaryText || []}
              dischargeSummaryData={reportData.dischargeSummary?.componentData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IndexOptimized;