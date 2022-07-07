import { Field, InputType } from '@nestjs/graphql';
import { ItemEntity } from '../model/item-entity';

@InputType()
export class CreateInput implements Partial<ItemEntity> {
  @Field(() => String)
  name: string;

  @Field(() => String)
  imageUrl: string;

  @Field(() => Number)
  stock: number;
}
