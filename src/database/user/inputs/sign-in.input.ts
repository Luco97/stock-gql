import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UserEntity } from '../model/user-entity';

@InputType()
export class SignIn implements Partial<UserEntity> {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
