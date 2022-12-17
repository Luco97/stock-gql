import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { ItemEntity } from '../model/item-entity';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateInput } from '../inputs/create.input';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { TransformTokenInterceptor } from '../interceptors/transform-token.interceptor';

@Resolver()
export class CreateItemResolver {
  constructor(private _itemService: ItemRepositoryService) {}

  @Mutation(() => ItemEntity, {
    name: 'create_item',
    description: 'mutation for item creation',
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(TransformTokenInterceptor)
  async create(
    @Args('item', { nullable: true }) createInput: CreateInput,
    @Context() context,
  ): Promise<ItemEntity> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { name, imageUrl, stock, price } = createInput;
    return new Promise<ItemEntity>((resolve, reject) => {
      this._itemService
        .create_item({ name, imageUrl, price, stock })
        .then((newItem) => {
          this._itemService
            .create_user_relation({ id_user, id_item: newItem.id })
            .then(() => resolve(newItem))
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  }
}
