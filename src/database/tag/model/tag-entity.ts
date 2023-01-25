import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemEntity } from '../../item/model/item-entity';

@Entity()
@ObjectType()
export class TagEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToMany(() => ItemEntity, (items) => items.tags)
  items: ItemEntity[];

  // Map's fields (fields created using things like loadRelationCountAndMap)
  @Field(() => Number, { nullable: true })
  item_count?: number;
}
