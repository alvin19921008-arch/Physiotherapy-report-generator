import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_VERSION, BUILD_INFO, VERSION_HISTORY } from '@/config/version';
import { Calendar, GitBranch, Clock, Info } from 'lucide-react';

interface VersionDisplayProps {
  showDetails?: boolean;
  className?: string;
}

const VersionDisplay: React.FC<VersionDisplayProps> = ({ 
  showDetails = false, 
  className = "" 
}) => {
  if (!showDetails) {
    return (
      <Badge variant="outline" className={className}>
        {APP_VERSION.display}
      </Badge>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5" />
          Version Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Version */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Version:</span>
          <Badge variant="default" className="font-mono">
            {APP_VERSION.display}
          </Badge>
        </div>

        {/* Build Information */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Built:</span>
            <span className="font-mono text-xs">
              {new Date(BUILD_INFO.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Environment:</span>
            <Badge variant="secondary" className="text-xs">
              {BUILD_INFO.environment}
            </Badge>
          </div>
        </div>

        {/* Version History */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Updates
          </h4>
          <div className="space-y-2">
            {VERSION_HISTORY.slice(-3).reverse().map((version, index) => (
              <div key={version.version} className="text-xs">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={index === 0 ? "default" : "outline"} 
                    className="text-xs font-mono"
                  >
                    {version.version}
                  </Badge>
                  <span className="text-gray-500">{version.date}</span>
                </div>
                <p className="text-gray-600 mt-1 ml-1">
                  {version.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Legacy Format */}
        <div className="border-t pt-3 text-xs text-gray-500">
          <span>Legacy Format: </span>
          <code className="bg-gray-100 px-1 rounded">
            {APP_VERSION.legacy}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionDisplay;