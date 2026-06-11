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
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { extractErrors, getErrorMessage } from '../../api/axios';
import FormErrors from '../../components/FormErrors';
import { getCategories, getSkills } from '../../api/developerApi';
import { createProfile, getMyProfile } from '../../api/profileApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProfilePhotoInput from '../../components/ProfilePhotoInput';
import SkillPicker from '../../components/SkillPicker';
import type { ExperienceLevel, Skill, SkillCategory } from '../../types/developer';
import { sanitizeProfileInput } from '../../utils/profileForm';

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Principal' },
];

const CreateProfilePage: React.FC = () => {
  const history = useHistory();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [form, setForm] = useState({
    category_id: '' as string,
    profile_photo: '',
    headline: '',
    bio: '',
    experience_level: '' as ExperienceLevel | '',
    location: '',
    phone: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const existingProfile = await getMyProfile();
        if (existingProfile) {
          history.replace('/profile/edit');
          return;
        }

        const [skillsData, categoriesData] = await Promise.all([
          getSkills().finally(() => setSkillsLoading(false)),
          getCategories(),
        ]);
        setSkills(skillsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [history]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormErrors([]);
    setError(null);
    try {
      await createProfile(
        sanitizeProfileInput({
          ...form,
          category_id: form.category_id || null,
          experience_level: (form.experience_level as ExperienceLevel) || null,
          skill_ids: selectedSkillIds,
          is_public: true,
        }),
      );
      history.replace('/tabs/home');
    } catch (err) {
      setFormErrors(extractErrors(err, 'Failed to create profile.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/onboarding" text="Back" />
          </IonButtons>
          <IonTitle>Create Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? <LoadingSpinner /> : null}
        {error ? <FormErrors errors={[error]} style={{ margin: '12px 0' }} /> : null}
        {!loading ? (
          <form onSubmit={handleSubmit}>
            <ProfilePhotoInput
              value={form.profile_photo}
              onChange={(url) => setForm((prev) => ({ ...prev, profile_photo: url }))}
            />

            {/* Category (specialization) */}
            <IonItem>
              <IonLabel position="stacked">Specialization / Category</IonLabel>
              <IonSelect
                value={form.category_id}
                placeholder="Select your specialization"
                onIonChange={(e) => setForm((prev) => ({ ...prev, category_id: e.detail.value as string ?? '' }))}
              >
                <IonSelectOption value="">None</IonSelectOption>
                {categories.map((cat) => (
                  <IonSelectOption key={cat.id} value={cat.id}>
                    {cat.name_en}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {/* Experience Level */}
            <IonItem>
              <IonLabel position="stacked">Experience Level</IonLabel>
              <IonSelect
                value={form.experience_level}
                placeholder="Select experience level"
                onIonChange={(e) => setForm((prev) => ({ ...prev, experience_level: e.detail.value as ExperienceLevel ?? '' }))}
              >
                <IonSelectOption value="">None</IonSelectOption>
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <IonSelectOption key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {/* Text fields */}
            {(['headline', 'location', 'phone', 'github_url', 'linkedin_url', 'portfolio_url'] as const).map((field) => (
              <IonItem key={field}>
                <IonLabel position="stacked">{field.replace(/_/g, ' ')}</IonLabel>
                <IonInput
                  value={form[field]}
                  onIonInput={(e) => setForm((prev) => ({ ...prev, [field]: e.detail.value ?? '' }))}
                />
              </IonItem>
            ))}

            <IonItem>
              <IonLabel position="stacked">Bio / Goal</IonLabel>
              <IonTextarea
                value={form.bio}
                onIonInput={(e) => setForm((prev) => ({ ...prev, bio: e.detail.value ?? '' }))}
              />
            </IonItem>

            <SkillPicker
              skills={skills}
              selectedIds={selectedSkillIds}
              onChange={setSelectedSkillIds}
              loading={skillsLoading}
            />

            <FormErrors errors={formErrors} style={{ margin: '12px 0 4px' }} />

            <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Profile'}
            </IonButton>
          </form>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default CreateProfilePage;
