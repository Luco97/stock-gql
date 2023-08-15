import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ItemEntity } from '../../item/model/item-entity';

@Entity()
@ObjectType({
  description: 'historic entity table',
})
export class HistoricEntity {
  @Field(() => ID, { description: 'historic register ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { description: 'change field of item' })
  @Column({ type: 'varchar' })
  change: string;

  @Field(() => String, { description: 'value before change' })
  @Column({ type: 'varchar', nullable: true })
  previousValue: string;

  @Field(() => Date, { description: 'when change occurs' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // @Field(() => ItemEntity, { nullable: true })
  @ManyToOne(() => ItemEntity, (item) => item.changes)
  item: ItemEntity;
}
