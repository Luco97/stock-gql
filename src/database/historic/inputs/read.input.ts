import { Field, InputType } from '@nestjs/graphql';

import { IsDefined, IsOptional } from 'class-validator';

@InputType('ChangesReadInput')
export class ReadInput {
  @Field(() => Number, { description: 'ID of item' })
  @IsDefined()
  itemId: number;

  @Field(() => String, {
    defaultValue: 'DESC',
    description: 'if is ASCendent or DESCendent',
  })
  @IsOptional()
  order: 'ASC' | 'DESC';
}
