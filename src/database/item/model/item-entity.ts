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
@ObjectType()
export class ItemEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => Number)
  @Column({ type: 'int' })
  stock: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @Field(() => UserEntity, { nullable: true })
  @ManyToOne(() => UserEntity, (user) => user.items)
  user: UserEntity;

  // @Field(() => HistoricEntity, { nullable: true })
  @OneToMany(() => HistoricEntity, (changes) => changes.item)
  changes: HistoricEntity[];
}
