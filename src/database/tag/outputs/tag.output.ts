import { Field, ObjectType } from '@nestjs/graphql';
import { TagEntity } from '../model/tag-entity';

@ObjectType({ description: 'response in find_all query' })
export class TagsOutput {
  @Field(() => [TagEntity], { description: 'array with the tags' })
  items: TagEntity[];

  @Field(() => Number, { description: 'number of tags' })
  count: number;
}
