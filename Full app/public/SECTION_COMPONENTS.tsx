// Section Components - Copy these to src/components/sections/

// ===== src/components/sections/ReferenceInformation.tsx =====
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportData } from '@/types';

interface ReferenceInformationProps {
  reportData: ReportData;
  updateReportData: (field: string, value: any) => void;
}

const ReferenceInformation: React.FC<ReferenceInformationProps> = ({
  reportData,
  updateReportData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Report Reference Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ourRef">Our Reference</Label>
            <div className="flex items-center space-x-2">
              <span>(</span>
              <Input
                id="ourRef"
                value={reportData.ourRef}
                onChange={(e) => updateReportData('ourRef', e.target.value)}
                placeholder="Enter reference"
              />
              <span>) in PHY/OA/</span>
              <Input
                id="ourRef2"
                value={reportData.ourRef2}
                onChange={(e) => updateReportData('ourRef2', e.target.value)}
                placeholder="Additional ref"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yourRef">Your Reference</Label>
            <Input
              id="yourRef"
              value={reportData.yourRef}
              onChange={(e) => updateReportData('yourRef', e.target.value)}
              placeholder="Your reference"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yourRefDate">Your Reference Date</Label>
            <Input
              id="yourRefDate"
              type="date"
              value={reportData.yourRefDate}
              onChange={(e) => updateReportData('yourRefDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportDate">Report Date</Label>
            <Input
              id="reportDate"
              type="date"
              value={reportData.reportDate}
              onChange={(e) => updateReportData('reportDate', e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={reportData.recipient}
              onChange={(e) => updateReportData('recipient', e.target.value)}
              placeholder="Report recipient"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferenceInformation;

// ===== src/components/sections/PatientInformation.tsx =====
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportData } from '@/types';

interface PatientInformationProps {
  reportData: ReportData;
  updateReportData: (field: string, value: any) => void;
}

const PatientInformation: React.FC<PatientInformationProps> = ({
  reportData,
  updateReportData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={reportData.patientName}
              onChange={(e) => updateReportData('patientName', e.target.value)}
              placeholder="Enter patient name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientSex">Sex</Label>
            <Select
              value={reportData.patientSex}
              onValueChange={(value) => updateReportData('patientSex', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientAge">Age</Label>
            <Input
              id="patientAge"
              value={reportData.patientAge}
              onChange={(e) => updateReportData('patientAge', e.target.value)}
              placeholder="Enter age"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hkidNo">HKID No.</Label>
            <Input
              id="hkidNo"
              value={reportData.hkidNo}
              onChange={(e) => updateReportData('hkidNo', e.target.value)}
              placeholder="Enter HKID number"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="physiotherapyOpdNo">Physiotherapy OPD No.</Label>
            <Input
              id="physiotherapyOpdNo"
              value={reportData.physiotherapyOpdNo}
              onChange={(e) => updateReportData('physiotherapyOpdNo', e.target.value)}
              placeholder="Enter OPD number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInformation;

// ===== src/components/sections/Diagnosis.tsx =====
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportData } from '@/types';

interface DiagnosisProps {
  reportData: ReportData;
  updateReportData: (field: string, value: any) => void;
}

const Diagnosis: React.FC<DiagnosisProps> = ({
  reportData,
  updateReportData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="diagnosis">Primary Diagnosis</Label>
          <Input
            id="diagnosis"
            value={reportData.diagnosis}
            onChange={(e) => updateReportData('diagnosis', e.target.value)}
            placeholder="Enter primary diagnosis"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Diagnosis;

// ===== src/components/LiteDataImport.tsx =====
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LiteDataImportProps {
  onImport: (data: any) => void;
  onClose: () => void;
}

const LiteDataImport: React.FC<LiteDataImportProps> = ({ onImport, onClose }) => {
  const [importData, setImportData] = useState('');

  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importData);
      onImport(parsedData);
      onClose();
    } catch (error) {
      alert('Invalid JSON data. Please check your input.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Data from Lite App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="importData">Paste JSON data from lite app:</Label>
          <textarea
            id="importData"
            className="w-full h-40 p-3 border rounded-md"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste your JSON data here..."
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>
            Import Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiteDataImport;

// ===== Placeholder components for other sections =====

// src/components/sections/SourceOfReferral.tsx
export const SourceOfReferral = ({ reportData, updateReportData }: any) => (
  <Card>
    <CardHeader><CardTitle>Source of Referral</CardTitle></CardHeader>
    <CardContent>
      <p>Source of Referral component - implement based on your needs</p>
    </CardContent>
  </Card>
);

// src/components/sections/DurationOfTreatment.tsx
export const DurationOfTreatment = ({ reportData, updateReportData }: any) => (
  <Card>
    <CardHeader><CardTitle>Duration of Treatment</CardTitle></CardHeader>
    <CardContent>
      <p>Duration of Treatment component - implement based on your needs</p>
    </CardContent>
  </Card>
);

// src/components/sections/ClinicalInformation.tsx
export const ClinicalInformation = ({ reportData, updateClinicalFindings, copyInitialToFinalFindings, copyInitialToInterimFindings, includeInterim, setIncludeInterim }: any) => (
  <Card>
    <CardHeader><CardTitle>Clinical Information</CardTitle></CardHeader>
    <CardContent>
      <p>Clinical Information component - implement based on your needs</p>
    </CardContent>
  </Card>
);

// src/components/sections/TreatmentMethods.tsx
export const TreatmentMethods = ({ reportData, updateReportData }: any) => (
  <Card>
    <CardHeader><CardTitle>Treatment Methods</CardTitle></CardHeader>
    <CardContent>
      <p>Treatment Methods component - implement based on your needs</p>
    </CardContent>
  </Card>
);

// src/components/sections/Declaration.tsx
export const Declaration = ({ reportData, updateReportData }: any) => (
  <Card>
    <CardHeader><CardTitle>Declaration</CardTitle></CardHeader>
    <CardContent>
      <p>Declaration component - implement based on your needs</p>
    </CardContent>
  </Card>
);

// src/components/DischargeSummary.tsx
export const DischargeSummaryComponent = ({ reportData, updateDischargeSummary, updateDischargeSummaryData }: any) => (
  <Card>
    <CardHeader><CardTitle>Discharge Summary</CardTitle></CardHeader>
    <CardContent>
      <p>Discharge Summary component - implement based on your needs</p>
    </CardContent>
  </Card>
);

// src/components/FinalReportDraft.tsx
export const FinalReportDraft = ({ reportData, includeInterim }: any) => (
  <Card>
    <CardHeader><CardTitle>Final Report Draft</CardTitle></CardHeader>
    <CardContent>
      <p>Final Report Draft component - implement based on your needs</p>
    </CardContent>
  </Card>
);