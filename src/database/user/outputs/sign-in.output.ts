import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInOutput {
  @Field(() => Number)
  status: number;

  @Field(() => String)
  message: string;
}
