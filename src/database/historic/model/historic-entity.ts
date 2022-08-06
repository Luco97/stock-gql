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
@ObjectType()
export class HistoricEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  change: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

//   @Field(() => ItemEntity, { nullable: true })
  @ManyToOne(() => ItemEntity, (item) => item.changes)
  item: ItemEntity;
}
