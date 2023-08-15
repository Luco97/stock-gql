import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RoleGuard } from '../../guards/role.guard';
import { CreateInput } from '../inputs/create.input';
import { TagRepositoryService } from '../repository/tag-repository.service';
import { TagEntity } from '../model/tag-entity';

@Resolver()
export class CreateResolver {
  constructor(private _tagRepo: TagRepositoryService) {}
  @Mutation(() => TagEntity)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  create_tag(
    @Args('create_input') createInput: CreateInput,
  ): Promise<TagEntity> {
    const { description, name } = createInput;

    return this._tagRepo.create(
      name.toLocaleLowerCase(),
      description.toLocaleLowerCase(),
    );
  }
}
