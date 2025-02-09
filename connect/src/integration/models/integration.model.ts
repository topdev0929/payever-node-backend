import { Document, Types } from 'mongoose';
import { IntegrationInterface } from '../interfaces';
import { DisplayOptionsModel } from './display-options.model';
import { InstallationOptionsModel } from './installation-options.model';
import { IntegrationReviewModel } from './integration-review.model';
import { IntegrationVersionModel } from './integration-version.model';

export interface RatingType {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface IntegrationModel extends IntegrationInterface, Document {
  avgRating?: number;
  readonly displayOptions: DisplayOptionsModel;
  readonly installationOptions: InstallationOptionsModel;
  latestVersion?: IntegrationVersionModel;
  ratingsCount?: number;
  ratingsPerRate?: RatingType;
  reviews: Types.DocumentArray<IntegrationReviewModel>;
  timesInstalled: number;
  versions: Types.DocumentArray<IntegrationVersionModel>;

  readonly createdAt?: Date | string;
  readonly updatedAt?: Date | string;
}
