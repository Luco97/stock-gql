import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RoleGuard } from '../../guards/role.guard';
import { TransformTokenInterceptor } from '../../item/interceptors/transform-token.interceptor';
import { UpdateTags } from '../inputs/update.input';
import { TagRepositoryService } from '../repository/tag-repository.service';

@Resolver()
export class UpdateResolver {
  constructor(private _tagRepo: TagRepositoryService) {}

  @Mutation(() => Boolean)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  @UseInterceptors(TransformTokenInterceptor)
  update_tag(@Args('update_tag') updateInput: UpdateTags) {
    const { description, id_tag } = updateInput;

    return new Promise<Boolean>((resolve, reject) =>
      this._tagRepo.find_one([id_tag]).then((tags) => {
        if (!tags.length) resolve(false);
        else
          this._tagRepo.update(id_tag, description).then(() => {
            resolve(true);
          });
      }),
    );
  }
}
