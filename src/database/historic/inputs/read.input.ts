import { Field, InputType } from '@nestjs/graphql';

import { IsDefined, IsOptional } from 'class-validator';

@InputType('ChangesReadInput')
export class ReadInput {
  @Field(() => Number)
  @IsDefined()
  itemId: number;

  @Field(() => String, { defaultValue: 'DESC' })
  @IsOptional()
  order: 'ASC' | 'DESC';
}
