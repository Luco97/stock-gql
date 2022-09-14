import { Field, InputType } from '@nestjs/graphql';

import { Min, MinLength } from 'class-validator';

@InputType({
  description:
    'update base class, extends in the others updates mutation input',
})
export class UpdateInput {
  @Field(() => Number, {
    description: 'item ID',
  })
  @Min(1)
  id_item: number;
}

@InputType({ description: 'update name class' })
export class UpdateNameInput extends UpdateInput {
  @Field(() => String, { description: 'new name in item' })
  @MinLength(5)
  name: string;
}

@InputType({ description: 'update imageURL class' })
export class UpdateImageInput extends UpdateInput {
  @Field(() => String, { description: 'new imageURL in item' })
  imageUrl: string;
}

@InputType({ description: 'update stock class' })
export class UpdateStockInput extends UpdateInput {
  @Field(() => Number, { description: 'new stock in item' })
  @Min(0)
  stock: number;
}

@InputType({ description: 'update price class' })
export class UpdatePriceInput extends UpdateInput {
  @Field(() => Number, { description: 'new price in item' })
  @Min(0)
  price: number;
}
