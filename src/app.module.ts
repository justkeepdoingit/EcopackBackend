import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccount } from './user-account/entities/user-account.entity';
import { UserAccountModule } from './user-account/user-account.module';
import { OrderListModule } from './order-list/order-list.module';
import { OrderList } from './order-list/entities/order-list.entity';
import { rejectList } from './order-list/entities/reject-list.entity';
import { forDelivery } from './order-list/entities/for-delivery.entity';
import { itemRecords } from './order-list/entities/item.entity';
import { PackingListModule } from './packing-list/packing-list.module';
import { PackingList } from './packing-list/entities/packing-list.entity';
import { PackingDetails } from './packing-list/entities/packing-detail.entity';
import { truckDetails } from './packing-list/entities/truck-details.entity';
import { returnList } from './order-list/entities/returnEntity.entity';
@Module({
  imports: [UserAccountModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    //Replace username and password with what you created when setting up PostgresSQL
    username: 'postgres',
    password: 'jollibeespaghetti',
    database: 'ecopack',
    entities: [UserAccount, OrderList, rejectList, forDelivery, itemRecords, PackingList, PackingDetails, truckDetails, returnList],
    synchronize: true,
  }), OrderListModule, UserAccountModule, PackingListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
