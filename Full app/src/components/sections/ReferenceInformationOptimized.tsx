import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportData } from '@/hooks/useReportData';
import { usePreviewGeneration } from '@/hooks/usePreviewGeneration';
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
  const { referencePreview } = usePreviewGeneration(reportData);
  const { createInputHandler, createDateHandler } = useOptimizedFormHandlers();

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
                onChange={createInputHandler((value) => onUpdate({ ourRef: value }), false)}
                placeholder="Enter reference number"
                className="w-32"
              />
              <span className="text-sm text-gray-600">) in PHY/OA/</span>
              <Input
                id="ourRef2"
                value={reportData.ourRef2}
                onChange={createInputHandler((value) => onUpdate({ ourRef2: value }), false)}
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
              onChange={createInputHandler((value) => onUpdate({ yourRef: value }))}
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
              onChange={createDateHandler((value) => onUpdate({ reportDate: value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yourRefDate">Your Reference Date</Label>
            <Input
              id="yourRefDate"
              type="date"
              value={reportData.yourRefDate}
              onChange={createDateHandler((value) => onUpdate({ yourRefDate: value }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={reportData.recipient}
              onChange={createInputHandler((value) => onUpdate({ recipient: value }))}
              placeholder="Recipient name"
            />
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Report Header Preview:</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span><strong>From:</strong> {referencePreview.from}</span>
              <span><strong>To:</strong> {referencePreview.to}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Our Ref:</strong> {referencePreview.ourRef}</span>
              <span><strong>Your Ref:</strong> {referencePreview.yourRef}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Tel:</strong> {referencePreview.tel}</span>
              <span></span>
            </div>
            <div className="flex justify-between">
              <span><strong>Dated:</strong> {formatDateForDisplay(referencePreview.reportDate)}</span>
              <span><strong>Dated:</strong> {formatDateForDisplay(referencePreview.yourRefDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ReferenceInformation.displayName = 'ReferenceInformation';

export default ReferenceInformation;