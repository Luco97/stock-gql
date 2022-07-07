import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserEntity } from '../model/user-entity';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity) private _userRepo: Repository<UserEntity>,
  ) {}

  get userRepo(): Repository<UserEntity> {
    return this._userRepo;
  }
}
