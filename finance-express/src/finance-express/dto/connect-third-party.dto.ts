import { IsString, IsNotEmpty } from 'class-validator';

export class ConnectThirdPartyDto {
  public authorizationId: string;

  @IsString()
  @IsNotEmpty()
  public business: {
    id: string;
  };

  @IsString()
  @IsNotEmpty()
  public connection: {
    id: string;
  };

  @IsString()
  @IsNotEmpty()
  public integration: {
    name: string;
  };
}
