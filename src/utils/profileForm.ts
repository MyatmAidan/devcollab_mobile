import type { ProfileInput } from '../types/developer';

function optionalString(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Omit empty strings so nullable URL fields pass API validation. */
export function sanitizeProfileInput(input: ProfileInput): ProfileInput {
  return {
    category_id: input.category_id ?? null,
    headline: optionalString(input.headline),
    bio: optionalString(input.bio),
    experience_level: input.experience_level ?? null,
    location: optionalString(input.location),
    profile_photo: optionalString(input.profile_photo),
    phone: optionalString(input.phone),
    github_url: optionalString(input.github_url),
    linkedin_url: optionalString(input.linkedin_url),
    portfolio_url: optionalString(input.portfolio_url),
    is_public: input.is_public,
    skill_ids: input.skill_ids?.length ? input.skill_ids : [],
  };
}
