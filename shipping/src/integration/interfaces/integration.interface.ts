import { DisplayOptionsInterface } from './display-options.interface';
import { IntegrationServiceInterface } from './integration-service.interface';
import { PackageTypeInterface } from './package-type.interface';

export interface IntegrationInterface {
  name: string;
  category: string;
  displayOptions: DisplayOptionsInterface;
  flatAmount: number;
  handlingFeePercentage: number;
  integrationServices?: IntegrationServiceInterface[];
  packageTypes?: PackageTypeInterface[]; 
}
