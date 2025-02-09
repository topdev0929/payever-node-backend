export interface EmailDataInterface {
  to: string;
  cc: string[];
  subject: string;
  type: string;
  language: string;
  params: object;
  html?: string;
}
