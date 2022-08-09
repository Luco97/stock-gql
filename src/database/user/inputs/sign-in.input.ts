import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { UserEntity } from '../model/user-entity';

@InputType()
export class SignInInput implements Partial<UserEntity> {
  @Field(() => String, { description: 'email for the new user' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'username for the new user' })
  @MinLength(5)
  username: string;

  @Field(() => String, { description: 'password for the user' })
  password: string;
}
