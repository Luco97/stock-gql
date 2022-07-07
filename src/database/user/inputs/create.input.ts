import { Field, InputType } from 'type-graphql';
import { UserEntity } from '../model/user-entity';

@InputType()
export class Create implements Partial<UserEntity> {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
