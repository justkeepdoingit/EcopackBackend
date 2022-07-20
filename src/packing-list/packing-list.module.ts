import { Module } from '@nestjs/common';
import { PackingListService } from './packing-list.service';
import { PackingListController } from './packing-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackingList } from './entities/packing-list.entity';
import { PackingDetails } from './entities/packing-detail.entity';
import { truckDetails } from './entities/truck-details.entity';
import { OrderList } from 'src/order-list/entities/order-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackingList, PackingDetails, truckDetails, OrderList])],
  controllers: [PackingListController],
  providers: [PackingListService]
})
export class PackingListModule { }
