
import { OnboardingDto } from './onboarding.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateOnboardingDto extends PartialType(OnboardingDto) {

}
