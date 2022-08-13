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
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', default: 'basic' })
  type: string;

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
