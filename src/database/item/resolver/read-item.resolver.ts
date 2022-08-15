import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';
import { Brackets } from 'typeorm';

import { AuthService } from '@Shared/auth';
import { ReadInput } from '../inputs/read.input';
import { ItemEntity } from '../model/item-entity';
import { RoleGuard } from '../../guards/role.guard';
import { ItemsOutput } from '../outputs/items.output';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class ReadItemResolver {
  constructor(
    private _authService: AuthService,
    private _itemService: ItemRepositoryService,
  ) {}

  @Query(() => ItemsOutput)
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async findAll(
    @Args('paginate', { nullable: true, defaultValue: {} }) getInput: ReadInput,
    @Context() context,
  ): Promise<ItemsOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const type: string = this._authService.userType(token);
    const { order, orderBy, skip, take } = getInput;
    return new Promise<ItemsOutput>((resolve, reject) => {
      let itemsPromise: Promise<[ItemEntity[], number]>;
      if (type == 'basic')
        itemsPromise = this._itemService.itemRepo
          .createQueryBuilder('items')
          .leftJoin('items.user', 'user')
          .where('user.id = :id_user', {
            id_user: this._authService.userID(token),
          })
          .orderBy(
            `items.${
              ['name', 'stock', 'createdAt', 'updateAt'].includes(orderBy)
                ? orderBy
                : 'createdAt'
            }`,
            ['ASC', 'DESC'].includes(order) ? order : 'ASC',
          )
          .take(take || 10)
          .skip(skip * take || 0)
          .getManyAndCount();
      else
        itemsPromise = this._itemService.itemRepo
          .createQueryBuilder('items')
          .leftJoinAndSelect('items.user', 'user')
          .where('user.type = :type', { type: 'basic' })
          .orWhere('user.id = :id_user', {
            id_user: this._authService.userID(token),
          })
          .orderBy(
            `items.${
              ['name', 'stock', 'createdAt', 'updateAt'].includes(orderBy)
                ? orderBy
                : 'createdAt'
            }`,
            ['ASC', 'DESC'].includes(order) ? order : 'ASC',
          )
          .take(take || 10)
          .skip(skip * take || 0)
          .getManyAndCount();
      return itemsPromise
        .then(([items, count]) => resolve({ items, count }))
        .catch((error) => reject(error));
    });
  }

  @Query(() => ItemEntity, { nullable: true })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async findOne(
    @Args('id') id_item: Number,
    @Context() context,
  ): Promise<ItemEntity> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const type: string = this._authService.userType(token);
    if (type == 'basic')
      return this._itemService.itemRepo
        .createQueryBuilder('item')
        .leftJoin('item.user', 'user')
        .where('item.id = :id_item', { id_item })
        .andWhere('user.id = :id_user', {
          id_user: this._authService.userID(token),
        })
        .getOne();
    else
      return this._itemService.itemRepo
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.user', 'user')
        .where('item.id = :id_item', { id_item })
        .andWhere(
          new Brackets((qb) =>
            qb
              .where('user.type = :type', { type: 'basic' })
              .orWhere('user.id = :id_user', {
                id_user: this._authService.userID(token),
              }),
          ),
        )
        .getOne();
  }
}
