/**
 * @see commerceos/src/apps/interfaces/min-registered-app.ts
 */
export interface MinRegisteredApp {
  _id: string;
  setupStatus: string;
  code: string;
  bootstrapScriptUrl: string;
  dashboardInfo: {
    icon: string;
    title: string;
  };
  installed: boolean;
}
