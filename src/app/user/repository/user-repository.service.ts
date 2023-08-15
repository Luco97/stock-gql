import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserEntity } from '../model/user-entity';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity) private _userRepo: Repository<UserEntity>,
  ) {}

  find_and_count_roles(parameters: {
    id_user: number;
    roles: string[];
  }): Promise<number> {
    const { id_user, roles } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .select(['user.id', 'user.type'])
      .where('user.id = :id_user', { id_user })
      .andWhere('user.type IN (:...roles)', { roles })
      .getCount();
  }

  register_user(parameters: {
    email: string;
    username: string;
  }): Promise<number> {
    const { email, username } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .orWhere('user.username = :username', { username })
      .getCount();
  }

  create_user(parameters: {
    email: string;
    username: string;
    password: string;
  }): Promise<UserEntity> {
    const { email, password, username } = parameters;
    return this._userRepo.save(
      this._userRepo.create({
        email,
        password,
        username,
        type: 'basic',
      }),
    );
  }

  find_one_by_email(parameters: { email: string }): Promise<UserEntity> {
    const { email } = parameters;
    return this._userRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.password',
        'user.type',
      ])
      .where('user.email = :email', { email })
      .getOne();
  }
}
