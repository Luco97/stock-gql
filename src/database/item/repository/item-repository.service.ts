import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Brackets, UpdateResult, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { ItemEntity } from '../model/item-entity';

@Injectable()
export class ItemRepositoryService {
  constructor(
    @InjectRepository(ItemEntity) private _itemRepo: Repository<ItemEntity>,
  ) {}

  basic_condition(id_user: number): Brackets {
    return new Brackets((qb) =>
      qb.where('user.id = :id_user', {
        id_user, // OR changes from actual user
      }),
    );
  }

  admin_condition(id_user: number): Brackets {
    return new Brackets((qb) =>
      qb
        .where('user.type = :type', { type: 'basic' }) // changes from normal user
        .orWhere('user.id = :id_user', {
          id_user, // OR changes from actual admin user
        }),
    );
  }

  create_item(parameters: {
    name: string;
    imageUrl: string;
    stock: number;
    price: number;
  }): Promise<ItemEntity> {
    const { name, imageUrl, stock, price } = parameters;
    return this._itemRepo.save(
      this._itemRepo.create({ name, imageUrl, price, stock }),
    );
  }

  create_user_relation(parameters: {
    id_item: number;
    id_user: number;
  }): Promise<void> {
    const { id_item, id_user } = parameters;
    return this._itemRepo
      .createQueryBuilder('item')
      .relation('user')
      .of(id_item)
      .set(id_user);
  }

  find_random(): Promise<ItemEntity> {
    return this._itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.user', 'user')
      .leftJoinAndSelect('items.tags', 'tags')
      .loadRelationCountAndMap('tags.item_count', 'tags.items', 'chips', (qb) =>
        qb.orderBy('cnt'),
      )
      .orderBy('RANDOM()')
      .getOne();
  }

  find_one_item(parameters: {
    id_item: number;
    id_user: Brackets;
  }): Promise<ItemEntity> {
    const { id_user, id_item } = parameters;
    return this._itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.user', 'user')
      .leftJoinAndSelect('item.tags', 'tags')
      .loadRelationCountAndMap('tags.item_count', 'tags.items', 'chips', (qb) =>
        qb.orderBy('cnt'),
      )
      .where('item.id = :id_item', { id_item })
      .andWhere(id_user)
      .getOne();
  }

  find_all_items(parameters: {
    skip: number;
    take: number;
    orderBy: string;
    id_user: Brackets;
    order: 'ASC' | 'DESC';
    tagIDs?: number[];
  }): Promise<[ItemEntity[], number]> {
    const { id_user, order, orderBy, skip, take, tagIDs } = parameters;
    return this._itemRepo
      .createQueryBuilder('items')
      .leftJoinAndSelect('items.user', 'user')
      .leftJoinAndSelect('items.tags', 'tags')
      .loadRelationCountAndMap('tags.item_count', 'tags.items', 'chips', (qb) =>
        qb.orderBy('cnt'),
      )
      .where(id_user)
      .orWhere('tags.id in (:...tagIDs)', { tagIDs: tagIDs || [] })
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
  }

  update_item(update_item: DeepPartial<ItemEntity>): Promise<ItemEntity> {
    return this._itemRepo.save(update_item);
  }

  update(
    item_id: number,
    partialUpdate: QueryDeepPartialEntity<ItemEntity>,
  ): Promise<UpdateResult> {
    return this._itemRepo.update({ id: item_id }, partialUpdate);
  }

  update_tags(id: number, tagsIn: number[], tagsOut: number[]): Promise<void> {
    return this._itemRepo
      .createQueryBuilder('item')
      .relation('tags')
      .comment('add tags')
      .of(id)
      .addAndRemove(tagsIn, tagsOut);
  }

  delete_item(parameters: { item_id: number }): Promise<UpdateResult> {
    const { item_id } = parameters;
    return this._itemRepo.softDelete({ id: item_id });
  }

  find_related(parameters: {
    skip: number;
    take: number;
    orderBy: string;
    id_user: number;
    order: 'ASC' | 'DESC';
    tagIDs?: number[];
  }): Promise<[ItemEntity[], number]> {
    const { id_user, order, orderBy, skip, take, tagIDs } = parameters;
    return this._itemRepo
      .createQueryBuilder('items')
      .leftJoinAndSelect('items.user', 'user')
      .leftJoinAndSelect('items.tags', 'tags')
      .loadRelationCountAndMap('tags.item_count', 'tags.items', 'chips', (qb) =>
        qb.orderBy('cnt'),
      )
      .where('user.id != :id_user', { id_user })
      .andWhere('tags.id in (:...tagIDs)', { tagIDs: tagIDs || [] })
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
  }

  getItem(parameters: {
    type: string;
    id_user: number;
    id_item: number;
  }): Promise<ItemEntity> {
    const { id_item, id_user, type } = parameters;
    let item: Promise<ItemEntity>;
    if (type == 'basic')
      item = this.find_one_item({
        id_item,
        id_user: this.basic_condition(id_user),
      });
    else
      item = this.find_one_item({
        id_item,
        id_user: this.admin_condition(id_user),
      });
    return item;
  }
}
