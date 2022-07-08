import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsOptional, Min, MinLength } from 'class-validator';

import { ItemEntity } from '../model/item-entity';

@InputType()
export class CreateInput implements Partial<ItemEntity> {
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
