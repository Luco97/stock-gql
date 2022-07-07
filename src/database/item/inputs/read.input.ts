import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ReadInput {
  @Field(() => Number, {nullable: true, defaultValue: 3})
  take: number;

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  skip  : number;
}
