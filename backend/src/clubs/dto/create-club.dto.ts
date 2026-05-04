import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ClubCategory } from '../schemas/club.schema';

export class CreateClubDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ClubCategory)
  category: ClubCategory;

  @IsNotEmpty()
  @IsString()
  adminId: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  meetingSchedule?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  socialLinks?: {
    website?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
}
