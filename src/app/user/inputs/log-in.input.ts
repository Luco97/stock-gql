import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType('log_in', { description: 'log in object (with email and password)' })
export class LogInInput {
  @Field(() => String, { description: 'email of user to log in' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'password of the user' })
  @MinLength(5)
  password: string;
}
