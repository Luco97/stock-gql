import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../user/model/user-entity';
import { HistoricEntity } from '../../historic/model/historic-entity';

@Entity()
@ObjectType({ description: 'item entity table' })
export class ItemEntity {
  @Field(() => ID, { description: 'item ID' })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String, { description: 'item name' })
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => Number, { description: 'item stock' })
  @Column({ type: 'int' })
  stock: number;

  @Field(() => Number, { description: 'item price' })
  @Column({ type: 'decimal', default: 0 })
  price: number;

  @Field(() => String, { nullable: true, description: 'item image URL' })
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Field(() => Date, { description: 'item creation date' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date, { description: 'item latest update' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @Field(() => UserEntity, {
    nullable: true,
    defaultValue: null,
    description: 'user item owner',
  })
  @ManyToOne(() => UserEntity, (user) => user.items)
  user: UserEntity;

  // @Field(() => HistoricEntity, { nullable: true })
  @OneToMany(() => HistoricEntity, (changes) => changes.item)
  changes: HistoricEntity[];
}
