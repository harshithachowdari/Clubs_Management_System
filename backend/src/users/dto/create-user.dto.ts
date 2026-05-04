import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  rollNumber: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsString()
  academicYear?: string;

  @IsString()
  administeringClubId?: string;

  profileImage?: string;
}
