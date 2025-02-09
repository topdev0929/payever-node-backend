import { ThemeInterface, BubbleInterface } from './interfaces';

// tslint:disable: object-literal-sort-keys
export const defaultThemes: Array<Pick<ThemeInterface, 'name' | 'settings'>> = [{
    name: 'default',
    settings: {
      bgChatColor: '#d6e2ee',
      accentColor: '#007ee5',
      messagesTopColor: '#ffffff',
      messagesBottomColor: '#e1ffc7',
      messageAppColor: '#ffffff',
      messageWidgetShadow: '',
      pageBackground : '',
      headerBanner : '',
      defaultPresetColor: 0,
      customPresetColors: [
        {
          accentColor: '#007ee5',
          messagesBottomColor: '#e1ffc7',
          bgChatColor: '#d6e2ee',
        },
        {
          accentColor: '#d33213',
          messagesBottomColor: '#d33213',
          bgChatColor: '#c98a7d',
        },
        {
          accentColor: '#edb400',
          messagesBottomColor: '#ede8e2',
          bgChatColor: '#e4b71e',
        },
        {
          accentColor: '#6d839e',
          messagesBottomColor: '#6d839e',
          bgChatColor: '#6f7f98',
        },
        {
          accentColor: '#9472ee',
          messagesBottomColor: '#9472ee',
          bgChatColor: '#c2b2e3',
        },
        {
          accentColor: '#f08200',
          messagesBottomColor: '#f08200',
          bgChatColor: '#e5ba86',
        },
        {
          accentColor: '#eb6ca4',
          bgChatColor: '#e0aec1',
          messagesBottomColor: '#eb6ca4',
        },
        {
          accentColor: '#29b327',
          messagesBottomColor: '#29b327',
          bgChatColor: '#73ab74',
        },
        {
          accentColor: '#00c2ed',
          messagesBottomColor: '#00c2ed',
          bgChatColor: '#84cee2',
        },
        {
          accentColor: '#007aff',
          messagesBottomColor: '#007aff',
          bgChatColor: '#8fbbf4',
        },
        {
          accentColor: '#f09eee',
          messagesBottomColor: '#ccffc7',
          bgChatColor: '#ffbca6',
        },
        {
          accentColor: '#199972',
          messagesBottomColor: '#fffec7',
          bgChatColor: '#c1c7cb',
        },
        {
          accentColor: '#ff53f4',
          messagesBottomColor: '#ff53f4',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#2c89ed',
          messagesBottomColor: '#fcff8b',
          bgChatColor: '#5f6f54',
        },
        {
          accentColor: '#7e5fe5',
          messagesBottomColor: '#f5e2ff',
          bgChatColor: '#ae85f0',
        },
        {
          accentColor: '#5a9e29',
          messagesBottomColor: '#dcf8c6',
          bgChatColor: '#ffd59e',
        },
        {
          accentColor: '#ff5fa9',
          messagesBottomColor: '#fff4d7',
          bgChatColor: '#f6b594',
        },
        {
          accentColor: '#f55783',
          messagesBottomColor: '#c9fdfe',
          bgChatColor: '#fec8ff',
        },
      ],
      messageWidgetBlurValue: '23px',
      alwaysOpen: true,
    },
  },
  {
    name: 'light',
    settings: {
      bgChatColor: '#ffffff',
      accentColor: '#007affff',
      messagesTopColor: '#ffffff',
      messagesBottomColor: '#007aff',
      messageAppColor: '#ffffff',
      messageWidgetShadow: '',
      headerBanner : '',
      pageBackground: '',
      defaultPresetColor: 0,
      customPresetColors: [
        {
          accentColor: '#007affff',
          messagesBottomColor: '#007aff',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#ff53f4',
          messagesBottomColor: '#007aff',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#6d839e',
          messagesBottomColor: '#6d839e',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#edb400',
          messagesBottomColor: '#edb400',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#d33213',
          messagesBottomColor: '#d33213',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#9472ee',
          messagesBottomColor: '#9472ee',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#f08200',
          messagesBottomColor: '#f08200',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#eb6ca4',
          bgChatColor: '#ffffff',
          messagesBottomColor: '#eb6ca4',
        },
        {
          accentColor: '#29b327',
          messagesBottomColor: '#29b327',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#00c2ed',
          messagesBottomColor: '#00c2ed',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#ea8ced',
          messagesBottomColor: '#00c2ed',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#d33213',
          messagesBottomColor: '#d37f13ff',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#00b09b',
          messagesBottomColor: '#00b09b',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#ff53f4',
          messagesBottomColor: '#ff53f4',
          bgChatColor: '#ffffff',
        },
        {
          accentColor: '#000000',
          messagesBottomColor: '#000000',
          bgChatColor: '#ffffff',
        },
      ],
      messageWidgetBlurValue: '23px',
      alwaysOpen: true,
    },
  },
  {
    name: 'evening',
    settings: {
      bgChatColor: '#000000',
      accentColor: '#e4790dff',
      messagesTopColor: '#262628',
      messagesBottomColor: '#e4790dff',
      messageAppColor: '#000000',
      messageWidgetShadow: '',
      headerBanner : '',
      pageBackground : '',
      defaultPresetColor: 0,
      customPresetColors: [
        {
          accentColor: '#e4790dff',
          messagesBottomColor: '#e4790dff',
        },
        {
          accentColor: '#313131',
          messagesBottomColor: '#313131',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#edb400',
          messagesBottomColor: '#edb400',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#d33213',
          messagesBottomColor: '#d33213',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#9472ee',
          messagesBottomColor: '#9472ee',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#f08200',
          messagesBottomColor: '#f08200',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#eb6ca4',
          messagesBottomColor: '#eb6ca4',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#29b327',
          bgChatColor: '#000000',
          messagesBottomColor: '#29b327',
        },
        {
          accentColor: '#00c2ed',
          messagesBottomColor: '#00c2ed',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#ea8ced',
          messagesBottomColor: '#00c2ed',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#d33213',
          messagesBottomColor: '#f98500ff',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#00b09b',
          messagesBottomColor: '#00b09b',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#ff53f4',
          messagesBottomColor: '#ff53f4',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#007aff',
          messagesBottomColor: '#007aff',
          bgChatColor: '#000000',
        },
        {
          accentColor: '#00b09b',
          messagesBottomColor: '#00b09b',
          bgChatColor: '#000000',
        },
      ],
      messageWidgetBlurValue: '23px',
      alwaysOpen: true,
    },
  },
  {
    name: 'midnight',
    settings: {
      bgChatColor: '#18191eff',
      accentColor: '#47505dff',
      messagesTopColor: '#262628',
      messagesBottomColor: '#47505dff',
      messageAppColor: '#000000',
      messageWidgetShadow: '',
      headerBanner : '',
      pageBackground : '',
      defaultPresetColor: 0,
      customPresetColors: [
        {
          accentColor: '#47505dff',
          bgChatColor: '#18191eff',
          messagesBottomColor: '#47505dff',
        },
        {
          accentColor: '#29b327ff',
          messagesBottomColor: '#2d692eff',
          bgChatColor: '#112012ff',
        },
        {
          accentColor: '#007affff',
          messagesBottomColor: '#285596ff',
          bgChatColor: '#18222dff',
        },
        {
          accentColor: '#00c2edff',
          messagesBottomColor: '#25738bff',
          bgChatColor: '#12242aff',
        },
        {
          accentColor: '#eb6ca4ff',
          messagesBottomColor: '#8a5366ff',
          bgChatColor: '#2a1d21ff',
        },
        {
          accentColor: '#f08200ff',
          messagesBottomColor: '#8d5f26ff',
          bgChatColor: '#2b2012ff',
        },
        {
          accentColor: '#9472eeff',
          messagesBottomColor: '#69568cff',
          bgChatColor: '#221e2aff',
        },
        {
          accentColor: '#6d839eff',
          bgChatColor: '#17191cff',
          messagesBottomColor: '#48505dff',
        },
        {
          accentColor: '#edb400ff',
          messagesBottomColor: '#8b7425ff',
          bgChatColor: '#2a2512ff',
        },
        {
          accentColor: '#d33213ff',
          messagesBottomColor: '#7c3729ff',
          bgChatColor: '#251512ff',
        },
      ],
      messageWidgetBlurValue: '23px',
      alwaysOpen: true,
    },
  },
];

export const defaultBubble: Omit<BubbleInterface, 'businessId'> = {
  showBubble: true,
  showNotifications: true,
  brand: 'payever',
  style: 'circle',
  layout: 'logo_text',
  logo: '',
  text: '',
  bgColor: '#111111',
  textColor: '#ffffff',
  boxShadow: '#9a9a9aff',
  roundedValue: '12px',
  blurBox: '',
};
