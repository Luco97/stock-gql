import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { RoleGuard } from '../../guards/role.guard';
import { ReadInput } from '../inputs/read.input';
import { TagsOutput } from '../outputs/tag.output';
import { TagRepositoryService } from '../repository/tag-repository.service';

@Resolver()
export class ReadResolver {
  constructor(private _tagRepo: TagRepositoryService) {}

  @Query(() => TagsOutput)
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  find_all(@Args('params') readInput: ReadInput) {
    const { name, skip, take } = readInput;

    return this._tagRepo.find_all({ name: name.trim(), skip, take });
  }
}
