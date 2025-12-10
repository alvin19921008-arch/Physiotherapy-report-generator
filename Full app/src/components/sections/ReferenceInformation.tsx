import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportData } from '@/hooks/useReportData';
import { useOptimizedFormHandlers } from '@/hooks/useOptimizedFormHandlers';

interface ReferenceInformationProps {
  reportData: ReportData;
  onUpdate: (updates: Partial<ReportData>) => void;
  formatDateForDisplay: (dateString: string) => string;
}

const ReferenceInformation: React.FC<ReferenceInformationProps> = memo(({
  reportData,
  onUpdate,
  formatDateForDisplay
}) => {
  const { createOptimizedInputHandler, createOptimizedDateHandler } = useOptimizedFormHandlers();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 1: Medical Report Reference Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ourRef">Our Reference</Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">(</span>
              <Input
                id="ourRef"
                value={reportData.ourRef}
                onChange={(e) => onUpdate({ ourRef: e.target.value })}
                placeholder="Enter reference number"
                className="w-32"
              />
              <span className="text-sm text-gray-600">) in PHY/OA/</span>
              <Input
                id="ourRef2"
                value={reportData.ourRef2}
                onChange={(e) => onUpdate({ ourRef2: e.target.value })}
                placeholder="Enter second part"
                className="w-32"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yourRef">Your Reference</Label>
            <Input
              id="yourRef"
              value={reportData.yourRef}
              onChange={(e) => onUpdate({ yourRef: e.target.value })}
              placeholder="Insert Your Reference"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportDate">Report Date</Label>
            <Input
              id="reportDate"
              type="date"
              value={reportData.reportDate}
              onChange={(e) => onUpdate({ reportDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yourRefDate">Your Reference Date</Label>
            <Input
              id="yourRefDate"
              type="date"
              value={reportData.yourRefDate}
              onChange={(e) => onUpdate({ yourRefDate: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={reportData.recipient}
              onChange={(e) => onUpdate({ recipient: e.target.value })}
              placeholder="Recipient name"
            />
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Report Header Preview:</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span><strong>From:</strong> Physiotherapy Department Tuen Mun Hospital Hong Kong</span>
              <span><strong>To:</strong> {reportData.recipient || '[Recipient]'}, through Health Information & Record Office, Tuen Mun Hospital</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Our Ref:</strong> ({reportData.ourRef || ' '}) in PHY/OA/{reportData.ourRef2 || ' '}</span>
              <span><strong>Your Ref:</strong> {reportData.yourRef || '[Insert Your Reference]'}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Tel:</strong> 3767 7455</span>
              <span></span>
            </div>
            <div className="flex justify-between">
              <span><strong>Dated:</strong> {formatDateForDisplay(reportData.reportDate)}</span>
              <span><strong>Dated:</strong> {formatDateForDisplay(reportData.yourRefDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default ReferenceInformation;