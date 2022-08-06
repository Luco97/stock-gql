import { Field, ObjectType } from '@nestjs/graphql';

import { HistoricEntity } from '../model/historic-entity';

@ObjectType()
export class HistoricOutput {
  @Field(() => [HistoricEntity])
  changes: HistoricEntity[];

  @Field(() => Number)
  count: number;
}
