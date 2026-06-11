import { IonButton, IonSpinner } from '@ionic/react';
import React, { useMemo } from 'react';
import type { Skill } from '../types/developer';

interface SkillPickerProps {
  skills: Skill[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  loading?: boolean;
}

const SkillPicker: React.FC<SkillPickerProps> = ({
  skills,
  selectedIds,
  onChange,
  loading = false,
}) => {
  const groupedSkills = useMemo(() => {
    const groups = new Map<string, Skill[]>();

    skills.forEach((skill) => {
      const label = skill.category?.name ?? 'Other';
      const current = groups.get(label) ?? [];
      current.push(skill);
      groups.set(label, current);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [skills]);

  const toggleSkill = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((skillId) => skillId !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <div className="skill-picker ion-padding-top">
      <h3>Skills</h3>
      {loading ? (
        <div className="ion-text-center ion-padding">
          <IonSpinner name="crescent" color="primary" />
        </div>
      ) : null}
      {!loading && skills.length === 0 ? (
        <p className="auth-subtitle" style={{ margin: '0.5rem 0 0' }}>
          No skills available yet. You can save your profile and add skills later.
        </p>
      ) : null}
      {!loading && skills.length > 0 ? (
        <div className="skill-picker-groups">
          {groupedSkills.map(([categoryName, categorySkills]) => (
            <div key={categoryName} className="skill-picker-group ion-margin-top">
              <p className="skill-picker-group-label">{categoryName}</p>
              <div className="skill-row">
                {categorySkills.map((skill) => (
                  <IonButton
                    key={skill.id}
                    type="button"
                    size="small"
                    fill={selectedIds.includes(skill.id) ? 'solid' : 'outline'}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    {skill.name}
                  </IonButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SkillPicker;
