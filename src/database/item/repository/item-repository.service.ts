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
}
