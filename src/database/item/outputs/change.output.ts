import { Field, ObjectType } from '@nestjs/graphql';

import { ItemEntity } from '../model/item-entity';

@ObjectType()
export class ChangeOutput {
  @Field(() => String, { nullable: true })
  message: string;

  @Field(() => ItemEntity, { nullable: true })
  item?: ItemEntity;
}
