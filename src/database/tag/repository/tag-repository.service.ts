import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TagEntity } from '../model/tag-entity';

@Injectable()
export class TagRepositoryService {
  constructor(
    @InjectRepository(TagEntity) private _tagRepo: Repository<TagEntity>,
  ) {}

  find_all(params: {
    name: string;
    take: number;
    skip: number;
  }): Promise<[TagEntity[], number]> {
    const { skip, take, name } = params;
    return this._tagRepo
      .createQueryBuilder('tag')
      .loadRelationCountAndMap(
        'items.item_count',
        'items.tags',
        'chips',
        (qb) => qb.orderBy('cnt'),
      )
      .where('LOWER(tag.name) like LOWER(:name)', { name: `${name}%` })
      .orderBy('tag.name')
      .take(take || 10)
      .skip(skip || 0)
      .getManyAndCount();
  }

  find_one(ids?: number[], name?: string): Promise<TagEntity[]> {
    return this._tagRepo
      .createQueryBuilder('tag')
      .loadRelationCountAndMap(
        'items.item_count',
        'items.tags',
        'chips',
        (qb) => qb.orderBy('cnt'),
      )
      .where('LOWER(tag.name) = LOWER(:name)', { name })
      .orWhere('tag.id in (:...id)', { id: ids })
      .getMany();
  }

  //   Admins only
  create(name: string, description: string): Promise<TagEntity> {
    return this._tagRepo.save(
      this._tagRepo.create({ name: name.toLowerCase(), description }),
    );
  }

  //   Admins only
  update(id: number, description: string): Promise<UpdateResult> {
    return this._tagRepo.update({ id }, { description });
  }
}
