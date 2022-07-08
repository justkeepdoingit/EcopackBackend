import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { orderList } from './dto/orderlist.dto';
import { rejectListDTO } from './dto/rejectList.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { OrderList } from './entities/order-list.entity';
import { rejectList } from './entities/reject-list.entity';
// import date from 'date-and-time'
@Injectable()
export class OrderListService {

  constructor(
    @InjectRepository(OrderList)
    private orders: Repository<OrderList>,
    @InjectRepository(rejectList)
    private reject: Repository<rejectList>
  ){

  }

  async uploadFile(data: any){
    try {
      let Id = await this.orders.query('SELECT * FROM order_list ORDER BY id DESC LIMIT 1');
      let orderId = Id[0].id;
      let uploadData: any[] = data;

      let saveData: any[] = [];
      const date = require('date-and-time');
      uploadData.forEach(item=>{
        orderId++;
        if(item.Item){
          let newData = {
            id: orderId,
            date: date.format(new Date(item.Date), 'YYYY-MM-DD'),
            so: item.Num,
            po: item['P. O. #'],
            name: item.Name,
            item: item.Item,
            itemdesc: item['Item Description'],
            qty: Math.abs(parseInt(item.Qty))
          }
        saveData.push(newData);  
      }
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

  getConvert(){
    return this.orders.createQueryBuilder().
    where('lineup = true AND converting = true AND fg = false AND delivery = false').
    getMany()
  }

  async getReject(id: number){
    let rejects = await this.reject.createQueryBuilder().
    where('orderid = :id',{
      id: id
    }).getOne()
    return rejects;
  }

  async updateReject(data: rejectListDTO){
    let checkReject = await this.reject.createQueryBuilder().
    where('orderid = :id',{
      id: data.orderid
    }).getOne()

    if(checkReject){
      this.reject.update({orderid: data.orderid}, data)
    }
    else{
      this.reject.save(data);
    }
  }

  async getOrderStatus(){
    let orders = await this.orders.query(
      'SELECT COUNT(CASE WHEN lineup = false AND converting = false AND fg = false AND delivery = false THEN id END) as planning,' +
      'COUNT(CASE WHEN lineup = true AND converting = false AND fg = false AND delivery = false THEN id END) as lineup,' +
      'COUNT(CASE WHEN lineup = true AND converting = true AND fg = false AND delivery = false THEN id END) as convert,' +
      'COUNT(CASE WHEN lineup = true AND converting = true AND fg = true AND delivery = false THEN id END) as fg,' +
      'COUNT(CASE WHEN lineup = true AND converting = true AND fg = true AND delivery = true THEN id END) as delivery FROM order_list'
      )
      return orders
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
