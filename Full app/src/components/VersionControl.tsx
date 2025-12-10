import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, RotateCcw, Zap, Info } from 'lucide-react';
import { APP_VERSION } from '@/config/version';
import VersionDisplay from '@/components/VersionDisplay';

interface VersionControlProps {
  children: React.ReactNode;
}

const VersionControl: React.FC<VersionControlProps> = ({ children }) => {
  const [useOptimizedVersion, setUseOptimizedVersion] = useState(true);
  const [showVersionPanel, setShowVersionPanel] = useState(false);

  const handleVersionToggle = () => {
    setUseOptimizedVersion(!useOptimizedVersion);
    // Clear any caches when switching versions
    if (typeof window !== 'undefined') {
      // Clear performance caches
      const { clearCaches } = require('@/utils/performance');
      clearCaches();
    }
  };

  const handleForceReload = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Version Control Panel */}
      {showVersionPanel && (
        <Card className="fixed top-4 right-4 z-50 w-80 shadow-lg border-2 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Version Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">App Version:</span>
              <Badge variant="default">
                {APP_VERSION.display}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Performance Mode:</span>
              <Badge variant={useOptimizedVersion ? "default" : "secondary"}>
                {useOptimizedVersion ? (
                  <>
                    <Zap className="h-3 w-3 mr-1" />
                    Optimized
                  </>
                ) : (
                  'Legacy'
                )}
              </Badge>
            </div>
            
            <div className="text-xs text-gray-600">
              {useOptimizedVersion ? (
                'Using performance-optimized version with memoization and code splitting.'
              ) : (
                'Using stable legacy version. Switch back if experiencing issues.'
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleVersionToggle}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Switch Version
              </Button>
              <Button
                onClick={handleForceReload}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Reload
              </Button>
            </div>
            
            <div className="border-t pt-3">
              <Button
                onClick={() => setShowVersionPanel(false)}
                variant="ghost"
                size="sm"
                className="w-full mb-2"
              >
                <Info className="h-3 w-3 mr-1" />
                Version Details
              </Button>
              <VersionDisplay showDetails={true} />
            </div>
            
            <Button
              onClick={() => setShowVersionPanel(false)}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Version Toggle Button */}
      <Button
        onClick={() => setShowVersionPanel(!showVersionPanel)}
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 z-40 bg-white shadow-md border"
        title="Version Control"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Render children based on version */}
      {children}
    </>
  );
};

export default VersionControl;