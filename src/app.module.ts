import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccount } from './user-account/entities/user-account.entity';
import { UserAccountModule } from './user-account/user-account.module';
import { OrderListModule } from './order-list/order-list.module';
import { OrderList } from './order-list/entities/order-list.entity';
@Module({
  imports: [UserAccountModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    //Replace username and password with what you created when setting up PostgresSQL
    username: 'postgres',
    password: 'jollibeespaghetti',
    database: 'ecopack',
    entities: [UserAccount, OrderList],
    synchronize: true,
  }), OrderListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
