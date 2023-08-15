import { Field, ObjectType } from '@nestjs/graphql';

import { SignInOutput } from './sign-in.output';

@ObjectType({ description: 'output object in log_in mutation' })
export class LogInOutput extends SignInOutput {
  @Field(() => String, { nullable: true, defaultValue: '' })
  token: string;
}
