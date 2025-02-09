export interface ThemeInterface {
  businessId: string;
  name: string;
  isDefault: boolean;
  settings: {
    bgChatColor: string;
    accentColor: string;
    messagesTopColor: string;
    messagesBottomColor: string;
    messageAppColor: string;
    messageWidgetShadow: string;
    headerBanner : string;
    pageBackground : string;

    defaultPresetColor: number;
    customPresetColors: Array<{
      bgChatColor?: string;
      accentColor: string;
      messagesBottomColor?: string;
    }>;
    messageWidgetBlurValue: string;
    alwaysOpen?: boolean;
  };
}
