import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RoleGuard } from '../../guards/role.guard';
import { UpdateInput } from '../inputs/update.input';
import { ChangeOutput } from '../outputs/change.output';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class UpdateItemAdminResolver {
  constructor(private _itemService: ItemRepositoryService) {}

  @Mutation(() => ChangeOutput,)
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  async updateAdmin(@Args('item') itemUpdate: UpdateInput): Promise<ChangeOutput> {
    const { id_item, imageUrl, name, stock } = itemUpdate;
    const item = await this._itemService.itemRepo
      .createQueryBuilder('item')
      .leftJoin('item.user', 'user')
      .where('item.id = :id_item', { id_item })
      .getOne();

    if (!item) return { message: `item with id = ${id_item} doesn't exist` };
    const updateItem = await this._itemService.itemRepo.save({
      id: item.id,
      name: name || item.name,
      stock: stock || item.stock,
      imageUrl: imageUrl || item.imageUrl,
    });
    return { message: 'updated item', item: updateItem };
  }
}
