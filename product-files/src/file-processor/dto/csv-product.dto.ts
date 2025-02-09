import { IsNotEmpty, IsNumberString, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CsvOptionsEnum } from '../enums';

export class CsvProductDto {
  @IsString()
  @IsNotEmpty()
  public Handle: string;

  @IsString()
  public Title: string;

  @IsString()
  public Description: string;

  @IsString()
  public Type: string;

  @IsString()
  public Hidden: string;

  @IsString()
  public Enabled: string;

  @IsString()
  @IsOptional()
  public [CsvOptionsEnum.OptionName1]: string;

  @IsString()
  @IsOptional()
  public [CsvOptionsEnum.OptionValue1]: string;

  @IsString()
  @IsOptional()
  public [CsvOptionsEnum.OptionName2]: string;

  @IsString()
  @IsOptional()
  public [CsvOptionsEnum.OptionValue2]: string;

  @IsString()
  @IsOptional()
  public [CsvOptionsEnum.OptionName3]: string;

  @IsString()
  @IsOptional()
  public [CsvOptionsEnum.OptionValue3]: string;

  @IsString()
  @IsOptional()
  public SKU: string;

  @IsString()
  @IsOptional()
  public 'Bar Code': string;

  @IsString()
  public 'Inventory Stock': string;

  @IsString()
  public 'Inventory Reserved': string;

  @IsString()
  public Price: string;

  @IsString()
  @IsOptional()
  public 'On Sale': string;

  @IsString()
  @IsOptional()
  public 'Sale Price': string;

  @IsString()
  @IsOptional()
  public 'Sale Percent': string;

  @IsString()
  @IsOptional()
  public 'Sale End Date': string;

  @IsString()
  @IsOptional()
  public 'Sale Start Date': string;

  @IsString()
  public Currency: string;

  @IsString()
  @IsOptional()
  public Images: string;

  @IsString()
  public VAT: string;

  @IsNumberString()
  @ValidateIf((o: any) => o.Type && o.Type.toLowerCase() === 'physical')
  public 'Weight(Kg)': string;

  @ValidateIf((o: any) => o.Type && o.Type.toLowerCase() === 'physical')
  @IsNumberString()
  @ValidateIf((o: any) => o.Type && o.Type.toLowerCase() === 'physical')
  public 'Width(Cm)': string;

  @ValidateIf((o: any) => o.Type && o.Type.toLowerCase() === 'physical')
  @IsNumberString()
  @ValidateIf((o: any) => o.Type && o.Type.toLowerCase() === 'physical')
  public 'Length(Cm)': string;

  @ValidateIf((o: any) => o.Type && o.Type.toLowerCase() === 'physical')
  @IsNumberString()
  public 'Height(Cm)': string;
}
