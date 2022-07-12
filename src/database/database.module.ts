// Modules
import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from '../shared/auth/auth.module';

// Entities
import { UserEntity } from './user/model/user-entity';
import { ItemEntity } from './item/model/item-entity';

// Services
import { ItemRepositoryService } from './item/repository/item-repository.service';

// User respolvers
import { LogInResolver } from './user/resolver/log-in.resolver';
import { SignInResolver } from './user/resolver/sign-in.resolver';
import { UserRepositoryService } from './user/repository/user-repository.service';

// Items respolvers
import { ReadItemResolver } from './item/resolver/read-item.resolver';
import { CreateItemResolver } from './item/resolver/create-item.resolver';
import { DeleteItemResolver } from './item/resolver/delete-item.resolver';
import { UpdateItemResolver } from './item/resolver/update-item.resolver';
import { ReadItemsAdminResolver } from './item/resolver/read-items-admin.resolver';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        schema: 'public',
        entities: [UserEntity, ItemEntity],
        url: configService.get('DATABASE_URL'),
        synchronize: true,
        autoLoadEntities: true,
        logging: 'all',
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, ItemEntity]),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: 'types.gql',
    }),
    AuthModule,
  ],
  providers: [
    UserRepositoryService,
    SignInResolver,
    LogInResolver,
    ItemRepositoryService,
    CreateItemResolver,
    ReadItemResolver,
    UpdateItemResolver,
    DeleteItemResolver,
    ReadItemsAdminResolver,
  ],
})
export class DatabaseModule {}
