import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [UserModule, DashboardModule, LogModule],
  exports: [UserModule, DashboardModule, LogModule],
})
export class SystemModule {}
