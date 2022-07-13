import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, Min, MinLength } from 'class-validator';

import { ItemEntity } from '../model/item-entity';

@InputType()
export class UpdateInput implements Partial<ItemEntity> {
  @Field(() => Number)
  @Min(1)
  id_item: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(5)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  imageUrl: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @Min(0)
  stock: number;
}
