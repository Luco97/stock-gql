import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LogIn {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(5)
  password: string;
}
