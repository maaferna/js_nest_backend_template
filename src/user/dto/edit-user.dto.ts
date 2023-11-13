import {
  IsEmail,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserProfile } from '@prisma/client';

export class UserProfileDto {
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;
}

export class EditUserDto {
  @IsNumber() // Add this decorator
  id: number; // Add the id property

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile?: UserProfileDto;
}
