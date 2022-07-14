import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@Shared/auth';
import { RoleGuard } from '../../guards/role.guard';
import { UpdateInput } from '../inputs/update.input';
import { ChangeOutput } from '../outputs/change.output';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class UpdateItemResolver {
  constructor(
    private _authService: AuthService,
    private _itemService: ItemRepositoryService,
  ) {}

  @Mutation(() => ChangeOutput)
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async update(
    @Args('item') itemUpdate: UpdateInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;

    const { id_item, imageUrl, name, stock } = itemUpdate;
    const item = await this._itemService.itemRepo
      .createQueryBuilder('item')
      .leftJoin('item.user', 'user')
      .where('item.id = :id_item', { id_item })
      .andWhere('user.id = :id_user', {
        id_user: this._authService.userID(token),
      })
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
