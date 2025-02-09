export interface IntegrationReviewInterface {
  readonly title?: string;
  readonly text?: string;
  readonly rating?: number;
  readonly userId: string;
  readonly userFullName: string;
  readonly reviewDate: string;
}
