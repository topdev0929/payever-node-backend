export interface EmailDataInterface {
  to: string;
  subject?: string;
  type: string;
  language: string;
  params: object;
  html?: string;
}
