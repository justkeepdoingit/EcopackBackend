import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccount } from './user-account/entities/user-account.entity';
import { UserAccountModule } from './user-account/user-account.module';
import { OrderListModule } from './order-list/order-list.module';
import { OrderList } from './order-list/entities/order-list.entity';
import { rejectList } from './order-list/entities/reject-list.entity';
@Module({
  imports: [UserAccountModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    //Replace username and password with what you created when setting up PostgresSQL
    username: 'postgres',
    password: 'jollibeespaghetti',
    database: 'ecopack',
    entities: [UserAccount, OrderList, rejectList],
    synchronize: true,
  }), OrderListModule, UserAccountModule],
  // imports: [UserAccountModule, TypeOrmModule.forRoot({
  //   type: 'postgres',
  //   host: 'ec2-44-205-41-76.compute-1.amazonaws.com',
  //   port: 5432,
  //   //Replace username and password with what you created when setting up PostgresSQL
  //   username: 'mgbozfolocxpeo',
  //   password: '259e81d484a4a9c2d699006d1e812cea64d7600a44f1d2425c6d465974221fa8',
  //   database: 'dastnkhi36oees',
  //   url: 'postgres://mgbozfolocxpeo:259e81d484a4a9c2d699006d1e812cea64d7600a44f1d2425c6d465974221fa8@ec2-44-205-41-76.compute-1.amazonaws.com:5432/dastnkhi36oees',
  //   entities: [UserAccount, OrderList, rejectList],
  //   synchronize: true,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // }), OrderListModule, UserAccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
