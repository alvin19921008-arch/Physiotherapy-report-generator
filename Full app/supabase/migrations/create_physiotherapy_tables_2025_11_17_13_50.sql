-- Create physiotherapy reports table
CREATE TABLE public.physiotherapy_reports_2025_11_17_13_50 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Section 1: Reference Information
    our_ref TEXT,
    your_ref TEXT,
    report_date DATE DEFAULT CURRENT_DATE,
    recipient TEXT,
    
    -- Section 2: Patient Information
    patient_name TEXT NOT NULL,
    patient_sex TEXT,
    patient_age INTEGER,
    hkid_no TEXT,
    physiotherapy_opd_no TEXT,
    
    -- Section 3: Diagnosis
    diagnosis TEXT,
    
    -- Section 4: Source of Referral
    referring_department TEXT,
    
    -- Section 5: Duration of Treatment
    total_sessions INTEGER,
    referral_info TEXT,
    registration_date DATE,
    treatment_period TEXT,
    case_therapists TEXT,
    report_writer TEXT,
    attended_sessions INTEGER,
    defaulted_sessions INTEGER,
    
    -- Section 6: Clinical Information (stored as JSONB for flexibility)
    initial_findings JSONB,
    interim_findings JSONB,
    final_findings JSONB,
    
    -- Section 7: Treatment
    treatment_methods TEXT[],
    
    -- Section 8: Discharge Summary
    discharge_summary JSONB,
    discharge_date DATE,
    
    -- Declaration
    consent_date DATE,
    
    -- Report status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
    
    -- User tracking (if authentication is added later)
    created_by UUID,
    updated_by UUID
);

-- Create RLS policies
ALTER TABLE public.physiotherapy_reports_2025_11_17_13_50 ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (can be restricted later with authentication)
CREATE POLICY "Allow all operations" ON public.physiotherapy_reports_2025_11_17_13_50
    FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_physiotherapy_reports_updated_at
    BEFORE UPDATE ON public.physiotherapy_reports_2025_11_17_13_50
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();