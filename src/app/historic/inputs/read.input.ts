import { Field, InputType } from '@nestjs/graphql';

import { IsDefined, IsOptional } from 'class-validator';

@InputType('find_all_changes', {
  description: 'find all changes made in one item',
})
export class ReadInput {
  @Field(() => Number, { description: 'ID of item' })
  @IsDefined()
  itemId: number;

  @Field(() => Number, {
    nullable: true,
    defaultValue: 10,
    description: 'quantity of changes',
  })
  take: number;

  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
    description: 'number of changes to skip',
  })
  skip: number;

  @Field(() => String, {
    defaultValue: 'DESC',
    description: 'if is ASCendent or DESCendent',
  })
  @IsOptional()
  order: 'ASC' | 'DESC';
}
