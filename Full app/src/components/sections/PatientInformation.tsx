import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportData } from '@/hooks/useReportData';

interface PatientInformationProps {
  reportData: ReportData;
  onUpdate: (updates: Partial<ReportData>) => void;
}

const PatientInformation: React.FC<PatientInformationProps> = ({
  reportData,
  onUpdate
}) => {
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
            onChange={(e) => onUpdate({ patientName: e.target.value })}
            placeholder="Last Name, First name as initials"
          />
          <p className="text-xs text-gray-500">e.g., CHAN Tai Man, input CHAN, T. M.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientSex">Sex</Label>
            <Select value={reportData.patientSex} onValueChange={(value) => onUpdate({ patientSex: value })}>
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
              onChange={(e) => onUpdate({ patientAge: e.target.value })}
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
              onChange={(e) => onUpdate({ hkidNo: e.target.value })}
              placeholder="HKID Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="physiotherapyOpdNo">Physiotherapy OPD No.</Label>
            <Input
              id="physiotherapyOpdNo"
              value={reportData.physiotherapyOpdNo}
              onChange={(e) => onUpdate({ physiotherapyOpdNo: e.target.value })}
              placeholder="PHYA Number"
            />
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">Patient Information Preview:</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span><strong>Name of Patient:</strong> {reportData.patientName || '[Last Name, First Name Initials]'}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Sex / Age:</strong> {reportData.patientSex && reportData.patientAge ? `${reportData.patientSex} / ${reportData.patientAge}` : '[Insert Sex/Age]'}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>HKID No.:</strong> {reportData.hkidNo || '[Insert HKID No.]'}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Physiotherapy OPD No.:</strong> {reportData.physiotherapyOpdNo || '[Insert PHYA No.]'}</span>
            </div>
            {reportData.patientSex && (
              <div className="mt-3 p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-800">
                  <strong>Pronoun Usage:</strong> Throughout the report, this patient will be referred to as 
                  {reportData.patientSex === 'Male' ? ' "He/Mr."' : reportData.patientSex === 'Female' ? ' "She/Ms."' : ' "He/She, Mr./Ms."'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInformation;