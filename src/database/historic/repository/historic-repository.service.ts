import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoricEntity } from '../model/historic-entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoricRepositoryService {
  constructor(
    @InjectRepository(HistoricEntity)
    private _changeRepo: Repository<HistoricEntity>,
  ) {}

  get changeRepo(): Repository<HistoricEntity> {
    return this._changeRepo;
  }
}
