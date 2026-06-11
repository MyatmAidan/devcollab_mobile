import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import axios from 'axios';
import {
  alertCircleOutline,
  attachOutline,
  briefcaseOutline,
  buildOutline,
  cashOutline,
  checkmarkCircleOutline,
  cloudUploadOutline,
  documentOutline,
  locationOutline,
  ribbonOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { applyToJob, getJob } from '../../api/jobApi';
import { getMyProfile, uploadProfileCv } from '../../api/profileApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { DeveloperProfile } from '../../types/developer';
import type { JobPosting } from '../../types/job';

const LEVEL_COLOR: Record<string, string> = {
  junior: 'success',
  mid: 'primary',
  senior: 'warning',
  lead: 'danger',
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

function formatSalary(job: JobPosting): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const currency = job.salary_currency ?? 'USD';
  if (job.salary_min && job.salary_max) {
    return `${currency} ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()} / month`;
  }
  if (job.salary_min) return `${currency} ${job.salary_min.toLocaleString()}+ / month`;
  return `Up to ${currency} ${job.salary_max?.toLocaleString()} / month`;
}

function extractErrors(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    if (data?.errors) return Object.values(data.errors).flat();
    if (data?.message) return [data.message];
  }
  if (error instanceof Error) return [error.message];
  return ['Something went wrong. Please try again.'];
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: 'var(--ion-color-dark)' }}>
    {children}
  </h3>
);

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [job, setJob] = useState<JobPosting | null>(null);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvName, setCvName] = useState<string | null>(null);
  const [applyErrors, setApplyErrors] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobData, profileData] = await Promise.all([
          getJob(id),
          getMyProfile(),
        ]);
        setJob(jobData);
        setProfile(profileData);
        if (profileData?.cv_original_name) {
          setCvName(profileData.cv_original_name);
        }
      } catch (err) {
        setLoadError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    setApplyErrors([]);
    try {
      const result = await uploadProfileCv(file);
      setCvName(result.cv_original_name);
      // update local profile state so the "already has CV" check is correct
      setProfile((prev) => prev ? { ...prev, cv_path: result.cv_path, cv_original_name: result.cv_original_name } : prev);
    } catch (err) {
      setApplyErrors([`CV upload failed: ${getErrorMessage(err)}`]);
    } finally {
      setUploadingCv(false);
      // reset input so re-selecting same file fires onChange again
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  const handleApply = async () => {
    if (!profile?.cv_path && !cvName) {
      setApplyErrors(['Please upload your CV before applying.']);
      return;
    }
    setSubmitting(true);
    setApplyErrors([]);
    try {
      await applyToJob(id, coverLetter || undefined);
      setApplied(true);
    } catch (err) {
      setApplyErrors(extractErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  const salary = job ? formatSalary(job) : null;
  const hasCv = !!cvName;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/jobs" text="Back" />
          </IonButtons>
          <IonTitle>Job Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? <LoadingSpinner /> : null}

        {loadError && !loading ? (
          <div className="ion-padding">
            <p style={{ color: 'var(--ion-color-danger)' }}>{loadError}</p>
          </div>
        ) : null}

        {job && !loading ? (
          <div style={{ paddingBottom: 32 }}>
            {/* Hero header card */}
            <IonCard style={{ margin: '16px 16px 0', borderRadius: 14 }}>
              <IonCardContent style={{ paddingBottom: 16 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {job.category ? (
                    <IonChip color="tertiary" style={{ margin: 0, height: 26, fontSize: 13 }}>
                      {job.category.name_en}
                    </IonChip>
                  ) : null}
                  {job.experience_level ? (
                    <IonBadge
                      color={LEVEL_COLOR[job.experience_level] ?? 'medium'}
                      style={{ textTransform: 'capitalize', borderRadius: 6, padding: '5px 10px', fontSize: 12 }}
                    >
                      {job.experience_level}
                    </IonBadge>
                  ) : null}
                </div>

                <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: 'var(--ion-color-dark)', lineHeight: 1.2 }}>
                  {job.title}
                </h1>
                <p style={{ margin: '0 0 14px', fontSize: 15, color: 'var(--ion-color-medium)' }}>
                  {job.company_profile?.company_name ?? 'Company'}
                  {job.company_profile?.industry ? (
                    <span style={{ color: 'var(--ion-color-medium-shade)' }}> · {job.company_profile.industry}</span>
                  ) : null}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ion-color-dark-shade)' }}>
                    <IonIcon icon={locationOutline} style={{ fontSize: 18, color: 'var(--ion-color-primary)' }} />
                    {job.location ?? 'Remote'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ion-color-dark-shade)' }}>
                    <IonIcon icon={briefcaseOutline} style={{ fontSize: 18, color: 'var(--ion-color-primary)' }} />
                    {EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}
                  </div>
                  {salary ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ion-color-success-shade)', fontWeight: 600 }}>
                      <IonIcon icon={cashOutline} style={{ fontSize: 18, color: 'var(--ion-color-success)' }} />
                      {salary}
                    </div>
                  ) : null}
                </div>
              </IonCardContent>
            </IonCard>

            {/* Description */}
            <IonCard style={{ margin: '12px 16px 0', borderRadius: 14 }}>
              <IonCardContent>
                <SectionTitle>
                  <IonIcon icon={buildOutline} style={{ marginRight: 6, verticalAlign: 'middle', fontSize: 16 }} />
                  Job Description
                </SectionTitle>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--ion-color-dark-shade)', whiteSpace: 'pre-line' }}>
                  {job.description}
                </p>
              </IonCardContent>
            </IonCard>

            {/* Requirements */}
            {job.requirements ? (
              <IonCard style={{ margin: '12px 16px 0', borderRadius: 14 }}>
                <IonCardContent>
                  <SectionTitle>
                    <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: 6, verticalAlign: 'middle', fontSize: 16 }} />
                    Requirements
                  </SectionTitle>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--ion-color-dark-shade)', whiteSpace: 'pre-line' }}>
                    {job.requirements}
                  </p>
                </IonCardContent>
              </IonCard>
            ) : null}

            {/* Apply form */}
            {!applied ? (
              <IonCard style={{ margin: '12px 16px 0', borderRadius: 14 }}>
                <IonCardContent>
                  <SectionTitle>
                    <IonIcon icon={ribbonOutline} style={{ marginRight: 6, verticalAlign: 'middle', fontSize: 16 }} />
                    Apply for this Position
                  </SectionTitle>

                  {/* Validation errors */}
                  {applyErrors.length > 0 ? (
                    <div
                      style={{
                        background: 'var(--ion-color-danger-tint)',
                        border: '1px solid var(--ion-color-danger)',
                        borderRadius: 10,
                        padding: '10px 14px',
                        marginBottom: 14,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <IonIcon icon={alertCircleOutline} style={{ fontSize: 18, color: 'var(--ion-color-danger)', flexShrink: 0, marginTop: 1 }} />
                        <div>
                          {applyErrors.length === 1 ? (
                            <span style={{ fontSize: 14, color: 'var(--ion-color-danger-shade)', fontWeight: 500 }}>
                              {applyErrors[0]}
                            </span>
                          ) : (
                            <>
                              <span style={{ fontSize: 14, color: 'var(--ion-color-danger-shade)', fontWeight: 600 }}>
                                Please fix the following:
                              </span>
                              <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 13, color: 'var(--ion-color-danger-shade)' }}>
                                {applyErrors.map((msg, i) => (
                                  <li key={i} style={{ marginBottom: 2 }}>{msg}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* CV upload */}
                  <div
                    style={{
                      border: `2px dashed ${hasCv ? 'var(--ion-color-success)' : 'var(--ion-color-medium)'}`,
                      borderRadius: 10,
                      padding: '14px 16px',
                      marginBottom: 14,
                      background: hasCv ? 'var(--ion-color-success-tint)' : 'var(--ion-color-light)',
                    }}
                  >
                    {/* Hidden file input */}
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={(e) => void handleCvChange(e)}
                    />

                    {hasCv ? (
                      /* CV already on file */
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <IonIcon icon={documentOutline} style={{ fontSize: 22, color: 'var(--ion-color-success)', flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--ion-color-success-shade)', fontWeight: 600 }}>CV attached</p>
                            <p style={{ margin: 0, fontSize: 13, color: 'var(--ion-color-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cvName}
                            </p>
                          </div>
                        </div>
                        <IonButton
                          fill="clear"
                          size="small"
                          color="medium"
                          disabled={uploadingCv}
                          onClick={() => cvInputRef.current?.click()}
                          style={{ flexShrink: 0 }}
                        >
                          {uploadingCv ? <IonSpinner name="crescent" style={{ width: 18, height: 18 }} /> : (
                            <>
                              <IonIcon icon={swapHorizontalOutline} slot="start" />
                              Replace
                            </>
                          )}
                        </IonButton>
                      </div>
                    ) : (
                      /* No CV yet — prompt upload */
                      <div style={{ textAlign: 'center' }}>
                        <IonIcon
                          icon={cloudUploadOutline}
                          style={{ fontSize: 36, color: 'var(--ion-color-medium)', marginBottom: 6 }}
                        />
                        <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'var(--ion-color-dark)' }}>
                          Upload your CV <span style={{ color: 'var(--ion-color-danger)' }}>*</span>
                        </p>
                        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--ion-color-medium)' }}>
                          PDF, DOC, or DOCX — required to apply
                        </p>
                        <IonButton
                          fill="outline"
                          size="small"
                          disabled={uploadingCv}
                          onClick={() => cvInputRef.current?.click()}
                        >
                          {uploadingCv ? (
                            <>
                              <IonSpinner name="crescent" style={{ width: 16, height: 16, marginRight: 6 }} />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <IonIcon icon={attachOutline} slot="start" />
                              Choose File
                            </>
                          )}
                        </IonButton>
                      </div>
                    )}
                  </div>

                  {/* Cover letter */}
                  <IonTextarea
                    label="Cover letter (optional)"
                    labelPlacement="stacked"
                    rows={4}
                    placeholder="Tell the company why you're a great fit..."
                    value={coverLetter}
                    onIonInput={(e) => setCoverLetter(e.detail.value ?? '')}
                    style={{ marginBottom: 12 }}
                  />

                  <IonButton
                    expand="block"
                    onClick={() => void handleApply()}
                    disabled={submitting || uploadingCv}
                    style={{ marginTop: 4 }}
                  >
                    {submitting ? (
                      <>
                        <IonSpinner name="crescent" style={{ width: 18, height: 18, marginRight: 8 }} />
                        Submitting...
                      </>
                    ) : 'Submit Application'}
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ) : (
              <IonCard style={{ margin: '12px 16px 0', borderRadius: 14, background: 'var(--ion-color-success-tint)' }}>
                <IonCardContent style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: 48, color: 'var(--ion-color-success)' }} />
                  <h3 style={{ margin: '10px 0 4px', color: 'var(--ion-color-success-shade)', fontWeight: 700 }}>
                    Application Submitted!
                  </h3>
                  <p style={{ margin: 0, color: 'var(--ion-color-medium)', fontSize: 14 }}>
                    The company will review your application and reach out.
                  </p>
                </IonCardContent>
              </IonCard>
            )}
          </div>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default JobDetailPage;
