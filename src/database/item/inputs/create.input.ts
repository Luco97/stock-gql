import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, Min, MinLength } from 'class-validator';
import { ItemEntity } from '../model/item-entity';

@InputType()
export class CreateInput implements Partial<ItemEntity> {
  @Field(() => String)
  @IsDefined()
  @MinLength(5)
  name: string;

  @Field(() => String)
  imageUrl: string;

  @Field(() => Number)
  @Min(0)
  stock: number;

  @Field(() => Number)
  @Min(0)
  price: number;
}
