export interface MailServerConfigInterface {
  serverType: string;
  user: string;
  password: string;
  host: string;
  port: number;
  env?: string;
}
