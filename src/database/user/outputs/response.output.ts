import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class response {
  @Field(() => Number)
  status: number;

  @Field(() => String)
  message: string;
}
