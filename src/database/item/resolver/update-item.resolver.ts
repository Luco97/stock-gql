import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';
import { Brackets } from 'typeorm';

import {
  UpdateInput,
  UpdateNameInput,
  UpdateImageInput,
  UpdatePriceInput,
  UpdateStockInput,
} from '../inputs/update.input';
import { AuthService } from '@Shared/auth';
import { ItemEntity } from '../model/item-entity';
import { RoleGuard } from '../../guards/role.guard';
import { ChangeOutput } from '../outputs/change.output';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { HistoricRepositoryService } from '../../historic/repository/historic-repository.service';

@Resolver()
export class UpdateItemResolver {
  constructor(
    private _authService: AuthService,
    private _itemService: ItemRepositoryService,
    private _historicService: HistoricRepositoryService,
  ) {}

  @Mutation(() => ChangeOutput, {
    name: 'update_name_item',
    description: 'update name of item mutation',
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async updateName(
    @Args('item') itemNameUpdate: UpdateNameInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const { id_item, name } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, context)
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          this._itemService.itemRepo
            .save({
              id: item.id,
              name,
            })
            .then((updatedItem) => {
              this._historicService
                .create_historic({
                  previousValue: `${item.name}`,
                  change: 'Name',
                })
                .then((change) => {
                  this._historicService
                    .create_item_relation({
                      change_id: change.id,
                      item_id: item.id,
                    })
                    .finally(() => {
                      resolve({
                        message: 'updated item',
                        item: {
                          id: item.id,
                          stock: item.stock,
                          price: item.price,
                          imageUrl: item.imageUrl,
                          createdAt: item.createdAt,
                          // UPDATE elements
                          name: updatedItem.name,
                          updatedAt: updatedItem.updatedAt,
                        },
                      });
                    });
                })
                .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  }

  @Mutation(() => ChangeOutput, {
    name: 'update_stock_item',
    description: 'update stock of one item mutation',
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async updateStock(
    @Args('item') itemNameUpdate: UpdateStockInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const { id_item, stock } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, context)
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          this._itemService.itemRepo
            .save({
              id: item.id,
              stock,
            })
            .then((updatedItem) => {
              this._historicService
                .create_historic({
                  previousValue: `${item.stock}`,
                  change: 'Stock',
                })
                .then((change) => {
                  this._historicService
                    .create_item_relation({
                      change_id: change.id,
                      item_id: item.id,
                    })
                    .finally(() => {
                      resolve({
                        message: 'updated item',
                        item: {
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          imageUrl: item.imageUrl,
                          createdAt: item.createdAt,
                          // UPDATE elements
                          stock: updatedItem.stock,
                          updatedAt: updatedItem.updatedAt,
                        },
                      });
                    });
                })
                .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  }

  @Mutation(() => ChangeOutput, {
    name: 'update_price_item',
    description: 'update price of one item',
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async updatePrice(
    @Args('item') itemNameUpdate: UpdatePriceInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const { id_item, price } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, context)
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          this._itemService.itemRepo
            .save({
              id: item.id,
              price,
            })
            .then((updatedItem) => {
              this._historicService
                .create_historic({
                  previousValue: `${item.price}`,
                  change: 'Price',
                })
                .then((change) => {
                  this._historicService
                    .create_item_relation({
                      change_id: change.id,
                      item_id: item.id,
                    })
                    .finally(() => {
                      resolve({
                        message: 'updated item',
                        item: {
                          id: item.id,
                          name: item.name,
                          stock: item.stock,
                          imageUrl: item.imageUrl,
                          createdAt: item.createdAt,
                          // UPDATE elements
                          price: updatedItem.price,
                          updatedAt: updatedItem.updatedAt,
                        },
                      });
                    });
                })
                .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  }

  @Mutation(() => ChangeOutput, {
    name: 'update_image_item',
    description: 'update the image of one item',
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  async updateImage(
    @Args('item') itemNameUpdate: UpdateImageInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const { id_item, imageUrl } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, context)
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          this._itemService.itemRepo
            .save({
              id: item.id,
              imageUrl,
            })
            .then((updatedItem) => {
              this._historicService
                .create_historic({
                  previousValue: `${item.imageUrl}`,
                  change: 'Image',
                })
                .then((change) => {
                  this._historicService
                    .create_item_relation({
                      change_id: change.id,
                      item_id: item.id,
                    })
                    .finally(() => {
                      resolve({
                        message: 'updated item',
                        item: {
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          stock: item.stock,
                          createdAt: item.createdAt,
                          // UPDATE elements
                          imageUrl: updatedItem.imageUrl,
                          updatedAt: updatedItem.updatedAt,
                        },
                      });
                    });
                })
                .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  }

  async getItem(itemUpdate: UpdateInput, context): Promise<ItemEntity> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const type: string = this._authService.userType(token);
    const { id_item } = itemUpdate;
    let item: Promise<ItemEntity>;
    if (type == 'basic')
      item = this._itemService.itemRepo
        .createQueryBuilder('item')
        .leftJoin('item.user', 'user')
        .where('item.id = :id_item', { id_item })
        .andWhere('user.id = :id_user', {
          id_user: this._authService.userID(token),
        })
        .getOne();
    else
      item = this._itemService.itemRepo
        .createQueryBuilder('item')
        .leftJoin('item.user', 'user')
        .where(
          // Item propio del admin
          new Brackets((qb) =>
            qb
              .where('item.id = :id_item', { id_item })
              .andWhere('user.id = :id_user', {
                id_user: this._authService.userID(token),
              }),
          ),
        )
        .orWhere(
          // Item de un usario basic
          new Brackets((qb) =>
            qb
              .where('item.id = :id_item', { id_item })
              .andWhere('user.type = :type', {
                type: 'basic',
              }),
          ),
        )
        .getOne();
    return item;
  }
}
