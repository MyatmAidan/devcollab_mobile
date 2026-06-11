import { Preferences } from '@capacitor/preferences';

const COMPANY_TOKEN_KEY = 'devcollab_company_auth_token';

export async function getCompanyToken(): Promise<string | null> {
  const { value } = await Preferences.get({ key: COMPANY_TOKEN_KEY });
  return value;
}

export async function setCompanyToken(token: string): Promise<void> {
  await Preferences.set({ key: COMPANY_TOKEN_KEY, value: token });
}

export async function removeCompanyToken(): Promise<void> {
  await Preferences.remove({ key: COMPANY_TOKEN_KEY });
}
