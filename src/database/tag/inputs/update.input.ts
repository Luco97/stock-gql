import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, Min, MinLength } from 'class-validator';

@InputType('update_tag')
export class UpdateTags {
  @Field(() => Number, {
    description: 'tag ID',
  })
  @Min(1)
  id_tag: number;

  @Field(() => String, {
    description: 'new description of the tag',
    nullable: true,
  })
  @IsOptional()
  @MinLength(5)
  description: string;
}
