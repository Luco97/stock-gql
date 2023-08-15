import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './shared/auth/auth.module';
import { BaseModule } from './app/base.module';

@Module({
  imports: [ConfigModule.forRoot(), BaseModule, AuthModule],
})
export class AppModule {}
