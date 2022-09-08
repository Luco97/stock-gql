import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';
import { Brackets } from 'typeorm';

import { AuthService } from '@Shared/auth';
import { RoleGuard } from '../../guards/role.guard';
import { ChangeOutput } from '../outputs/change.output';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class DeleteItemResolver {
  constructor(
    private _authService: AuthService,
    private _itemService: ItemRepositoryService,
  ) {}

  @Mutation(() => ChangeOutput, {
    name: 'delete_item',
    description: "delete item mutation, only role 'admin' can delete items",
  })
  @SetMetadata('roles', ['admin'])
  @UseGuards(RoleGuard)
  async delete(
    @Args('id_item', { name: 'id_item' }) id: number,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const adminID: number = this._authService.userID(token);
    return new Promise<ChangeOutput>((resolve, reject) => {
      this._itemService.itemRepo
        .createQueryBuilder('item')
        .leftJoin('item.user', 'user')
        .where('item.id = :id', { id })
        .andWhere(
          new Brackets((qb) =>
            qb
              .where('user.type = :type', { type: 'basic' })
              .orWhere('user.id = :adminID', { adminID }),
          ),
        )
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
