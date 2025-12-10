import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReportData } from '@/hooks/useReportData';

interface DeclarationProps {
  reportData: ReportData;
  onUpdateNested: (section: string, field: string, value: any) => void;
  onUpdate: (updates: Partial<ReportData>) => void;
  formatDateForDisplay: (dateString: string) => string;
}

const Declaration: React.FC<DeclarationProps> = ({
  reportData,
  onUpdateNested,
  onUpdate,
  formatDateForDisplay
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 9: Declaration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Consent Information</h4>
          <div className="space-y-2">
            <Label htmlFor="consentDate">Consent Date for Declaration</Label>
            <Input
              id="consentDate"
              type="date"
              value={reportData.consentDate}
              onChange={(e) => onUpdate({ consentDate: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Therapist Details</h4>
          
          <div className="space-y-2">
            <Label htmlFor="therapistName">Name</Label>
            <Input
              id="therapistName"
              value={reportData.therapistDetails.name}
              onChange={(e) => onUpdateNested('therapistDetails', 'name', e.target.value)}
              placeholder="Full name of the therapist"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="therapistTitle">Title</Label>
            <Input
              id="therapistTitle"
              value={reportData.therapistDetails.title}
              onChange={(e) => onUpdateNested('therapistDetails', 'title', e.target.value)}
              placeholder="e.g., Senior Physiotherapist, Principal Physiotherapist"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="therapistQualifications">Education Qualifications</Label>
            <Textarea
              id="therapistQualifications"
              value={reportData.therapistDetails.qualifications}
              onChange={(e) => onUpdateNested('therapistDetails', 'qualifications', e.target.value)}
              placeholder="e.g., BSc (Hons) Physiotherapy&#10;MSc Physiotherapy"
              rows={3}
            />
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">Declaration Preview:</h4>
          <div className="text-sm space-y-4">
            <p>
              This medical report is prepared in response to the consent dated {formatDateForDisplay(reportData.consentDate) || '[Insert Consent Date]'}. This statement is true to the best of my knowledge and belief. Thank you for your attention.
            </p>
            
            <div className="mt-6 space-y-2">
              <div className="border-b border-gray-400 w-64 mb-2">
                <span className="text-xs text-gray-500">Signature</span>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">{reportData.therapistDetails.name || '[Name of the therapist]'}</p>
                <p>{reportData.therapistDetails.title || '[Title of the therapist]'}</p>
                <div style={{ whiteSpace: 'pre-line' }}>{reportData.therapistDetails.qualifications || '[Education Qualifications]'}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Declaration;