import { Field, InputType } from '@nestjs/graphql';

@InputType()
// @ArgsType() // No funciona como dice la documentacion, seguir usando InputType
export class ReadInput {
  @Field(() => Number, {
    nullable: true,
    defaultValue: 10,
    description: 'quantity of items',
  })
  take: number;

  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
    description: 'number of items to skip',
  })
  skip: number;

  @Field(() => String, {
    nullable: true,
    defaultValue: 'createdAt',
    description: 'field selected for order',
  })
  orderBy: string;

  @Field(() => String, {
    nullable: true,
    defaultValue: 'ASC',
    description: 'if is ASCendent or DESCendent',
  })
  order: 'ASC' | 'DESC';
}
