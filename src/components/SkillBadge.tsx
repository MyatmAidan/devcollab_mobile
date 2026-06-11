import { IonChip } from '@ionic/react';
import React from 'react';
import type { Skill } from '../types/developer';

interface SkillBadgeProps {
  skill: Skill;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => (
  <IonChip color="primary" outline>
    {skill.name}
  </IonChip>
);

export default SkillBadge;
