import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClinicalFindingsComponent from '@/components/ClinicalFindings';
import { ReportData, ClinicalFindings } from '@/hooks/useReportData';

interface ClinicalInformationProps {
  reportData: ReportData;
  includeInterim: boolean;
  setIncludeInterim: (value: boolean) => void;
  clinicalTab: string;
  navigateToClinicalTab: (tab: string) => void;
  copyInitialToInterimFindings: () => void;
  copyInitialToFinalFindings: () => void;
  updateClinicalFindings: (type: 'initialFindings' | 'interimFindings' | 'finalFindings', findings: ClinicalFindings) => void;
  handleClinicalTabChange: (tab: string) => void;
}

const ClinicalInformation: React.FC<ClinicalInformationProps> = ({
  reportData,
  includeInterim,
  setIncludeInterim,
  clinicalTab,
  navigateToClinicalTab,
  copyInitialToInterimFindings,
  copyInitialToFinalFindings,
  updateClinicalFindings,
  handleClinicalTabChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 6: Clinical Information</CardTitle>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="includeInterim" 
            checked={includeInterim} 
            onCheckedChange={setIncludeInterim}
          />
          <Label htmlFor="includeInterim">Include Interim Clinical Findings</Label>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={clinicalTab} onValueChange={navigateToClinicalTab} className="w-full">
          <TabsList className={`grid w-full ${includeInterim ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="initial">Initial Findings</TabsTrigger>
            {includeInterim && <TabsTrigger value="interim">Interim Findings</TabsTrigger>}
            <TabsTrigger value="final">Final Findings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="initial">
            <ClinicalFindingsComponent
              findings={reportData.initialFindings}
              onChange={(findings) => updateClinicalFindings('initialFindings', findings)}
              title="Initial Clinical Findings"
              patientName={reportData.patientName}
              patientSex={reportData.patientSex}
              isInitial={true}
              onTabChange={handleClinicalTabChange}
            />
          </TabsContent>
          
          {includeInterim && (
            <TabsContent value="interim">
              <div className="mb-4">
                <Button 
                  onClick={copyInitialToInterimFindings}
                  variant="outline"
                  className="mb-4"
                >
                  📋 Copy from Initial Findings
                </Button>
                <p className="text-sm text-gray-600">Click to copy all data from Initial Clinical Findings, then modify as needed.</p>
              </div>
              <ClinicalFindingsComponent
                findings={reportData.interimFindings}
                onChange={(findings) => updateClinicalFindings('interimFindings', findings)}
                title="Interim Clinical Findings"
                patientName={reportData.patientName}
                patientSex={reportData.patientSex}
                initialDate={reportData.initialFindings.date}
                onTabChange={handleClinicalTabChange}
              />
            </TabsContent>
          )}
          
          <TabsContent value="final">
            <div className="mb-4">
              <Button 
                onClick={copyInitialToFinalFindings}
                variant="outline"
                className="mb-4"
              >
                📋 Copy from Initial Findings
              </Button>
              <p className="text-sm text-gray-600">Click to copy all data from Initial Clinical Findings, then modify as needed.</p>
            </div>
            <ClinicalFindingsComponent
              findings={reportData.finalFindings}
              onChange={(findings) => updateClinicalFindings('finalFindings', findings)}
              title="Final Clinical Findings"
              patientName={reportData.patientName}
              patientSex={reportData.patientSex}
              initialDate={reportData.initialFindings.date}
              onTabChange={handleClinicalTabChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClinicalInformation;