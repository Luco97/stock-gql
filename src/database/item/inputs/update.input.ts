import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, IsUrl, Min, MinLength } from 'class-validator';

export class UpdateInput {
  @Field(() => Number, {
    description: 'item ID',
  })
  @Min(1)
  id_item: number;
}

@InputType('update_item')
export class Update {
  @Field(() => Number, {
    description: 'item ID',
  })
  @Min(1)
  id_item: number;

  @Field(() => Number, { description: 'new price in item', nullable: true })
  @IsOptional()
  @Min(0)
  price: number;

  @Field(() => Number, { description: 'new stock in item', nullable: true })
  @IsOptional()
  @Min(0)
  stock: number;

  @Field(() => String, { description: 'new imageURL in item', nullable: true })
  @IsOptional()
  @IsUrl()
  imageUrl: string;

  @Field(() => String, { description: 'new name in item', nullable: true })
  @IsOptional()
  @MinLength(5)
  name: string;
}
