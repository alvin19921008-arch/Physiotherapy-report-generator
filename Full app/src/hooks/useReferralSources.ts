import { useCallback, useMemo } from 'react';
import { ReportData } from './useReportData';

export const useReferralSources = (reportData: ReportData, updateReportData: (updates: Partial<ReportData>) => void) => {
  const getNextEpisodeNumber = useCallback(() => {
    const episodes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
    return episodes[reportData.referralSources.length] || `${reportData.referralSources.length + 1}th`;
  }, [reportData.referralSources.length]);

  const addReferralSource = useCallback(() => {
    const nextEpisode = getNextEpisodeNumber();
    updateReportData({
      referralSources: [...reportData.referralSources, { episode: nextEpisode, department: '', hospital: '' }]
    });
  }, [reportData.referralSources, getNextEpisodeNumber, updateReportData]);

  const removeReferralSource = useCallback((index: number) => {
    updateReportData({
      referralSources: reportData.referralSources.filter((_, i) => i !== index)
    });
  }, [reportData.referralSources, updateReportData]);

  const updateReferralSource = useCallback((index: number, field: string, value: string) => {
    updateReportData({
      referralSources: reportData.referralSources.map((source, i) => 
        i === index ? { ...source, [field]: value } : source
      )
    });
  }, [reportData.referralSources, updateReportData]);

  const getReferralPreview = useMemo(() => {
    const validSources = reportData.referralSources.filter(source => source.department && source.hospital);
    
    if (validSources.length === 0) return '';
    
    if (validSources.length === 1) {
      return `The above-named patient was referred to our department for physiotherapy by the ${validSources[0].department}, ${validSources[0].hospital}.`;
    }
    
    // Group by department and hospital combination
    const grouped = validSources.reduce((acc, source) => {
      const key = `${source.department}, ${source.hospital}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(source.episode);
      return acc;
    }, {} as Record<string, string[]>);
    
    return {
      text: 'The above-named patient was referred to our department for physiotherapy by various departments as detailed in the following table.',
      table: Object.entries(grouped).map(([deptHospital, episodes]) => ({
        referral: episodes.length > 1 ? `${episodes.join(' & ')} referral` : `${episodes[0]} referral`,
        department: deptHospital
      }))
    };
  }, [reportData.referralSources]);

  return {
    addReferralSource,
    removeReferralSource,
    updateReferralSource,
    getReferralPreview
  };
};