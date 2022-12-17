import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { RoleGuard } from '../../guards/role.guard';
import { ChangeOutput } from '../outputs/change.output';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { TransformTokenInterceptor } from '../interceptors/transform-token.interceptor';

@Resolver()
export class DeleteItemResolver {
  constructor(private _itemService: ItemRepositoryService) {}

  @Mutation(() => ChangeOutput, {
    name: 'delete_item',
    description: "delete item mutation, only role 'admin' can delete items",
  })
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  @UseInterceptors(TransformTokenInterceptor)
  async delete(
    @Args('id_item', { name: 'id_item' }) id: number,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const id_user = +req.header('user_id');
    const adminID: number = id_user;

    return new Promise<ChangeOutput>((resolve, reject) => {
      this._itemService
        .find_one_item({
          id_item: id,
          id_user: this._itemService.admin_condition(adminID),
        })
        .then((item) => {
          if (!item) resolve({ message: `item with id = ${id} doesn't exist` });
          this._itemService
            .delete_item({ item_id: id })
            .then(() => resolve({ message: 'soft deleted item', item }));
        })
        .catch((error) => reject(error));
    });
  }
}
