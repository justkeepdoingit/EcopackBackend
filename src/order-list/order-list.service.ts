import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { orderList } from './dto/orderlist.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { OrderList } from './entities/order-list.entity';
// import date from 'date-and-time'
@Injectable()
export class OrderListService {

  constructor(
    @InjectRepository(OrderList)
    private orders: Repository<OrderList>
  ){

  }

  async uploadFile(data: orderList[]){
    try {
      let Id = await this.orders.query('SELECT * FROM order_list ORDER BY id DESC LIMIT 1');
      let orderId = Id[0].id;
      let uploadData: orderList[] = data;
      const date = require('date-and-time');
      let saveData: any[] = [];

      uploadData.forEach(item=>{
        orderId++;
        let newData = {
          id: orderId,
          date: date.format(new Date(item.date), 'YYYY-MM-DD'),
          so: item.so,
          po: item.po,
          name: item.name,
          item: item.item,
          itemdesc: item.itemdesc,
          qty: item.qty
        }
        saveData.push(newData);  
    })
    this.orders.save(saveData)
    return 'Success'
    } 
    catch (error) {
      return 'Error'
    }  
  }

  lineup(id: number, data: any){
    this.orders.update(id, data)
  }
  fg(id: number, data: any){
    this.orders.update(id, data)
  }
  con(id: number, data: any){
    this.orders.update(id, data)
  }

  getPlanner(){
    return this.orders.createQueryBuilder().
    where('lineup = false AND converting = false AND fg = false AND delivery = false').
    getMany()
  }

  getLineup(){
    return this.orders.createQueryBuilder().
    where('lineup = true AND converting = false AND fg = false AND delivery = false').
    getMany()
  }

  findAll() {
    return `This action returns all orderList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderList`;
  }

  update(id: number, updateData: UpdateOrderListDto) {
    return this.orders.update(id, updateData)
  }

  remove(id: number) {
    return `This action removes a #${id} orderList`;
  }
}
