export interface IntegrationWrapperConfigInterface {
  _id: string;
  wrapperType: string;
  displayOptions: {
    _id: string;
    icon: string;
    title: string;
    bgColor: string;
  };
  optionIcon: string;
  category: string;
  developer: string;
  languages: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  connect: {
    formAction: {
      installEndpoint: string;
      uninstallEndpoint: string;
    };
  };
  installationOptions: {
    links: [
      {
        _id: string;
        type: string;
        url: string;
      },
    ];
  };
}
