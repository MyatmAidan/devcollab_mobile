import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  createCompanyJob,
  getCompanyCategories,
  getCompanyJob,
  updateCompanyJob,
} from '../../api/companyApi';
import { extractErrors } from '../../api/axios';
import FormErrors from '../../components/FormErrors';
import type { CompanyJob, CompanyJobPayload, JobCategory } from '../../types/company';

const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
] as const;

const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
] as const;

const JOB_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
] as const;

const CompanyJobFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const isEdit = !!id;

  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [form, setForm] = useState<CompanyJobPayload>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary_range: '',
    employment_type: 'full_time',
    experience_level: undefined,
    status: 'draft',
    category_id: undefined,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, jobData] = await Promise.all([
        getCompanyCategories(),
        isEdit ? getCompanyJob(id) : Promise.resolve(null as CompanyJob | null),
      ]);
      setCategories(cats);
      if (jobData) {
        setForm({
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.requirements ?? '',
          location: jobData.location ?? '',
          salary_range: jobData.salary_range ?? '',
          employment_type: jobData.employment_type,
          experience_level: jobData.experience_level ?? undefined,
          status: jobData.status,
          category_id: jobData.category_id ?? undefined,
        });
      }
    } catch {
      // ignore load errors
    } finally {
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => { void load(); }, [load]);

  const handleSave = async () => {
    setErrors([]);
    setSaving(true);
    try {
      if (isEdit) {
        await updateCompanyJob(id, form);
      } else {
        await createCompanyJob(form);
      }
      history.replace('/company/tabs/jobs');
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof CompanyJobPayload>(key: K, val: CompanyJobPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/company/tabs/jobs" />
          </IonButtons>
          <IonTitle>{isEdit ? 'Edit Job' : 'Post a Job'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} disabled={saving || loading} strong>
              {saving ? <IonSpinner name="crescent" /> : 'Save'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: '12px 4px' }}>
          <FormErrors errors={errors} />

          <IonItem>
            <IonLabel position="stacked">Job Title *</IonLabel>
            <IonInput
              value={form.title}
              onIonInput={(e) => set('title', e.detail.value ?? '')}
              placeholder="e.g. Senior React Developer"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Category</IonLabel>
            <IonSelect
              value={form.category_id}
              onIonChange={(e) => set('category_id', e.detail.value)}
              placeholder="Select category"
            >
              {categories.map((c) => (
                <IonSelectOption key={c.id} value={c.id}>{c.name_en}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Experience Level</IonLabel>
            <IonSelect
              value={form.experience_level}
              onIonChange={(e) => set('experience_level', e.detail.value)}
              placeholder="Select level"
            >
              {EXPERIENCE_LEVELS.map((l) => (
                <IonSelectOption key={l.value} value={l.value}>{l.label}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Employment Type *</IonLabel>
            <IonSelect
              value={form.employment_type}
              onIonChange={(e) => set('employment_type', e.detail.value)}
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <IonSelectOption key={t.value} value={t.value}>{t.label}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Status</IonLabel>
            <IonSelect
              value={form.status}
              onIonChange={(e) => set('status', e.detail.value)}
            >
              {JOB_STATUSES.map((s) => (
                <IonSelectOption key={s.value} value={s.value}>{s.label}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Location</IonLabel>
            <IonInput
              value={form.location}
              onIonInput={(e) => set('location', e.detail.value ?? '')}
              placeholder="e.g. Yangon, Remote"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Salary Range</IonLabel>
            <IonInput
              value={form.salary_range}
              onIonInput={(e) => set('salary_range', e.detail.value ?? '')}
              placeholder="e.g. $1,500 – $2,500/month"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Description *</IonLabel>
            <IonTextarea
              value={form.description}
              onIonInput={(e) => set('description', e.detail.value ?? '')}
              placeholder="Describe the role, responsibilities, etc."
              rows={5}
              autoGrow
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Requirements</IonLabel>
            <IonTextarea
              value={form.requirements}
              onIonInput={(e) => set('requirements', e.detail.value ?? '')}
              placeholder="List the skills and qualifications"
              rows={4}
              autoGrow
            />
          </IonItem>

          <div style={{ height: 32 }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CompanyJobFormPage;
