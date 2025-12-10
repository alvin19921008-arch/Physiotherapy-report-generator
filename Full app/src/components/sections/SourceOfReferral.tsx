import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { ReportData } from '@/hooks/useReportData';

interface SourceOfReferralProps {
  reportData: ReportData;
  addReferralSource: () => void;
  removeReferralSource: (index: number) => void;
  updateReferralSource: (index: number, field: string, value: string) => void;
  getReferralPreview: any;
}

const SourceOfReferral: React.FC<SourceOfReferralProps> = ({
  reportData,
  addReferralSource,
  removeReferralSource,
  updateReferralSource,
  getReferralPreview
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 4: Source of Referral</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Referral Sources</Label>
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