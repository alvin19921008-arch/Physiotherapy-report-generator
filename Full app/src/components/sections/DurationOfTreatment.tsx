import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportData } from '@/hooks/useReportData';

interface DurationOfTreatmentProps {
  reportData: ReportData;
  onUpdate: (updates: Partial<ReportData>) => void;
  formatDateForDisplay: (dateString: string) => string;
}

const DurationOfTreatment: React.FC<DurationOfTreatmentProps> = ({
  reportData,
  onUpdate,
  formatDateForDisplay
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 5: Duration of Treatment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="totalSessions">Total Number of Sessions</Label>
          <Input
            id="totalSessions"
            type="number"
            value={reportData.totalSessions}
            onChange={(e) => onUpdate({ totalSessions: e.target.value })}
            placeholder="Number of sessions"
          />
        </div>
        
        <Separator />
        
        <h4 className="font-semibold">Treatment Details Table</h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationDate">Date of Registration</Label>
            <Input
              id="registrationDate"
              type="date"
              value={reportData.registrationDate}
              onChange={(e) => onUpdate({ registrationDate: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h5 className="font-medium">Treatment Period</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="treatmentPeriodStart">Start Date</Label>
              <Input
                id="treatmentPeriodStart"
                type="date"
                value={reportData.treatmentPeriodStart}
                onChange={(e) => onUpdate({ treatmentPeriodStart: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatmentPeriodEnd">End Date</Label>
              <Input
                id="treatmentPeriodEnd"
                type="date"
                value={reportData.treatmentPeriodEnd}
                onChange={(e) => onUpdate({ treatmentPeriodEnd: e.target.value })}
                min={reportData.treatmentPeriodStart || undefined}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="caseTherapists">Case Therapist(s)</Label>
            <Input
              id="caseTherapists"
              value={reportData.caseTherapists}
              onChange={(e) => onUpdate({ caseTherapists: e.target.value })}
              placeholder="Therapist names"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportWriter">Report Written by</Label>
            <Input
              id="reportWriter"
              value={reportData.reportWriter}
              onChange={(e) => onUpdate({ reportWriter: e.target.value })}
              placeholder="Report writer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendedSessions">Attended Sessions</Label>
            <Input
              id="attendedSessions"
              type="number"
              value={reportData.attendedSessions}
              onChange={(e) => onUpdate({ attendedSessions: e.target.value })}
              placeholder="Number attended"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultedSessions">Defaulted Sessions</Label>
            <Input
              id="defaultedSessions"
              type="number"
              value={reportData.defaultedSessions}
              onChange={(e) => onUpdate({ defaultedSessions: e.target.value })}
              placeholder="Number defaulted"
            />
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Duration of Treatment Preview:</h4>
          <p className="text-sm mb-3">
            The above-named patient attended {reportData.totalSessions || '[Insert Number of sessions]'} sessions of out-patient physiotherapy in the Tuen Mun Hospital as detailed in the following table:
          </p>
          <h5 className="font-medium mb-2">Treatment Details Table:</h5>
          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[12%]">Date of Registration</TableHead>
                <TableHead className="w-[18%]">Period</TableHead>
                <TableHead className="w-[20%]">Case Therapist(s)</TableHead>
                <TableHead className="w-[20%]">Report Written by</TableHead>
                <TableHead className="w-[10%]">Number of total sessions</TableHead>
                <TableHead className="w-[10%]">Number of attended sessions</TableHead>
                <TableHead className="w-[10%]">Number of defaulted Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="w-[12%]">{formatDateForDisplay(reportData.registrationDate) || '[Insert Date]'}</TableCell>
                <TableCell className="w-[18%]">
                  {reportData.treatmentPeriodStart && reportData.treatmentPeriodEnd 
                    ? (
                        <div>
                          {formatDateForDisplay(reportData.treatmentPeriodStart)} to<br/>
                          {formatDateForDisplay(reportData.treatmentPeriodEnd)}
                        </div>
                      )
                    : reportData.treatmentPeriodStart 
                    ? `${formatDateForDisplay(reportData.treatmentPeriodStart)} to [End Date]`
                    : '[Insert Period]'
                  }
                </TableCell>
                <TableCell className="w-[20%]">{reportData.caseTherapists || '[Insert Therapist(s)]'}</TableCell>
                <TableCell className="w-[20%]">{reportData.reportWriter || '[Insert Writer]'}</TableCell>
                <TableCell className="w-[10%]">{reportData.totalSessions || '[Insert Number]'}</TableCell>
                <TableCell className="w-[10%]">{reportData.attendedSessions || '[Insert Number]'}</TableCell>
                <TableCell className="w-[10%]">{reportData.defaultedSessions || '[Insert Number]'}</TableCell>
              </TableRow>
            </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DurationOfTreatment;