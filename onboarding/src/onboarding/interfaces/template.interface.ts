export interface TemplateInterface {
  name: string;
  config: {
    [key: string]: {
      [key: string]: any;
    };
  };
}
