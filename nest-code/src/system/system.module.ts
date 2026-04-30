import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [UserModule, DashboardModule],
  exports: [UserModule, DashboardModule],
})
export class SystemModule {}
