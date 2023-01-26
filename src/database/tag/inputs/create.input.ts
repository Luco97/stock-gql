import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, MinLength } from 'class-validator';

@InputType('create_tag', { description: 'input to create tag' })
export class CreateInput {
  @Field(() => String, { description: 'Name of the tag' })
  @IsDefined()
  @MinLength(4)
  name: string;

  @Field(() => String, { description: 'description of the tag' })
  @IsDefined()
  @MinLength(5)
  description: string;
}
