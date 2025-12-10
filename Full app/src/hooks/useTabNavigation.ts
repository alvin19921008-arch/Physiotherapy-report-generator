import { useState, useCallback } from 'react';

export const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState('reference');
  const [clinicalTab, setClinicalTab] = useState('initial');

  // Function to handle tab navigation from ClinicalFindings components
  const handleClinicalTabChange = useCallback((tab: string) => {
    // First switch to the clinical tab if not already there
    if (activeTab !== 'clinical') {
      setActiveTab('clinical');
    }
    // Then switch to the specific clinical findings tab
    setClinicalTab(tab);
  }, [activeTab]);

  const navigateToTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const navigateToClinicalTab = useCallback((tab: string) => {
    setClinicalTab(tab);
  }, []);

  return {
    activeTab,
    clinicalTab,
    setActiveTab,
    setClinicalTab,
    handleClinicalTabChange,
    navigateToTab,
    navigateToClinicalTab
  };
};