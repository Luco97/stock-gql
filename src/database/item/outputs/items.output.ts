import { Field, ObjectType } from '@nestjs/graphql';

import { ItemEntity } from '../model/item-entity';

@ObjectType({ description: 'response in find_all query' })
export class ItemsOutput {
  @Field(() => [ItemEntity], { description: 'array with the items' })
  items: ItemEntity[];

  @Field(() => Number, { description: 'number of items in the array' })
  count: number;
}
