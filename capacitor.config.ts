import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devcollab.mobile',
  appName: 'DevCollab',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'ionic',
    },
  },
};

export default config;
