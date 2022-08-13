import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  Column,
  Entity,
  OneToMany,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';

import { ItemEntity } from '../../item/model/item-entity';

@Entity()
@ObjectType()
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  email: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  username: string;

  @Field(() => String)
  @Column({ type: 'varchar', select: false })
  password: string;

  @Field(() => String)
  @Column({ type: 'varchar', default: 'basic' })
  type: string;

  @Field(() => [ItemEntity], { nullable: true })
  @OneToMany(() => ItemEntity, (items) => items.user)
  items: ItemEntity[];

  @BeforeInsert()
  async hashPass() {
    if (!this.password) return;
    const saltRound: number = 10;
    const bcSaltRound: string = await genSalt(saltRound);
    this.password = await hash(this.password, bcSaltRound);
  }
}
