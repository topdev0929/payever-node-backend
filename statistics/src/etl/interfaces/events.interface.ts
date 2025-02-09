export interface EventsInterface {
  readonly applicationId: string;
  readonly browser?: string;
  readonly businessId: string;
  readonly consoleErrors?: [string];
  readonly customMetrics?: [object];
  readonly device?: string;
  readonly element?: object;
  readonly sessionId: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
