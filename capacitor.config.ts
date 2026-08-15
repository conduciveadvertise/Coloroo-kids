export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  backgroundColor?: string;
  android?: {
    allowMixedContent?: boolean;
    captureInput?: boolean;
    webContentsDebuggingEnabled?: boolean;
    hideLogs?: boolean;
  };
  plugins?: Record<string, any>;
}

const config: CapacitorConfig = {
  appId: 'com.colorookids.app',
  appName: 'Coloroo Kids',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: '#F3E8FF',
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    hideLogs: true
  },
  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'DARK',
      backgroundColor: '#00000000'
    },
    ScreenOrientation: {
      orientation: 'landscape'
    },
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: '#F3E8FF'
    }
  }
};

export default config;
