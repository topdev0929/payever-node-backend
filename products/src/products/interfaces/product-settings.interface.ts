export interface ProductSettingsInterface {
  businessIds: string[];
  settings: {
    welcomeShown: boolean;
    currency: string;
    measureMass: string;
    measureSize: string;
  };
}
