import { useMemo } from 'react';
import { ReportData } from './useReportData';

// Memoized preview generation hooks
export const usePreviewGeneration = (reportData: ReportData) => {
  
  // Memoized reference preview
  const referencePreview = useMemo(() => {
    return {
      from: 'Physiotherapy Department Tuen Mun Hospital Hong Kong',
      to: `${reportData.recipient || '[Recipient]'}, through Health Information & Record Office, Tuen Mun Hospital`,
      ourRef: `(${reportData.ourRef || ' '}) in PHY/OA/${reportData.ourRef2 || ' '}`,
      yourRef: reportData.yourRef || '[Insert Your Reference]',
      tel: '3767 7455',
      reportDate: reportData.reportDate,
      yourRefDate: reportData.yourRefDate
    };
  }, [
    reportData.recipient,
    reportData.ourRef,
    reportData.ourRef2,
    reportData.yourRef,
    reportData.reportDate,
    reportData.yourRefDate
  ]);

  // Memoized patient preview
  const patientPreview = useMemo(() => {
    const pronounInfo = reportData.patientSex ? {
      pronoun: reportData.patientSex === 'Male' ? 'He/Mr.' : 
               reportData.patientSex === 'Female' ? 'She/Ms.' : 'He/She, Mr./Ms.',
      usage: `Throughout the report, this patient will be referred to as "${
        reportData.patientSex === 'Male' ? 'He/Mr.' : 
        reportData.patientSex === 'Female' ? 'She/Ms.' : 'He/She, Mr./Ms.'
      }"`
    } : null;

    return {
      name: reportData.patientName || '[Last Name, First Name Initials]',
      sexAge: reportData.patientSex && reportData.patientAge ? 
        `${reportData.patientSex} / ${reportData.patientAge}` : '[Insert Sex/Age]',
      hkid: reportData.hkidNo || '[Insert HKID No.]',
      opdNo: reportData.physiotherapyOpdNo || '[Insert PHYA No.]',
      pronounInfo
    };
  }, [
    reportData.patientName,
    reportData.patientSex,
    reportData.patientAge,
    reportData.hkidNo,
    reportData.physiotherapyOpdNo
  ]);

  // Memoized referral preview
  const referralPreview = useMemo(() => {
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

  // Memoized treatment duration preview
  const treatmentDurationPreview = useMemo(() => {
    const formatDateForPreview = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = date.getDate(); // Remove padStart to avoid leading zero
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    return {
      introText: `The above-named patient attended ${reportData.totalSessions || '[Insert Number of sessions]'} sessions of out-patient physiotherapy in the Tuen Mun Hospital as detailed in the following table:`,
      tableData: {
        registrationDate: formatDateForPreview(reportData.registrationDate) || '[Insert Date]',
        period: reportData.treatmentPeriodStart && reportData.treatmentPeriodEnd 
          ? `${formatDateForPreview(reportData.treatmentPeriodStart)} to ${formatDateForPreview(reportData.treatmentPeriodEnd)}`
          : reportData.treatmentPeriodStart 
          ? `${formatDateForPreview(reportData.treatmentPeriodStart)} to [End Date]`
          : '[Insert Period]',
        caseTherapists: reportData.caseTherapists || '[Insert Therapist(s)]',
        reportWriter: reportData.reportWriter || '[Insert Writer]',
        totalSessions: reportData.totalSessions || '[Insert Number]',
        attendedSessions: reportData.attendedSessions || '[Insert Number]',
        defaultedSessions: reportData.defaultedSessions || '[Insert Number]'
      }
    };
  }, [
    reportData.totalSessions,
    reportData.registrationDate,
    reportData.treatmentPeriodStart,
    reportData.treatmentPeriodEnd,
    reportData.caseTherapists,
    reportData.reportWriter,
    reportData.attendedSessions,
    reportData.defaultedSessions
  ]);

  // Memoized treatment methods preview
  const treatmentMethodsPreview = useMemo(() => {
    const items = [];
    
    reportData.treatments.forEach((treatment, index) => {
      const isExercise = treatment.method === 'Mobilization exercise' || treatment.method === 'Strengthening exercise';
      const text = isExercise 
        ? `${treatment.area} ${treatment.method.toLowerCase()}`
        : `${treatment.method.toLowerCase()} to ${treatment.area}`;
      items.push(`${index + 1}. ${text.charAt(0).toUpperCase() + text.slice(1)}.`);
    });

    if (reportData.otherTreatment) {
      items.push(`${reportData.treatments.length + 1}. ${reportData.otherTreatment}.`);
    }

    return items;
  }, [reportData.treatments, reportData.otherTreatment]);

  // Memoized declaration preview
  const declarationPreview = useMemo(() => {
    const formatDateForPreview = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = date.getDate(); // Remove padStart to avoid leading zero
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    return {
      consentText: `This medical report is prepared in response to the consent dated ${formatDateForPreview(reportData.consentDate) || '[Insert Consent Date]'}. This statement is true to the best of my knowledge and belief. Thank you for your attention.`,
      therapistInfo: {
        name: reportData.therapistDetails.name || '[Name of the therapist]',
        title: reportData.therapistDetails.title || '[Title of the therapist]',
        qualifications: reportData.therapistDetails.qualifications || '[Education Qualifications]'
      }
    };
  }, [
    reportData.consentDate,
    reportData.therapistDetails.name,
    reportData.therapistDetails.title,
    reportData.therapistDetails.qualifications
  ]);

  return {
    referencePreview,
    patientPreview,
    referralPreview,
    treatmentDurationPreview,
    treatmentMethodsPreview,
    declarationPreview
  };
};