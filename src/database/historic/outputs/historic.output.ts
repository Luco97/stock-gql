import { Field, ObjectType } from '@nestjs/graphql';

import { HistoricEntity } from '../model/historic-entity';

@ObjectType({ description: 'response of changes in item' })
export class HistoricOutput {
  @Field(() => [HistoricEntity], { description: 'array of changes in item' })
  changes: HistoricEntity[];

  @Field(() => Number, { description: 'quantity of changes in item' })
  count: number;
}
