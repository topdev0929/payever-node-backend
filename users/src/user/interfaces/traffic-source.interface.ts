export interface TrafficSourceInterface {
  readonly businessId: string;
  readonly source: string;
  readonly medium?: string;
  readonly campaign?: string;
  readonly content?: string;
}
