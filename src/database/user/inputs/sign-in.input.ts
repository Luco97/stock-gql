import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { UserEntity } from '../model/user-entity';

@InputType()
export class SignIn implements Partial<UserEntity> {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(5)
  username: string;

  @Field(() => String)
  password: string;
}
