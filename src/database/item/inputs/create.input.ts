import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, Min, MinLength } from 'class-validator';
import { ItemEntity } from '../model/item-entity';

@InputType({ description: 'input to create item' })
export class CreateInput implements Partial<ItemEntity> {
  @Field(() => String, { description: 'Name of the item' })
  @IsDefined()
  @MinLength(5)
  name: string;

  @Field(() => String, {
    description: 'image URL of the item',
    defaultValue:
      'https://www.yiwubazaar.com/resources/assets/images/default-product.jpg',
  })
  imageUrl: string;

  @Field(() => Number, { description: 'Stock of the item', defaultValue: 0 })
  @Min(0)
  stock: number;

  @Field(() => Number, { description: 'Price of the item', defaultValue: 0 })
  @Min(0)
  price: number;
}
