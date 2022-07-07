import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ItemEntity } from '../../item/model/item-entity';

@Entity()
@ObjectType()
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  username: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  password: string;

  @Field(() => String)
  @Column({ type: 'varchar', default: 'basic' })
  type: string;

  @Field(() => [ItemEntity])
  @OneToMany(() => ItemEntity, (items) => items.user)
  items: ItemEntity[];
}
