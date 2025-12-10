import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportData } from '@/hooks/useReportData';
import { usePreviewGeneration } from '@/hooks/usePreviewGeneration';
import { useOptimizedFormHandlers } from '@/hooks/useOptimizedFormHandlers';

interface PatientInformationProps {
  reportData: ReportData;
  onUpdate: (updates: Partial<ReportData>) => void;
}

const PatientInformation: React.FC<PatientInformationProps> = memo(({
  reportData,
  onUpdate
}) => {
  const { patientPreview } = usePreviewGeneration(reportData);
  const { createInputHandler, createSelectHandler } = useOptimizedFormHandlers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 2: Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Name of Patient:</Label>
          <Input
            id="patientName"
            value={reportData.patientName}
            onChange={createInputHandler((value) => onUpdate({ patientName: value }))}
            placeholder="Last Name, First name as initials"
          />
          <p className="text-xs text-gray-500">e.g., CHAN Tai Man, input CHAN, T. M.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientSex">Sex</Label>
            <Select value={reportData.patientSex} onValueChange={createSelectHandler((value) => onUpdate({ patientSex: value }))}>
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
              type="number"
              value={reportData.patientAge}
              onChange={createInputHandler((value) => onUpdate({ patientAge: value }))}
              placeholder="Age"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hkidNo">HKID No.</Label>
            <Input
              id="hkidNo"
              value={reportData.hkidNo}
              onChange={createInputHandler((value) => onUpdate({ hkidNo: value }))}
              placeholder="HKID Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="physiotherapyOpdNo">Physiotherapy OPD No.</Label>
            <Input
              id="physiotherapyOpdNo"
              value={reportData.physiotherapyOpdNo}
              onChange={createInputHandler((value) => onUpdate({ physiotherapyOpdNo: value }))}
              placeholder="PHYA Number"
            />
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">Patient Information Preview:</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span><strong>Name of Patient:</strong> {patientPreview.name}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Sex / Age:</strong> {patientPreview.sexAge}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>HKID No.:</strong> {patientPreview.hkid}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Physiotherapy OPD No.:</strong> {patientPreview.opdNo}</span>
            </div>
            {patientPreview.pronounInfo && (
              <div className="mt-3 p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-800">
                  <strong>Pronoun Usage:</strong> {patientPreview.pronounInfo.usage}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PatientInformation.displayName = 'PatientInformation';

export default PatientInformation;