import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ItemEntity } from '../model/item-entity';

@Injectable()
export class ItemRepositoryService {
  constructor(
    @InjectRepository(ItemEntity) private _itemRepo: Repository<ItemEntity>,
  ) {}

  get itemRepo(): Repository<ItemEntity> {
    return this._itemRepo;
  }
}
