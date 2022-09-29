import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Brackets } from 'typeorm';

import { ItemEntity } from '../model/item-entity';

@Injectable()
export class ItemRepositoryService {
  constructor(
    @InjectRepository(ItemEntity) private _itemRepo: Repository<ItemEntity>,
  ) {}

  get itemRepo(): Repository<ItemEntity> {
    return this._itemRepo;
  }

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

  find_one_item(parameters: {
    id_item: number;
    id_user: Brackets;
  }): Promise<ItemEntity> {
    const { id_user, id_item } = parameters;
    return this._itemRepo
      .createQueryBuilder('item')
      .leftJoin('item.user', 'user')
      .where('item.id = :id_item', { id_item })
      .andWhere(id_user)
      .getOne();
  }

  find_all_items(parameters: {
    skip: number;
    take: number;
    id_user: number;
    orderBy: string;
    order: 'ASC' | 'DESC';
  }): Promise<[ItemEntity[], number]> {
    const { id_user, order, orderBy, skip, take } = parameters;
    return this._itemRepo
      .createQueryBuilder('items')
      .leftJoinAndSelect('items.user', 'user')
      .where('user.type = :type', { type: 'basic' })
      .orWhere('user.id = :id_user', {
        id_user,
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
  }
}
