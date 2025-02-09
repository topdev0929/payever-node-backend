import { DisplayOptionsInterface } from './display-options.interface';
import { InstallationOptionsInterface } from './installation-options.interface';
import { IntegrationReviewInterface } from './integration-review.interface';
import { IntegrationVersionInterface } from './integration-version.interface';

export interface IntegrationInterface {
  allowedBusinesses?: string[];
  readonly name: string;
  readonly issuer?: string;
  readonly category: string;
  categoryIcon?: string;
  readonly enabled: boolean;
  readonly displayOptions: DisplayOptionsInterface;
  readonly installationOptions: InstallationOptionsInterface;
  readonly order: number;
  readonly reviews: IntegrationReviewInterface[];
  readonly versions: IntegrationVersionInterface[];
  timesInstalled: number;
  isConnected?: boolean;
  parentFolderId?: string;
  scopes?: string[];
  connect?: {
    formAction: {
      actionEndpoint: string;
      initEndpoint: string;
    };
    url: string;
  };
}
