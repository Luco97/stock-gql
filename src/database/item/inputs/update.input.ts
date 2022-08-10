import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, Min, MinLength } from 'class-validator';

// @InputType()
// export class UpdateInput implements Partial<ItemEntity> {
//   @Field(() => Number)
//   @Min(1)
//   id_item: number;

//   @Field(() => String, { nullable: true })
//   @IsOptional()
//   @MinLength(5)
//   name: string;

//   @Field(() => String, { nullable: true })
//   @IsOptional()
//   imageUrl: string;

//   @Field(() => Number, { nullable: true })
//   @IsOptional()
//   @Min(0)
//   stock: number;
// }
@InputType()
export class UpdateInput {
  @Field(() => Number)
  @Min(1)
  id_item: number;
}
export class UpdateNameInput extends UpdateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(5)
  name: string;
}
@InputType()
export class UpdateImageInput extends UpdateInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  imageUrl: string;
}
@InputType()
export class UpdateStockInput extends UpdateInput {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @Min(0)
  stock: number;
}
