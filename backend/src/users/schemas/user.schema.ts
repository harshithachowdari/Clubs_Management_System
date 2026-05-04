import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  CLUB_ADMIN = 'club_admin',
  STUDENT = 'student',
  FACULTY = 'faculty',
}

export enum AcademicYear {
  FIRST_YEAR = '1st Year',
  SECOND_YEAR = '2nd Year',
  THIRD_YEAR = '3rd Year',
  FOURTH_YEAR = '4th Year',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ required: true })
  rollNumber: string;

  @Prop({ required: true })
  department: string;

  @Prop({ enum: AcademicYear, default: null })
  academicYear: AcademicYear;

  @Prop({ default: null })
  profileImage: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  joinedClubs: string[];

  @Prop({ type: [String], default: [] })
  managedClubs: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});
