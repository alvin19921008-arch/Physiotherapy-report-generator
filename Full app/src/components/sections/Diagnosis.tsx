import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReportData } from '@/hooks/useReportData';

interface DiagnosisProps {
  reportData: ReportData;
  onUpdate: (updates: Partial<ReportData>) => void;
}

const Diagnosis: React.FC<DiagnosisProps> = ({
  reportData,
  onUpdate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 3: Diagnosis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Textarea
            id="diagnosis"
            value={reportData.diagnosis}
            onChange={(e) => onUpdate({ diagnosis: e.target.value })}
            placeholder="eg, low back pain / right shoulder fracture"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Diagnosis;