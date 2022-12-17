import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { AuthService } from '@Shared/auth';
import { ReadInput } from '../inputs/read.input';
import { ItemEntity } from '../model/item-entity';
import { RoleGuard } from '../../guards/role.guard';
import { ItemsOutput } from '../outputs/items.output';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { TransformTokenInterceptor } from '../interceptors/transform-token.interceptor';

@Resolver()
export class ReadItemResolver {
  constructor(
    private _authService: AuthService,
    private _itemService: ItemRepositoryService,
  ) {}

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
    // const token: string = req.headers?.authorization;
    // const type: string = this._authService.userType(token);
    // const id_user = this._authService.userID(token);

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

  @Query(() => ItemEntity, {
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
    const token: string = req.headers?.authorization;
    const type: string = this._authService.userType(token);
    const id_user = this._authService.userID(token);
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
}
