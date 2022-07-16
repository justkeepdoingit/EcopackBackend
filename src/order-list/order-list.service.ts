import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { deliveryDto } from './dto/delivery.dto';
import { deliveryModel } from './dto/deliverymode.model';
import { orderList } from './dto/orderlist.dto';
import { rejectListDTO } from './dto/rejectList.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { forDelivery } from './entities/for-delivery.entity';
import { itemRecords } from './entities/item.entity';
import { OrderList } from './entities/order-list.entity';
import { rejectList } from './entities/reject-list.entity';
@Injectable()
export class OrderListService {

  constructor(
    @InjectRepository(OrderList)
    private orders: Repository<OrderList>,
    @InjectRepository(rejectList)
    private reject: Repository<rejectList>,
    @InjectRepository(forDelivery)
    private fordelivery: Repository<forDelivery>,
    @InjectRepository(itemRecords)
    private itemRecords: Repository<itemRecords>
  ){

  }

  async uploadFile(data: any){
    try {
      // let Id = await this.orders.query('SELECT * FROM order_list ORDER BY id DESC LIMIT 1');
      // let orderId = Id.lenght == 0 ? Id[0].id : 0;
      let uploadData: any[] = data;
      let saveData: any[] = [];

      const date = require('date-and-time');
      uploadData.forEach(async item=>{
        if(item.Item){
          let newData = {
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

      let records = await this.itemRecords.find({
        where: [{itemid: item.Item}]
      })     
      let itemData = {
        itemid: item.Item
      }
      if(records.length == 0){
        this.itemRecords.save(itemData)
      }
    })
    this.orders.save(saveData)
    // console.log(saveData);



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
  delivery(id: number, data: any){
    this.orders.update(id, data)
  }

  async getPlanner(){
    return await this.orders.createQueryBuilder().
    where('lineup = false AND converting = false AND fg = false AND delivery = false').
    getMany()
  }

  async getLineup(){
    return await this.orders.createQueryBuilder().
    where('lineup = true AND converting = false AND fg = false AND delivery = false').
    getMany()
  }

  async getConvert(){
    return await this.orders.createQueryBuilder().
    where('lineup = true AND converting = true AND fg = false AND delivery = false').
    getMany()
  }

  async getFg(){
    return await this.orders.createQueryBuilder().
    where('lineup = true AND fg = true AND delivery = false').
    getMany()
  }

  async getDelivery(){

    // let delivery = await this.orders.createQueryBuilder('orders').
    // leftJoinAndSelect('orders.id','orderdata').
    // leftJoinAndMapMany('orders.id',forDelivery,'fororders','orderdata.id=foroders.orderid').
    // getMany();

    // console.log(delivery);

    let delivery: any = await this.orders.createQueryBuilder('orders').
    innerJoinAndSelect('orders.id','delivery').
    where("orders.lineup = true AND orders.fg = true AND orders.delivery = true AND orders.shipstatus = 'Partial Delivery'").
    getMany()
    
    let returnData: deliveryModel[] = [];

    let a = 0;
    delivery.forEach(element => {
      let partial: deliveryModel;
      let delievryqty = 0;
      try {
        if(element.id.length > 0){
          for(let i = 0; i < element.id.length; i++){
            delievryqty+=element.id[i].qtyship;
            partial = {
              id: element.id[i].orderid,
              date: element.date,
              so: element.so,
              po: element.po,
              name: element.name,
              item: element.item,
              itemdesc: element.itemdesc,
              qty: element.qty,
              prodqty: element.prodqty,
              deliverydate: element.deliverydate,
              shipqty: element.shipqty,
              shipstatus: element.shipstatus,
              deliveryqty: delievryqty
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
      a++;
      returnData.push(partial)
    });
    

    let queuedData = await this.orders.createQueryBuilder().
    where("lineup = true AND fg = true AND delivery = true AND (shipstatus = 'Queue')").
    getMany()

    queuedData.forEach(data=>{
      let queue: deliveryModel = {
        id: data.id,
        date: data.date,
        so: data.so,
        po: data.po,
        name: data.name,
        item: data.item,
        itemdesc: data.itemdesc,
        qty: data.qty,
        prodqty: data.prodqty,
        deliverydate: data.deliverydate,
        shipqty: data.shipqty,
        shipstatus: data.shipstatus,
        deliveryqty: 0
      }
      returnData.push(queue);
    })

    return returnData;
  }

  async updateAdd(data:any){
    // console.log(data);
    let shipStatus: deliveryDto= {
      receipt: data.receipt,
      orderid: data.orderid,
      itemid: data.itemid,
      qtyship: data.qty,
      shipstatus: data.status
    }
    
    let updateStatus = {
      shipstatus: data.status
    }

    let checkStatus = await this.orders.createQueryBuilder().
    select('shipstatus').
    where('id = :id', {
      id: data.orderid
    }).execute()

    if(checkStatus[0].shipstatus == 'Queue'){
      this.orders.update({id: data.orderid}, updateStatus);
    }
    else if(checkStatus[0].shipstatus == 'Partial Delivery'){
      null
    }

    this.fordelivery.save(shipStatus);
  }

  async updateShipping(data:any){
    let shipStatus: any = {
      qtyship: data.qtyship,
      shipstatus: data.shipstatus
    }
    
    let updateStatus = {
      shipstatus: data.status
    }

    this.fordelivery.update({id: data.id}, shipStatus)
    this.orders.update({id: data.orderid}, updateStatus)
  }

  async shipping(orderid: any){
    let data = await this.fordelivery.createQueryBuilder().
    where('orderid = :id',{
      id: orderid.id
    }).execute()

    return data;
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
    
    let machineqty = await this.orders.findOne({
      select: ['shipqty'],
      where: [{id: data.orderid}]
    })
    
    let newProdQty = machineqty.shipqty-data.corl-data.corr-data.creasingr-data.dcr-data.dcr-data.finishr-data.printingr;

    this.orders.update({id: data.orderid}, {prodqty: newProdQty})
  }

  async updateProd(id:number, machine:number){

    let rejects: rejectList = await this.reject.findOne({
      where: [{orderid: id}]
    })

    let newProdQty = machine;
    if(rejects){
      newProdQty = machine-rejects.corl-rejects.corr-rejects.creasingr-rejects.dcr-rejects.dcr-rejects.finishr-rejects.printingr;
    }
    this.orders.update({id: id}, {prodqty: newProdQty})
  }

  async getOrderStatus(){
    let orders = await this.orders.query(
      'SELECT COUNT(CASE WHEN lineup = false AND converting = false AND fg = false AND delivery = false THEN id END) as planning,' +
      'COUNT(CASE WHEN lineup = true AND converting = false AND fg = false AND delivery = false THEN id END) as lineup,' +
      'COUNT(CASE WHEN lineup = true AND converting = true AND fg = false AND delivery = false THEN id END) as convert,' +
      'COUNT(CASE WHEN lineup = true AND fg = true AND delivery = false THEN id END) as fg,' +
      'COUNT(CASE WHEN lineup = true AND fg = true AND delivery = true THEN id END) as delivery FROM order_list'
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
