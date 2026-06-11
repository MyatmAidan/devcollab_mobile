import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const hapticLight = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Web / unsupported platform
  }
};

export const hapticMedium = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Web / unsupported platform
  }
};

export const hapticSuccess = async () => {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Web / unsupported platform
  }
};
