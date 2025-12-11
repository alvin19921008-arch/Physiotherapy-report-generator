import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Info } from 'lucide-react';
import { ReportData } from '@/hooks/useReportData';

interface SourceOfReferralProps {
  reportData: ReportData;
  addReferralSource: () => void;
  removeReferralSource: (index: number) => void;
  updateReferralSource: (index: number, field: string, value: string) => void;
  getReferralPreview: any;
}

// Clinic code reference data
const CLINIC_CODES = [
  { caseCode: 'GOKA', alternativeCode: 'KTG', fullName: 'Kam Tin Family Medicine Clinic' },
  { caseCode: 'GOTM', alternativeCode: 'TMG', fullName: 'Tuen Mun Family Medicine Clinic' },
  { caseCode: 'GOTW', alternativeCode: 'TSN', fullName: 'Tin Shui Wai (Tin Yip Road) Family Medicine Integrated Centre' },
  { caseCode: 'GOTS', alternativeCode: 'TSW', fullName: 'Tin Shui Wai (Tin Shui Road) Family Medicine Clinic' },
  { caseCode: 'GOWH', alternativeCode: 'WHC', fullName: 'Tuen Mun Wu Hong Family Medicine Clinic' },
  { caseCode: 'GOYL', alternativeCode: 'YLJ', fullName: 'Yuen Long Jockey Club Family Medicine Clinic' },
  { caseCode: 'GOYF', alternativeCode: 'YLY', fullName: 'Yuen Long Madam Yung Fung Shee Family Medicine Clinic' },
  { caseCode: 'GOYO', alternativeCode: 'YOC', fullName: 'Tuen Mun Yan Oi Family Medicine Clinic' }
];

const SourceOfReferral: React.FC<SourceOfReferralProps> = ({
  reportData,
  addReferralSource,
  removeReferralSource,
  updateReferralSource,
  getReferralPreview
}) => {
  const [showClinicCodes, setShowClinicCodes] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 4: Source of Referral</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Referral Sources</Label>
            <div className="flex items-center gap-2">
              <Dialog open={showClinicCodes} onOpenChange={setShowClinicCodes}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Clinic Codes
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Clinic Code Reference</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case Code</TableHead>
                          <TableHead>Alternative Code</TableHead>
                          <TableHead>Full Clinic Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {CLINIC_CODES.map((clinic, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono font-medium">{clinic.caseCode}</TableCell>
                            <TableCell className="font-mono">{clinic.alternativeCode}</TableCell>
                            <TableCell>{clinic.fullName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addReferralSource}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Referral
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            eg Department of Orthopedics and Traumatology, Tuen Mun Hospital or<br/>
            Wu Hong Clinic, the Hospital Authority
          </div>
          
          <div className="space-y-3">
            {reportData.referralSources.map((source, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium">{source.episode} Referral</h6>
                  {reportData.referralSources.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReferralSource(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`department-${index}`}>Department</Label>
                    <Input
                      id={`department-${index}`}
                      value={source.department}
                      onChange={(e) => updateReferralSource(index, 'department', e.target.value)}
                      placeholder="e.g., Department of Orthopedics and Traumatology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hospital-${index}`}>Hospital</Label>
                    <Input
                      id={`hospital-${index}`}
                      value={source.hospital}
                      onChange={(e) => updateReferralSource(index, 'hospital', e.target.value)}
                      placeholder="e.g., Tuen Mun Hospital"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h6 className="font-medium mb-2">Preview:</h6>
          {(() => {
            const preview = getReferralPreview;
            if (typeof preview === 'string') {
              return <p className="text-sm">{preview}</p>;
            } else if (preview && typeof preview === 'object') {
              return (
                <div className="space-y-2">
                  <p className="text-sm">{preview.text}</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referral</TableHead>
                        <TableHead>Department</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.table.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{row.referral}</TableCell>
                          <TableCell>{row.department}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            }
            return <p className="text-sm text-gray-500">No referral sources added yet.</p>;
          })()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceOfReferral;