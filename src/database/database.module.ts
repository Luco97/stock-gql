// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from '../shared/auth/auth.module';

// Entities
import { UserEntity } from './user/model/user-entity';
import { ItemEntity } from './item/model/item-entity';
import { HistoricEntity } from './historic/model/historic-entity';

// Services
import { ItemRepositoryService } from './item/repository/item-repository.service';
import { UserRepositoryService } from './user/repository/user-repository.service';
import { HistoricRepositoryService } from './historic/repository/historic-repository.service';

// User resolvers
import { LogInResolver } from './user/resolver/log-in.resolver';
import { SignInResolver } from './user/resolver/sign-in.resolver';

// Items resolvers
import { CreateItemResolver } from './item/resolver/create-item.resolver';
import { ReadItemResolver } from './item/resolver/read-item.resolver';
import { UpdateItemResolver } from './item/resolver/update-item.resolver';
import { DeleteItemResolver } from './item/resolver/delete-item.resolver';

// Historic resolvers
import { ReadHistoricResolver } from './historic/resolver/read-historic.resolver';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        schema: configService.get('DATABASE_SCHEMA'),
        entities: [UserEntity, ItemEntity, HistoricEntity],
        url: configService.get('DATABASE_URL'),
        synchronize:
          configService.get('NODE_ENV') != 'production' ? true : false,
        autoLoadEntities: true,
        logging: 'all',
        extra:
          configService.get('NODE_ENV') == 'production'
            ? {
                ssl: {
                  sslmode: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, ItemEntity, HistoricEntity]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'types.gql',
      persistedQueries: false,  // heroku deploy
      cache: 'bounded',         // heroku deploy
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
    HistoricRepositoryService,
    ReadHistoricResolver,
  ],
})
export class DatabaseModule {}
