import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { ReadInput } from '../inputs/read.input';
import { ItemEntity } from '../model/item-entity';
import { RoleGuard } from '../../guards/role.guard';
import { ItemsOutput } from '../outputs/items.output';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { UserRepositoryService } from '../../user/repository/user-repository.service';

@Resolver()
export class ReadItemsAdminResolver {
  constructor(
    private _itemService: ItemRepositoryService,
    private _userService: UserRepositoryService,
  ) {}

  @Query(() => ItemsOutput, { name: 'findAllAdmin' })
  @SetMetadata('role', 'admin')
  @UseGuards(RoleGuard)
  async findAll(
    @Args('paginate', { nullable: true }) getInput: ReadInput,
  ): Promise<ItemsOutput> {
    const [items, count] = await this._itemService.itemRepo
      .createQueryBuilder('items')
      .leftJoinAndSelect('items.user', 'user')
      .orderBy()
      .take(getInput?.take || 10)
      .skip(getInput?.skip || 0)
      .getManyAndCount();
    return { items, count };
  }

  @Query(() => ItemEntity, { name: 'findOneAdmin' })
  @SetMetadata('role', 'admin')
  @UseGuards(RoleGuard)
  async findOne(
    @Args('id') id_item: Number,
    @Context() context,
  ): Promise<ItemEntity> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    return this._itemService.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.user', 'user')
      .where('item.id = :id_item', { id_item })
      .andWhere('user.type = :type', { type: 'basic' })
      .getOne();
  }
}
