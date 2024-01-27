import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Solutio',
  webDir: 'dist/proyecto-servicios',
  server: {
    androidScheme: 'http'
  },
  "plugins": {
    "SplashScreen": {
      "launchAutoHide": true,
      "showSpinner": false
    },
    "Permissions": {
      "permissions": ["Internet"]
    }
  }
};

export default config;
