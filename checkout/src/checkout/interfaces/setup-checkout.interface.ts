import { UpdateCheckoutDto } from '../dto';

export interface SetupCheckoutInterface { 
  updateData: UpdateCheckoutDto; 
  businessId: string; 
  integrationsToInstall: string[]; 
}
