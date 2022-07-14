import { Module } from '@nestjs/common';
import { OrderListService } from './order-list.service';
import { OrderListController } from './order-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderList } from './entities/order-list.entity';
import { rejectList } from './entities/reject-list.entity';
import { forDelivery } from './entities/for-delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderList, rejectList, forDelivery])],
  controllers: [OrderListController],
  providers: [OrderListService]
})
export class OrderListModule {}
