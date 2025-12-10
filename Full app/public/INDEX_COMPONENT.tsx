// Main Index Page Component - Complete Source Code
// Copy this content to: src/pages/Index.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TestTube, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DischargeSummaryComponent from '@/components/DischargeSummary';
import FinalReportDraft from '@/components/FinalReportDraft';

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

// Lite Data Import
import LiteDataImport from '@/components/LiteDataImport';

const Index = () => {
  const { toast } = useToast();

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

  // State for interim findings
  const [includeInterim, setIncludeInterim] = useState(false);
  const [showLiteImport, setShowLiteImport] = useState(false);
  const [activeTab, setActiveTab] = useState('reference');

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
  const handleImportLiteData = useCallback((data: any) => {
    setReportData(data);
    setActiveTab('patient');
  }, [setReportData]);

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
              ></div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <Button
            onClick={() => setShowMockDataSelector(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TestTube className="w-4 h-4" />
            Fill Mock Data
          </Button>
          
          <Button
            onClick={() => setShowLiteImport(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Lite App Data
          </Button>
        </div>

        {/* Main tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-6">
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className={`text-xs ${tab.completed ? 'bg-green-100 text-green-800' : ''}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="reference">
            <ReferenceInformation 
              reportData={reportData} 
              updateReportData={updateReportData} 
            />
          </TabsContent>

          <TabsContent value="patient">
            <PatientInformation 
              reportData={reportData} 
              updateReportData={updateReportData} 
            />
          </TabsContent>

          <TabsContent value="diagnosis">
            <Diagnosis 
              reportData={reportData} 
              updateReportData={updateReportData} 
            />
          </TabsContent>

          <TabsContent value="referral">
            <SourceOfReferral 
              reportData={reportData} 
              updateReportData={updateReportData} 
            />
          </TabsContent>

          <TabsContent value="treatment">
            <DurationOfTreatment 
              reportData={reportData} 
              updateReportData={updateReportData} 
            />
          </TabsContent>

          <TabsContent value="clinical">
            <ClinicalInformation 
              reportData={reportData} 
              updateClinicalFindings={updateClinicalFindings}
              copyInitialToFinalFindings={copyInitialToFinalFindings}
              copyInitialToInterimFindings={copyInitialToInterimFindings}
              includeInterim={includeInterim}
              setIncludeInterim={setIncludeInterim}
            />
          </TabsContent>

          <TabsContent value="methods">
            <TreatmentMethods 
              reportData={reportData} 
              updateReportData={updateReportData} 
            />
          </TabsContent>

          <TabsContent value="discharge">
            <DischargeSummaryComponent 
              reportData={reportData} 
              updateDischargeSummary={updateDischargeSummary}
              updateDischargeSummaryData={updateDischargeSummaryData}
            />
          </TabsContent>

          <TabsContent value="declaration">
            <Declaration 
              reportData={reportData} 
              updateReportData={updateReportData} 
            />
          </TabsContent>

          <TabsContent value="final-draft">
            <FinalReportDraft 
              reportData={reportData}
              includeInterim={includeInterim}
            />
          </TabsContent>
        </Tabs>

        {/* Mock Data Selector Dialog */}
        <Dialog open={showMockDataSelector} onOpenChange={setShowMockDataSelector}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Mock Data Scenario</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              {mockDataScenarios.map((scenario) => (
                <Button
                  key={scenario.key}
                  onClick={() => {
                    handleFillMockData(scenario.key);
                    setShowMockDataSelector(false);
                  }}
                  variant="outline"
                  className={scenario.colorClass}
                >
                  {scenario.label}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Lite Data Import Dialog */}
        <Dialog open={showLiteImport} onOpenChange={setShowLiteImport}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import Data from Lite App</DialogTitle>
            </DialogHeader>
            <LiteDataImport 
              onImport={handleImportLiteData}
              onClose={() => setShowLiteImport(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;