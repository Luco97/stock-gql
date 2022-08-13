import { Field, InputType } from '@nestjs/graphql';

import { IsDefined, IsOptional } from 'class-validator';

@InputType('ChangesReadInput')
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
