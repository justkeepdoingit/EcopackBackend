import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingDetails } from 'src/packing-list/entities/packing-detail.entity';
import { PackingList } from 'src/packing-list/entities/packing-list.entity';
import { Not, Repository } from 'typeorm';
import { deliveryDto } from './dto/delivery.dto';
import { deliveryModel } from './dto/deliverymode.model';
import { rejectListDTO } from './dto/rejectList.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { forDelivery } from './entities/for-delivery.entity';
import { itemRecords } from './entities/item.entity';
import { OrderList } from './entities/order-list.entity';
import { rejectList } from './entities/reject-list.entity';
import { returnList } from './entities/returnEntity.entity';
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
    private itemRecords: Repository<itemRecords>,
    @InjectRepository(returnList)
    private returnlist: Repository<returnList>,
    @InjectRepository(PackingDetails)
    private readonly pld: Repository<PackingDetails>
  ) {

  }

  async uploadFile(data: any) {
    try {
      let uploadData: any[] = data;
      let saveData: any[] = [];
      let uniqueData: any[] = [];

      const date = require('date-and-time');

      uploadData.forEach(item => {
        if (item.Item) {
          let newData = {
            date: date.format(new Date(item.Date), 'YYYY-MM-DD'),
            so: item.Num,
            po: item['P. O. #'],
            name: item.Name,
            item: item.Item,
            itemdesc: item['Item Description'],
            qty: Math.abs(parseInt(item.Qty)),
            orderstatus: 'Planner'
          }
          saveData.push(newData);
        }
      })

      saveData.forEach(data => {
        let a = uniqueData.length;
        let check = false;
        if (uniqueData.length == 0) {
          uniqueData.push(data)
        }
        for (let i = 0; i < a; i++) {
          if (uniqueData[i].itemid == data.item) {
            check = true;
          }
        }
        if (!check) {
          uniqueData.push({ itemid: data.item });
        }
      })
      uniqueData.splice(0, 1)
      this.itemRecords.save(uniqueData)
      this.orders.save(saveData);

      return 'Success'
    }
    catch (error) {
      return 'Error'
    }
  }

  lineup(id: number, data: any) {
    this.orders.update(id, data)
  }
  fg(id: number, data: any) {
    this.orders.update(id, data)
  }
  con(id: number, data: any) {
    this.orders.update(id, data)
  }
  delivery(id: number, data: any) {
    this.orders.update(id, data)
  }

  async getPlanner() {
    return await this.orders.createQueryBuilder().
      where('lineup = false AND converting = false AND fg = false AND delivery = false').
      getMany()
  }

  async getLineup() {
    return await this.orders.createQueryBuilder().
      where('lineup = true AND converting = false AND fg = false AND delivery = false').
      getMany()
  }

  async getConvert() {
    return await this.orders.createQueryBuilder().
      where('lineup = true AND converting = true AND fg = false AND delivery = false').
      getMany()
  }

  async getFg() {
    return await this.orders.createQueryBuilder().
      where('lineup = true AND fg = true AND delivery = false').
      getMany()
  }

  async getVolume() {
    return this.itemRecords.find();
  }

  async updateVolume(data: any) {
    // return this.itemRecords.createQueryBuilder().update().
    //   set({ volume: data.volume }).
    //   where('itemid = :item', { item: data.itemid }).
    //   execute()
    return this.itemRecords.update({ itemid: data.itemid }, data)
  }

  async getDelivery() {

    let delivery: any = await this.orders.createQueryBuilder('orders').
      innerJoinAndSelect('orders.id', 'delivery').
      where("orders.lineup = true AND orders.fg = true AND orders.delivery = true AND orders.shipstatus = 'Partial Delivery'").
      getMany()

    let returnData: deliveryModel[] = [];

    let a = 0;
    delivery.forEach(element => {
      let partial: deliveryModel;
      let delievryqty = 0;
      try {
        if (element.id.length > 0) {
          for (let i = 0; i < element.id.length; i++) {
            delievryqty += element.id[i].qtyship;
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

    queuedData.forEach(data => {
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

  async updatePending(data: any) {
    let currentPending = await this.orders.findOne({ where: { id: data.id } })
    let newPending = currentPending.prodqty - data.pendingqty;

    let update = {
      pendingqty: data.pendingqty
    }

    this.orders.update(+data.id, update);
  }

  async getPacking(sw: number) {
    let query: any;
    if (sw == 1) {
      query = await this.orders.
        query(
          `SELECT SUM(details.qtydeliver) as qtydeliver, list.prodqty, list.id, list.date, list.so, list.po, list.name, list.item, list.itemdesc, list.qty, list.pendingqty, MAX(item.volume) as volume FROM order_list AS list LEFT JOIN item_records AS item ON list.item=item.itemid LEFT JOIN packing_details as details ON details.orderid=list.id WHERE list.delivery = true AND (list.shipstatus = 'Queue' OR list.shipstatus = 'Partial Delivery')  GROUP BY list.id`
        );
    }
    else {
      query = await this.orders.
        query(
          `SELECT SUM(details.qtydeliver) as qtydeliver, list.prodqty, list.id, list.date, list.so, list.po, list.name, list.item, list.itemdesc, list.qty,list.shipstatus, list.pendingqty, MAX(item.volume) as volume FROM order_list AS list LEFT JOIN item_records AS item ON list.item=item.itemid LEFT JOIN packing_details as details ON details.orderid=list.id GROUP BY list.id`
        );
    }

    let queryData: any[] = []
    let i = 0;
    query.forEach(t => {
      let partial = {}
      queryData.filter(data => {
        if (data.id == t.id && data.volume == 0) {
          queryData.splice(i, 1)
        }
      })
      let qtys = t.qtydeliver == null ? 0 : parseInt(t.qtydeliver);
      if (t.shipstatus == 'Delivery Complete') {
        return
      }
      else {
        partial = {
          id: t.id,
          date: t.date,
          so: t.so,
          po: t.po,
          name: t.name,
          item: t.item,
          itemdesc: t.itemdesc,
          qty: t.qty,
          pendingqty: (t.pendingqty - qtys),
          volume: t.volume,
          volumet: (t.pendingqty * t.volume)
        }
      }
      queryData.push(partial)
      i++
    });
    return queryData;
  }

  async updateAdd(data: any) {
    let shipStatus: deliveryDto = {
      receipt: data.receipt,
      orderid: data.orderid,
      itemid: data.itemid,
      qtyship: data.qty,
      shipstatus: data.status,
      deliverydate: data.deliverydate
    }

    let updateStatus = {
      shipstatus: data.status
    }

    let checkStatus = await this.orders.createQueryBuilder().
      select('shipstatus').
      where('id = :id', {
        id: data.orderid
      }).execute()

    if (checkStatus[0].shipstatus == 'Queue') {
      this.orders.update({ id: data.orderid }, updateStatus);
    }
    else if (checkStatus[0].shipstatus == 'Partial Delivery') {
      null
    }

    this.fordelivery.save(shipStatus);
  }

  async updateShipping(data: any) {
    let shipStatus: any = {
      qtyship: data.qtyship,
      shipstatus: data.shipstatus,
      deliverydate: data.deliverydate
    }

    let updateStatus = {
      shipstatus: data.status
    }

    this.fordelivery.update({ id: data.id }, shipStatus)
    this.orders.update({ id: data.orderid }, updateStatus)
  }

  async updateShippingPl(outerData: any) {

    let id2 = await this.fordelivery.createQueryBuilder().select('id').orderBy('id', 'DESC').limit(1).execute();
    let fdid = 1;

    outerData.forEach(async data => {
      if (data.id) {
        let shipStatus: any = {
          receipt: data.receipt,
          qtyship: data.qtyship,
          shipstatus: data.shipstatus,
          deliverydate: data.deliverydate,
        }
        this.fordelivery.update({ id: data.id }, shipStatus)
        let newData = {
          qtydeliver: parseFloat(data.qtyship)
        }
        this.pld.update({ fdid: data.id }, newData)
      }
      else {
        let delivery = {
          orderid: data.orderid,
          itemid: data.itemid,
          qtyship: data.qtyship,
          shipstatus: data.shipstatus,
          receipt: data.receipt,
          deliverydate: data.deliverydate,
          orderidId: data.orderid
        }
        this.fordelivery.save(delivery)

        let updateOrder = {
          lineup: true,
          converting: true,
          fg: true,
          delivery: true,
          shipstatus: 'Partial Delivery'
        }
        this.orders.update({ id: data.orderid }, updateOrder)

        if (id2) {
          fdid = id2[0].id++;
        }

        let qtyUpdate = {
          qtydeliver: data.qtyship,
          fdid: fdid
        }

        this.pld.update({ id: data.pl }, qtyUpdate)
      }
    })
    let plid = await this.pld.findOne({ where: { id: outerData[0].pl } })

    setTimeout(() => {
      return this.getShippingPl({ id: plid.plid });
    }, 300);
  }

  async shipping(orderid: any) {
    let data = await this.fordelivery.createQueryBuilder().
      where('orderid = :id', {
        id: orderid.id
      }).execute()

    return data;
  }

  async findNoDelivered() {
    let orders = await this.orders.find()
    return orders.filter(data => {
      return data.shipstatus != 'Complete Delivery'
    })
  }
  async findDelivered() {
    let orders = await this.orders.find()
    return orders.filter(data => {
      return data.shipstatus == 'Complete Delivery'
    })
  }

  async shippingReturn(id: any) {
    let query = await this.returnlist.query
      (`SELECT fd.deliverydate as deliverydate, fd.qtyship as qtyship, fd.receipt as receipt, rl.qtyreturn as qtyreturn, rl.reason as reason
      FROM for_delivery as fd LEFT JOIN return_list as rl ON fd.receipt=rl.receipt WHERE fd.orderid = ${id.id}
    `)

    let returnData: any[] = [];
    query.forEach(data => {
      returnData.push(data);
    })

    return returnData;
  }


  async getShippingPl(id: any) {
    let query = await this.orders.query(`SELECT dl.receipt as receipt,dl.id as id,ol.id as orderid, ol.so as so,ol.po as po,ol.name as name,ol.item as item,
        ol.itemdesc as itemdesc, ds.qtydeliver as qtyship, ds.id as pl, dl.shipstatus as shipstatus
        FROM packing_details as ds LEFT JOIN order_list as ol
        ON ol.id=ds.orderid LEFT JOIN for_delivery as dl ON dl.id=ds.fdid
        WHERE ds.plid = ${id.id}
      `)
    let returnData: any[] = [];
    query.forEach(data => {
      returnData.push(data);
    })
    return returnData;
  }

  async getReject(id: number) {
    let rejects = await this.reject.createQueryBuilder().
      where('orderid = :id', {
        id: id
      }).getOne()
    return rejects;
  }

  updateRejectTime(id: number, rejectTime: any) {
    try {
      this.reject.update(+id, rejectTime);
    } catch (err) {
      return 'No Records For Reject Yet'
    }
  }

  async updateReject(data: rejectListDTO) {
    let checkReject = await this.reject.createQueryBuilder().
      where('orderid = :id', {
        id: data.orderid
      }).getOne()

    if (checkReject) {
      this.reject.update({ orderid: data.orderid }, data)
    }
    else {
      this.reject.save(data);
    }

    let machineqty = await this.orders.findOne({
      select: ['shipqty'],
      where: [{ id: data.orderid }]
    })

    let newProdQty = machineqty.shipqty - data.corl - data.corr - data.creasingr - data.dcr - data.dcr - data.finishr - data.printingr;
    let newPending = machineqty.shipqty - data.corl - data.corr - data.creasingr - data.dcr - data.dcr - data.finishr - data.printingr;
    this.orders.update({ id: data.orderid }, { prodqty: newProdQty, pendingqty: newPending })
  }

  async updateProd(id: number, machine: number) {

    let rejects: rejectList = await this.reject.findOne({
      where: [{ orderid: id }]
    })

    let newProdQty = machine;
    if (rejects) {
      newProdQty = machine - rejects.corl - rejects.corr - rejects.creasingr - rejects.dcr - rejects.dcr - rejects.finishr - rejects.printingr;
    }
    this.orders.update({ id: id }, { prodqty: newProdQty })
  }

  async getOrderStatus() {
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
    return this.orders.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} orderList`;
  }

  update(id: number, updateData: any) {
    return this.orders.update(id, updateData)
  }

  exportData() {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i <= 10; i++) {
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    const date = new Date()
    const utc = date.toDateString()
    this.orders.query(`COPY order_list TO 'C:/tmp/${text}_${utc}.CSV' DELIMITER ',' CSV HEADER`)

    setTimeout(() => {
      var fs = require('fs')

      var oldPath = `C:/tmp/${text}_${utc}.CSV`
      var newPath = `C:/Users/amanc/Documents/Angular-Project/ecopack/ecopack-frontend/src/assets/${text}_${utc}.CSV`

      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        // console.log('Successfully renamed - AKA moved!')
      })
    }, 300);


    return [`${text}_${utc}.CSV`]
  }

  async findDr(dr: string) {
    // let drRecord = await this.fordelivery.find({ where: { receipt: dr } });
    let drRecord = await this.fordelivery.query(`
    SELECT ol.name as name, ol.item as item, fd.qtyship as qtyship, ol.id as orderid, rl.qtyreturn as qtyreturn, rl.reason as reason, rl.action as action, rl.returndate as returndate
    FROM order_list as ol LEFT JOIN for_delivery as fd ON 
    fd.orderid=ol.id LEFT JOIN return_list as rl ON fd.orderid=rl.orderid
    WHERE fd.receipt = '${dr}'
    `)
    if (drRecord) {
      return drRecord
    }
    else {
      return null
    }
  }

  async saveReturn(returnItems: returnList) {
    let checking = await this.returnlist.findOne({ where: { orderid: returnItems.orderid } });
    if (checking) {
      this.returnlist.update({ orderid: returnItems.orderid, receipt: returnItems.receipt }, returnItems);
    }
    else {
      this.returnlist.save(returnItems);
    }
  }

  remove(id: number) {
    this.orders.delete(id);
  }
}
