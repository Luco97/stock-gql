import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RoleGuard } from '../../guards/role.guard';
import { ChangeOutput } from '../outputs/change.output';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class DeleteItemResolver {
  constructor(private _itemService: ItemRepositoryService) {}

  @Mutation(() => ChangeOutput)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  async delete(
    @Args('id_item', { name: 'id_item' }) id: number,
  ): Promise<ChangeOutput> {
    const item = await this._itemService.itemRepo
      .createQueryBuilder('item')
      .where('item.id = :id', { id })
      .getOne();
    if (!item) return { message: `item with id = ${id} doesn't exist` };
    await this._itemService.itemRepo.softDelete(id);
    return { message: 'soft deleted item', item };
  }
}
