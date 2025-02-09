import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class JiraMailDto {
  @IsNotEmpty()
  @IsString()
  public to: string;

  @IsNotEmpty()
  @IsString()
  public subject: string;

  @IsOptional()
  @IsString()
  public 'reply-to': string;

  @IsNotEmpty()
  @IsString()
  public body: string;

  @IsOptional()
  @IsObject()
  public headers: any;

  @IsOptional()
  @IsString()
  public from: string;
}
