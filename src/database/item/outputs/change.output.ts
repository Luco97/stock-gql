import { Field, ObjectType } from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';

import { ItemEntity } from '../model/item-entity';

@ObjectType({
  description: 'response objectType when any items is updated',
})
export class ChangeOutput {
  @Field(() => String, { nullable: true, description: 'message of the update' })
  message: string;

  @Field(() => ItemEntity, {
    nullable: true,
    description: 'the item with the update fields',
  })
  item?: DeepPartial<ItemEntity>;
}
