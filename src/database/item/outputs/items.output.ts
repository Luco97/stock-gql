import { Field, ObjectType } from '@nestjs/graphql';

import { ItemEntity } from '../model/item-entity';

@ObjectType({ description: 'response in find_all query' })
export class ItemsOutput {
  @Field(() => [ItemEntity])
  items: ItemEntity[];

  @Field(() => Number)
  count: number;
}
