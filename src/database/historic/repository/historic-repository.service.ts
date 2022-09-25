import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Brackets } from 'typeorm';

import { HistoricEntity } from '../model/historic-entity';

@Injectable()
export class HistoricRepositoryService {
  constructor(
    @InjectRepository(HistoricEntity)
    private _changeRepo: Repository<HistoricEntity>,
  ) {}

  get changeRepo(): Repository<HistoricEntity> {
    return this._changeRepo;
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

  get_historic_one_item(parameters: {
    itemId: number;
    id_user: Brackets;
    order: 'ASC' | 'DESC';
  }): Promise<[HistoricEntity[], number]> {
    const { itemId, id_user, order } = parameters;
    return this._changeRepo
      .createQueryBuilder('changes')
      .leftJoin('changes.item', 'item')
      .leftJoin('item.user', 'user')
      .where('item.id = :itemId', { itemId })
      .andWhere(id_user)
      .orderBy(
        'changes.createdAt',
        ['ASC', 'DESC'].includes(order) ? order : 'ASC',
      )
      .getManyAndCount();
  }
}
