import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { ItemEntity } from '../model/item-entity';
import { RoleGuard } from '../../guards/role.guard';
import { ItemsOutput } from '../outputs/items.output';
import { ReadInput, ReadRelatedInput } from '../inputs/read.input';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { TransformTokenInterceptor } from '../interceptors/transform-token.interceptor';

@Resolver()
export class ReadItemResolver {
  constructor(private _itemService: ItemRepositoryService) {}

  @Query(() => ItemsOutput, {
    name: 'find_all',
    description:
      "find all items query, user gets only their items & admin gets all from 'basic' users and their items",
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  @UseInterceptors(TransformTokenInterceptor)
  async findAll(
    @Args('paginate', {
      nullable: true,
      defaultValue: {},
      name: 'find_all_items',
      description:
        "find all items, if user role is 'basic' response with his items, if user role is 'admin' response with all items from 'basic' users and his items",
    })
    getInput: ReadInput,
    @Context() context,
  ): Promise<ItemsOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { order, orderBy, skip, take } = getInput;
    return new Promise<ItemsOutput>((resolve, reject) => {
      let itemsPromise: Promise<[ItemEntity[], number]>;
      if (type == 'basic')
        itemsPromise = this._itemService.find_all_items({
          skip,
          take,
          order,
          orderBy,
          id_user: this._itemService.basic_condition(id_user),
        });
      else
        itemsPromise = this._itemService.find_all_items({
          skip,
          take,
          order,
          orderBy,
          id_user: this._itemService.admin_condition(id_user),
        });
      return itemsPromise
        .then(([items, count]) => resolve({ items, count }))
        .catch((error) => reject(error));
    });
  }

  @Query(() => [ItemEntity], {
    nullable: true,
    name: 'find_one_item',
    description:
      "find one item, if user role is 'basic' response with his item, if user role is 'admin' response with one item from 'basic' users OR his item",
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  @UseInterceptors(TransformTokenInterceptor)
  async findOne(
    @Args('id') id_item: number,
    @Context() context,
  ): Promise<ItemEntity> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    if (type == 'basic')
      return this._itemService.find_one_item({
        id_item,
        id_user: this._itemService.basic_condition(id_user),
      });
    else
      return this._itemService.find_one_item({
        id_item,
        id_user: this._itemService.admin_condition(id_user),
      });
  }

  @Query(() => ItemEntity, {
    nullable: true,
    name: 'find_some_randoms',
    description: 'some randoms to show in home or somewhere',
  })
  async findRandoms(): Promise<ItemEntity[]> {
    return new Promise<ItemEntity[]>((resolve, reject) => {
      Promise.all([
        this._itemService.find_random(),
        this._itemService.find_random(),
        this._itemService.find_random(),
        this._itemService.find_random(),
        this._itemService.find_random(),
      ]).then((items) => {
        items.forEach((item, index) => {
          item.name = `User ${index + 1}`;
        });
        resolve(items);
      });
    });
  }

  @Query(() => [ItemEntity], {
    description: 'find all items related, related of any user',
  })
  @UseGuards(RoleGuard)
  @UseInterceptors(TransformTokenInterceptor)
  findRelated(
    @Args('paginate', {
      nullable: false,
      name: 'find_all_related',
    })
    getInput: ReadRelatedInput,
    @Context() context,
  ): Promise<ItemsOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { id_item, order, orderBy, skip, take } = getInput;
    return new Promise<ItemsOutput>((resolve, reject) => {
      let item: Promise<ItemEntity>;

      if (type == 'basic')
        item = this._itemService.find_one_item({
          id_item,
          id_user: this._itemService.basic_condition(id_user),
        });
      else
        item = this._itemService.find_one_item({
          id_item,
          id_user: this._itemService.admin_condition(id_user),
        });

      item.then((item) => {
        const tagIDs: number[] = item.tags.map<number>((element) => element.id);
        this._itemService
          .find_related({
            id_user,
            order,
            orderBy,
            skip,
            take,
            tagIDs,
          })
          .then(([items, count]) => resolve({ items, count }));
      });
    });
  }
}
