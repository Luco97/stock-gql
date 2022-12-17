import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import {
  UpdateInput,
  UpdateNameInput,
  UpdateImageInput,
  UpdatePriceInput,
  UpdateStockInput,
} from '../inputs/update.input';
import { Update } from '../inputs/update.input';
import { ItemEntity } from '../model/item-entity';
import { RoleGuard } from '../../guards/role.guard';
import { ChangeOutput } from '../outputs/change.output';
import { HistoricEntity } from '../../historic/model/historic-entity';
import { ItemRepositoryService } from '../repository/item-repository.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { HistoricRepositoryService } from '../../historic/repository/historic-repository.service';
import { TransformTokenInterceptor } from '../interceptors/transform-token.interceptor';

@Resolver()
export class UpdateItemResolver {
  constructor(
    private _itemService: ItemRepositoryService,
    private _historicService: HistoricRepositoryService,
  ) {}

  @Mutation(() => ChangeOutput, {
    name: 'update_name_item',
    description: 'update name of item mutation',
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  @UseInterceptors(TransformTokenInterceptor)
  async updateName(
    @Args('item') itemNameUpdate: UpdateNameInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { id_item, name } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, { id_user, type })
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          else
            this._itemService
              .update_item({
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
                      })
                      .catch((error) => reject(error));
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
  @UseInterceptors(TransformTokenInterceptor)
  async updateStock(
    @Args('item') itemNameUpdate: UpdateStockInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { id_item, stock } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, { id_user, type })
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          else
            this._itemService
              .update_item({
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
                      })
                      .catch((error) => reject(error));
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
  @UseInterceptors(TransformTokenInterceptor)
  async updatePrice(
    @Args('item') itemNameUpdate: UpdatePriceInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { id_item, price } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, { id_user, type })
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          else
            this._itemService
              .update_item({
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
                      })
                      .catch((error) => reject(error));
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
  @UseInterceptors(TransformTokenInterceptor)
  async updateImage(
    @Args('item') itemNameUpdate: UpdateImageInput,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { id_item, imageUrl } = itemNameUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      this.getItem({ id_item }, { id_user, type })
        .then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          else
            this._itemService
              .update_item({
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
                      })
                      .catch((error) => reject(error));
                  })
                  .catch((error) => reject(error));
              })
              .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  }

  async getItem(
    itemUpdate: UpdateInput,
    userInfo: { type: string; id_user: number },
  ): Promise<ItemEntity> {
    const { id_user, type } = userInfo;
    const { id_item } = itemUpdate;
    let item: Promise<ItemEntity>;
    if (type == 'basic')
      item = this._itemService.find_one_item({
        id_item,
        id_user: this._itemService.basic_condition(id_user),
      });
    // item = this._itemService.itemRepo
    //   .createQueryBuilder('item')
    //   .leftJoin('item.user', 'user')
    //   .where('item.id = :id_item', { id_item })
    //   .andWhere('user.id = :id_user', {
    //     id_user: this._authService.userID(token),
    //   })
    //   .getOne();
    else
      item = this._itemService.find_one_item({
        id_item,
        id_user: this._itemService.admin_condition(id_user),
      });
    return item;
    // item = this._itemService.itemRepo
    //   .createQueryBuilder('item')
    //   .leftJoin('item.user', 'user')
    //   .where('item.id = :id_item', { id_item })
    //   .andWhere(
    //     new Brackets((qb) =>
    //       qb
    //         .where('user.id = :id_user', {
    //           id_user: this._authService.userID(token),
    //         })
    //         .orWhere('user.type = :type', {
    //           type: 'basic',
    //         }),
    //     ),
    //   )
    //   .where(
    //     // Item propio del admin
    //     new Brackets((qb) =>
    //       qb
    //         .where('item.id = :id_item', { id_item })
    //   .andWhere('user.id = :id_user', {
    //     id_user: this._authService.userID(token),
    //   }),
    //     ),
    //   )
    //   .orWhere(
    //     // Item de un usario basic
    //     new Brackets((qb) =>
    //       qb
    //         .where('item.id = :id_item', { id_item })
    //         .andWhere('user.type = :type', {
    //           type: 'basic',
    //         }),
    //     ),
    //   )
    //   .getOne();
  }

  @Mutation(() => ChangeOutput, {
    name: 'update_item',
    description: 'update the image of one item',
  })
  @SetMetadata('roles', ['basic', 'admin'])
  @UseGuards(RoleGuard)
  @UseInterceptors(TransformTokenInterceptor)
  async update(
    @Args('item') itemUpdate: Update,
    @Context() context,
  ): Promise<ChangeOutput> {
    const req: Request = context.req;

    // interceptor values (always in)
    const type: string = req.header('user_type');
    const id_user = +req.header('user_id');

    const { id_item, imageUrl, name, price, stock } = itemUpdate;
    return new Promise<ChangeOutput>((resolve, reject) => {
      const changes: string[] = [];
      const updateItem: QueryDeepPartialEntity<ItemEntity> = {};
      if (name) {
        updateItem['name'] = name;
        changes.push('name');
      }
      if (price) {
        updateItem['price'] = price;
        changes.push('price');
      }
      if (stock) {
        updateItem['stock'] = stock;
        changes.push('stock');
      }
      if (imageUrl) {
        updateItem['imageUrl'] = imageUrl;
        changes.push('imageUrl');
      }

      if (!changes.length) resolve({ message: `nothing to change` });
      else {
        this.getItem({ id_item }, { id_user, type }).then((item) => {
          if (!item)
            resolve({ message: `item with id = ${id_item} doesn't exist` });
          else {
            const historicPromises = changes.map<Promise<HistoricEntity>>(
              (element) =>
                this._historicService.create_historic({
                  change: element,
                  previousValue: `${item[element]}`,
                }),
            );
            this._itemService.update(id_item, updateItem).then(() => {
              Promise.all(historicPromises).then((changesEntity) => {
                const changesRelations = changesEntity.map<Promise<void>>(
                  (element) =>
                    this._historicService.create_item_relation({
                      item_id: id_item,
                      change_id: element.id,
                    }),
                );
                changes.forEach(
                  (element) => (item[element] = updateItem[element]),
                );
                Promise.all(changesRelations).finally(() =>
                  resolve({
                    message: 'updated item',
                    item,
                  }),
                );
              });
            });
          }
        });
      }
    });
  }
}
