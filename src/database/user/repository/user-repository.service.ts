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
