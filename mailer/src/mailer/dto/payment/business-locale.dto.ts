import { IsOptional, IsString } from 'class-validator';
import { BusinessInterface } from '../../interfaces';
import { environment } from '../../../environments';

const LOCALE_BUSINESS: string = 'business';

export class BusinessLocaleDto {
  @IsOptional()
  @IsString()
  public serviceEntityId?: string;

  @IsOptional()
  @IsString()
  public locale: string;

  public setLocale(business: BusinessInterface): void {
    if (this.shouldUseBusinessLocale() || !this.locale) {
      this.locale = business.defaultLanguage || environment.defaultLanguage;
    }
  }

  private shouldUseBusinessLocale(): boolean {
    return LOCALE_BUSINESS === this.locale;
  }
}
