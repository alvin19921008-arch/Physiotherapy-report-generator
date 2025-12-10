import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ReportData } from '@/hooks/useReportData';
import { TREATMENT_CATEGORIES } from '@/hooks/useTreatmentMethods';

interface TreatmentMethodsProps {
  reportData: ReportData;
  treatmentOptions: string[];
  handleTreatmentMethodChange: (method: string, checked: boolean) => void;
  handleTreatmentAreaChange: (method: string, area: string) => void;
  handleOtherTreatmentChange: (value: string) => void;
  treatmentPreview: string[];
}

const TreatmentMethods: React.FC<TreatmentMethodsProps> = ({
  reportData,
  treatmentOptions,
  handleTreatmentMethodChange,
  handleTreatmentAreaChange,
  handleOtherTreatmentChange,
  treatmentPreview
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 7: Treatment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label>Select Treatment Methods Used:</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(TREATMENT_CATEGORIES).map(([category, methods]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-semibold text-sm text-blue-700 border-b border-blue-200 pb-1">
                  {category}
                </h4>
                <div className="space-y-2">
                  {methods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={method}
                        checked={reportData.treatments.some(t => t.method === method)}
                        onCheckedChange={(checked) => handleTreatmentMethodChange(method, checked as boolean)}
                      />
                      <Label htmlFor={method} className="text-sm font-normal cursor-pointer">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="otherTreatment">Other Treatment</Label>
            <Textarea
              id="otherTreatment"
              value={reportData.otherTreatment}
              onChange={(e) => handleOtherTreatmentChange(e.target.value)}
              placeholder="Other treatments"
              className="min-h-[80px]"
            />
          </div>
          
          {reportData.treatments.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Treatment Areas:</h4>
              <div className="space-y-3">
                {reportData.treatments.map((treatment, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{treatment.method}</Label>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={treatment.area}
                        onChange={(e) => handleTreatmentAreaChange(treatment.method, e.target.value)}
                        placeholder="Treatment area"
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(reportData.treatments.length > 0 || reportData.otherTreatment) && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Treatment Preview:</h5>
              <div className="text-sm space-y-1">
                {treatmentPreview.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentMethods;