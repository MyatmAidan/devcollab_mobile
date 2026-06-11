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
  IonToast,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../api/axios';
import { getCategories, getSkills } from '../../api/developerApi';
import { getMyProfile, updateProfile, uploadProfileCv } from '../../api/profileApi';
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

const EditProfilePage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    category_id: '' as string,
    profile_photo: '',
    headline: '',
    bio: '',
    experience_level: '' as ExperienceLevel | '',
    location: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    phone: '',
    cv_original_name: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, skillsData, categoriesData] = await Promise.all([
          getMyProfile(),
          getSkills().finally(() => setSkillsLoading(false)),
          getCategories(),
        ]);

        setSkills(skillsData);
        setCategories(categoriesData);

        if (!profile) {
          history.replace('/profile/create');
          return;
        }

        setForm({
          category_id: profile.category_id ?? '',
          profile_photo: profile.profile_photo ?? '',
          headline: profile.headline ?? '',
          bio: profile.bio ?? '',
          experience_level: profile.experience_level ?? '',
          location: profile.location ?? '',
          github_url: profile.github_url ?? '',
          linkedin_url: profile.linkedin_url ?? '',
          portfolio_url: profile.portfolio_url ?? '',
          phone: profile.phone ?? '',
          cv_original_name: profile.cv_original_name ?? '',
        });
        setSelectedSkillIds((profile.skills ?? []).map((skill) => skill.id));
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
    setError(null);
    try {
      await updateProfile(
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
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" text="Back" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? <LoadingSpinner /> : null}
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

            <IonItem>
              <IonLabel position="stacked">CV (PDF/DOC)</IonLabel>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  void uploadProfileCv(file)
                    .then((result) => setForm((prev) => ({ ...prev, cv_original_name: result.cv_original_name })))
                    .catch((err) => setError(getErrorMessage(err)));
                }}
              />
              {form.cv_original_name ? <p>{form.cv_original_name}</p> : null}
            </IonItem>

            <SkillPicker
              skills={skills}
              selectedIds={selectedSkillIds}
              onChange={setSelectedSkillIds}
              loading={skillsLoading}
            />

            <IonButton expand="block" type="submit" className="ion-margin-top" disabled={submitting}>
              {submitting ? 'Saving...' : 'Update Profile'}
            </IonButton>
          </form>
        ) : null}
        <IonToast isOpen={!!error} message={error ?? ''} duration={3000} color="danger" onDidDismiss={() => setError(null)} />
      </IonContent>
    </IonPage>
  );
};

export default EditProfilePage;
