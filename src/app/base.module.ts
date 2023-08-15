// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from '../shared/auth/auth.module';

// Entities
import { TagEntity } from './tag/model/tag-entity';
import { UserEntity } from './user/model/user-entity';
import { ItemEntity } from './item/model/item-entity';
import { HistoricEntity } from './historic/model/historic-entity';

// Services
import { TagRepositoryService } from './tag/repository/tag-repository.service';
import { ItemRepositoryService } from './item/repository/item-repository.service';
import { UserRepositoryService } from './user/repository/user-repository.service';
import { HistoricRepositoryService } from './historic/repository/historic-repository.service';

// User resolvers
import { LogInResolver } from './user/resolver/log-in.resolver';
import { SignInResolver } from './user/resolver/sign-in.resolver';
import { ValidateResolver } from './user/resolver/validate.resolver';

// Items resolvers
import { CreateItemResolver } from './item/resolvers/create-item.resolver';
import { ReadItemResolver } from './item/resolvers/read-item.resolver';
import { UpdateItemResolver } from './item/resolvers/update-item.resolver';
import { DeleteItemResolver } from './item/resolvers/delete-item.resolver';

// Historic resolvers
import { ReadHistoricResolver } from './historic/resolver/read-historic.resolver';

// Tags resolvers
import { ReadResolver } from './tag/resolvers/read.resolver';
import { CreateResolver } from './tag/resolvers/create.resolver';
import { UpdateResolver } from './tag/resolvers/update.resolver';

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
    TypeOrmModule.forFeature([
      UserEntity,
      ItemEntity,
      HistoricEntity,
      TagEntity,
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'types.gql',
      persistedQueries: false, // heroku deploy
      cache: 'bounded', // heroku deploy
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
    ValidateResolver,
    TagRepositoryService,
    ReadResolver,
    CreateResolver,
    UpdateResolver,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformTokenInterceptor,
    // },
  ],
})
export class BaseModule {}
