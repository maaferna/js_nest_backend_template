import {
  IsInt,
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserProfileDto {
  @IsInt()
  id?: number;

  @IsString()
  first_name?: string;

  @IsString()
  last_name?: string;

  @IsString()
  profile_image?: string;

  @IsString()
  biography?: string;

  createdAt: any;

  updatedAt: any;
}

export class AuthDto {
  @IsInt()
  id: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string; // Include password field here

  @IsOptional()
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile: UserProfileDto | null;

  createdAt: any;

  updatedAt: any;
}
