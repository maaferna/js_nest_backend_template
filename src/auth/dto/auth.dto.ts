import { IsInt, IsString, IsEmail, IsOptional, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserProfileDto {
  // Define the structure of the UserProfile here if needed
}

export class AuthDto {
  @IsInt()
  id: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  hash: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserProfileDto)
  profile: UserProfileDto | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

  