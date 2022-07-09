import { Field, ObjectType } from '@nestjs/graphql';

import { SignInOutput } from './sign-in.output';

@ObjectType()
export class LogInOutput extends SignInOutput {
  @Field(() => String, { nullable: true, defaultValue: '' })
  token: string;
}
