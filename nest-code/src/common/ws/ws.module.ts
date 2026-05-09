import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  providers: [WsGateway, WsService],
  exports: [WsService],
})
export class WsModule {}

// 导出辅助类供其他模块使用
export { WsEntityHelper } from './ws-entity.service';
