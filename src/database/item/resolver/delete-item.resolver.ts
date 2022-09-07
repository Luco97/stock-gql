import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RoleGuard } from '../../guards/role.guard';
import { ChangeOutput } from '../outputs/change.output';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class DeleteItemResolver {
  constructor(private _itemService: ItemRepositoryService) {}

  @Mutation(() => ChangeOutput, {
    name: 'delete_item',
    description: "delete item mutation, only role 'admin' can delete items",
  })
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  async delete(
    @Args('id_item', { name: 'id_item' }) id: number,
  ): Promise<ChangeOutput> {
    return new Promise<ChangeOutput>((resolve, reject) => {
      this._itemService.itemRepo
        .createQueryBuilder('item')
        .where('item.id = :id', { id })
        .getOne()
        .then((item) => {
          if (!item) resolve({ message: `item with id = ${id} doesn't exist` });
          this._itemService.itemRepo
            .softDelete(id)
            .then(() => resolve({ message: 'soft deleted item', item }));
        });
    });
  }
}
