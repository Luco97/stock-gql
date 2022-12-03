import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, IsUrl, Min, MinLength } from 'class-validator';

export class UpdateInput {
  @Field(() => Number, {
    description: 'item ID',
  })
  @Min(1)
  id_item: number;
}

@InputType('update_name', { description: 'update name class' })
export class UpdateNameInput extends UpdateInput {
  @Field(() => String, { description: 'new name in item' })
  @MinLength(5)
  name: string;
}

@InputType('update_image', { description: 'update imageURL class' })
export class UpdateImageInput extends UpdateInput {
  @Field(() => String, { description: 'new imageURL in item' })
  imageUrl: string;
}

@InputType('update_stock', { description: 'update stock class' })
export class UpdateStockInput extends UpdateInput {
  @Field(() => Number, { description: 'new stock in item' })
  @Min(0)
  stock: number;
}

@InputType('update_price', { description: 'update price class' })
export class UpdatePriceInput extends UpdateInput {
  @Field(() => Number, { description: 'new price in item' })
  @Min(0)
  price: number;
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
