import { Field, InputType } from '@nestjs/graphql';

@InputType('read_tags', { description: 'input to read tags' })
export class ReadInput {
  @Field(() => Number, {
    nullable: true,
    defaultValue: 10,
    description: 'quantity of tags',
  })
  take: number;

  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
    description: 'number of tags to skip',
  })
  skip: number;

  @Field(() => String, {
    nullable: true,
    defaultValue: '',
    description: 'if needs search specifically some like%',
  })
  name: string;
}
