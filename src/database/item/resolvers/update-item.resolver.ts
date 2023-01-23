import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { Request } from 'express';

import { Update } from '../inputs/update.input';
import { ItemEntity } from '../model/item-entity';
import { RoleGuard } from '../../guards/role.guard';
import { UpdateInput } from '../inputs/update.input';
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
    else
      item = this._itemService.find_one_item({
        id_item,
        id_user: this._itemService.admin_condition(id_user),
      });
    return item;
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
            const historicPromises: Promise<HistoricEntity>[] = changes.map<
              Promise<HistoricEntity>
            >((element) =>
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
