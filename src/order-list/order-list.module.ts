import { Module } from '@nestjs/common';
import { OrderListService } from './order-list.service';
import { OrderListController } from './order-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderList } from './entities/order-list.entity';
import { rejectList } from './entities/reject-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderList, rejectList])],
  controllers: [OrderListController],
  providers: [OrderListService]
})
export class OrderListModule {}
