import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './system/system.module';
import { ShopModule } from './shop/shop.module';
import { WsModule } from './common/ws';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({ isGlobal: true }),

    // 数据库连接（SQLite）
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'data/sqlite.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // 开发环境自动同步表结构
      logging: process.env.NODE_ENV === 'development',
    }),

    // WebSocket 模块
    WsModule,

    // 业务模块
    SystemModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
