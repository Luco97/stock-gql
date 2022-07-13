import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@Shared/auth';
import { ReadInput } from '../inputs/read.input';
import { ItemEntity } from '../model/item-entity';
import { AuthGuard } from '../../guards/auth.guard';
import { ItemsOutput } from '../outputs/items.output';
import { ItemRepositoryService } from '../repository/item-repository.service';

@Resolver()
export class ReadItemResolver {
  constructor(
    private _authService: AuthService,
    private _itemService: ItemRepositoryService,
  ) {}

  @Query(() => ItemsOutput)
  @UseGuards(AuthGuard)
  async findAll(
    @Args('paginate', { nullable: true }) getInput: ReadInput,
    @Context() context,
  ): Promise<ItemsOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const [items, count] = await this._itemService.itemRepo
      .createQueryBuilder('items')
      .leftJoin('items.user', 'user')
      .where('user.id = :id_user', {
        id_user: this._authService.userID(token),
      })
      .orderBy()
      .take(getInput?.take || 10)
      .skip(getInput?.skip || 0)
      .getManyAndCount();
    return { items, count };
  }

  @Query(() => ItemEntity)
  @UseGuards(AuthGuard)
  async findOne(
    @Args('id') id_item: Number,
    @Context() context,
  ): Promise<ItemEntity> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    return this._itemService.itemRepo
      .createQueryBuilder('item')
      .leftJoin('item.user', 'user')
      .where('item.id = :id_item', { id_item })
      .andWhere('user.id = :id_user', {
        id_user: this._authService.userID(token),
      })
      .andWhere('user.type = :type', { type: 'basic' })
      .getOne();
  }
}
