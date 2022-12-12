import { Field, ObjectType } from '@nestjs/graphql';

import { SignInOutput } from './sign-in.output';

@ObjectType()
export class ValidateOutput extends SignInOutput {
  @Field(() => Boolean, { defaultValue: false })
  isValid: boolean;
}
