import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { OrderListService } from './order-list.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { orderList } from './dto/orderlist.dto';
import { Response, Express } from 'express';
import { rejectList } from './entities/reject-list.entity';
import { rejectListDTO } from './dto/rejectList.dto';
import { forDelivery } from './entities/for-delivery.entity';
import { itemRecords } from './entities/item.entity';
import { returnList } from './entities/returnEntity.entity';
@Controller('order-list')
export class OrderListController {
  constructor(private readonly orderListService: OrderListService) { }

  @Get('/planners')
  async getPlanners() {
    return await this.orderListService.getPlanner();
  }

  @Get('lineupOrders')
  async getLineup() {
    return await this.orderListService.getLineup();
  }

  @Get('fgOrders')
  async getFg() {
    return await this.orderListService.getFg();
  }

  @Get('deliveryorders')
  async getDelivery() {
    return await this.orderListService.getDelivery();
  }

  @Get('getPicking/:sw')
  async getPicking(@Param('sw') sw: number) {
    return this.orderListService.getPacking(sw)
  }

  @Get('convertOrders')
  async getConvert() {
    return await this.orderListService.getConvert();
  }

  @Post('/lineup')
  updateToLineup(@Body() data: orderList[]) {
    const date = require('date-and-time')
    try {
      data.forEach(element => {
        let newData = {
          lineup: true,
          lineuptime: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          lastedited: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          orderstatus: 'Lineup'
        }
        // console.log(newData);
        this.orderListService.lineup(element.id, newData)
      });
    } catch (error) {
      console.log("Overload")
    }

  }

  @Post('/fg')
  updateToFG(@Body() data: orderList[]) {
    const date = require('date-and-time')
    try {
      data.forEach(element => {
        let newData = {
          fg: true,
          fgtime: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          lastedited: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          orderstatus: 'Finished Goods'
        }
        this.orderListService.fg(element.id, newData)
      });
    } catch (error) {
      console.log("Overload")
    }

  }

  @Post('/convert')
  updateToCon(@Body() data: orderList[]) {
    const date = require('date-and-time')
    try {
      data.forEach(element => {
        let newData = {
          converting: true,
          converttime: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          lastedited: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          orderstatus: 'Converting'
        }
        this.orderListService.con(element.id, newData)
      });
    } catch (error) {
      console.log("Overload")
    }

  }

  @Post('/delivery')
  updateToDelivery(@Body() data: orderList[]) {
    const date = require('date-and-time')
    try {
      data.forEach(element => {
        let newData = {
          delivery: true,
          shipstatus: 'Queue',
          deliverytime: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          lastedited: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          orderstatus: 'Delivery'
        }
        this.orderListService.delivery(element.id, newData)
      });
    } catch (error) {
      console.log("overload")
    }

  }

  @Get('/getShipping/:id')
  getShipping(@Param() orderid: number) {
    return this.orderListService.shipping(orderid);
  }

  @Get('/getShippingReturn/:id')
  getShippingReturn(@Param() orderid: number) {
    return this.orderListService.shippingReturn(orderid);
  }

  @Get('/getShippingPl/:id')
  getShippingPl(@Param() orderid: number) {
    return this.orderListService.getShippingPl(orderid);
  }

  @Get('getVolume')
  getVolume() {
    return this.orderListService.getVolume()
  }

  @Post('/updateVolume/')
  async updateData(@Body() data: any) {
    this.orderListService.updateVolume(data);
  }

  @Post('/updateDelivery')
  postDelivery(@Body() data: any) {
    this.orderListService.updateAdd(data);
  }

  @Post('/updateShipping')
  shippingUpdate(@Body() data: forDelivery) {
    this.orderListService.updateShipping(data);
  }

  @Post('/updateShippingPl')
  async shippingUpdatePl(@Body() data: any) {
    return await this.orderListService.updateShippingPl(data);
  }

  @Post('updateReject/:id')
  updateReject(@Param('id') id: number, @Body() data: rejectList) {
    let newData: rejectListDTO = {
      orderid: id,
      creasingr: data.creasingr,
      dcr: data.dcr,
      printingr: data.printingr,
      finishr: data.finishr,
      corr: data.corr,
      corl: data.corl,
      comment: data.comment,
    }
    return this.orderListService.updateReject(newData);
  }

  @Post('updatePending')
  updatePending(@Body() data: any) {
    this.orderListService.updatePending(data);
  }

  @Get('/getReject/:id')
  getReject(@Param('id') id: number) {
    return this.orderListService.getReject(id);
  }

  @Get('/getStatuses')
  getOrderStatus() {
    return this.orderListService.getOrderStatus();
  }

  @Post('/uploads')
  @UseInterceptors(
    FileInterceptor("csv", {
      dest: './csvFileUploaded'
    })
  )
  async fileUploader(@UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) responses: Response) {
    const csv = require('csv-parser')
    const fs = require('fs')
    const results = [];
    let message = 'noError'
    await fs.createReadStream(`./csvFileUploaded/${file.filename}`)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        this.orderListService.uploadFile(results)
      });
  }

  @Get('findDr/:receipt')
  findDr(@Param('receipt') dr: string) {
    return this.orderListService.findDr(dr);
  }

  @Post('saveReturn')
  saveReturn(@Body() data: any) {
    data.forEach(returnItems => {
      this.orderListService.saveReturn(returnItems)
    })
  }

  @Post('updateWhole')
  updateWholeData(@Body() updateData: any) {
    const date = require('date-and-time')
    let newUpdate = {
      id: updateData.id,
      date: updateData.date,
      po: updateData.po,
      so: updateData.so,
      name: updateData.name,
      item: updateData.item,
      itemdesc: updateData.itemdesc,
      qty: updateData.qty,
      prodqty: updateData.prodqty,
      lastedited: updateData.lastedited,
      shipstatus: updateData.shipstatus,
      // receipt: updateData.receipt,
      // qtydeliver: updateData.qtydeliver,
      deliverydate: updateData.deliverydate,
      lineup: updateData.lineup,
      converting: updateData.converting,
      fg: updateData.fg,
      delivery: updateData.delivery
    }
    this.orderListService.update(newUpdate.id, newUpdate)
  }

  @Get()
  findAll() {
    return this.orderListService.findAll();
  }

  @Get('exportData')
  exportCsv() {
    return this.orderListService.exportData()
  }

  @Post('deleteData')
  deleteData(@Body() orders: any) {

    orders.forEach(element => {
      this.orderListService.remove(element.id);
    });

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderListDto: UpdateOrderListDto) {
    return this.orderListService.update(+id, updateOrderListDto);
  }

  @Patch('/updateOrder/:id')
  updateOrder(@Param('id') id: number, @Body() updateData: any) {
    if (updateData.prodqty) {
      let machineqtyU = {
        shipqty: updateData.prodqty,
        qty: updateData.qty,
        itemdesc: updateData.itemdesc,
        comment: updateData.comment,
      }
      this.orderListService.updateProd(id, updateData.prodqty)
      this.orderListService.update(id, machineqtyU)
    }
    else if (updateData.c || updateData.p || updateData.o || updateData.f) {
      const date = require('date-and-time')
      let cpofTime = {
        creasingtime: updateData.c ? date.format(new Date(), 'YYYY-MM-DD HH:mm:ss') : null,
        printingtime: updateData.p ? date.format(new Date(), 'YYYY-MM-DD HH:mm:ss') : null,
        dcrtime: updateData.o ? date.format(new Date(), 'YYYY-MM-DD HH:mm:ss') : null,
        finishrtime: updateData.f ? date.format(new Date(), 'YYYY-MM-DD HH:mm:ss') : null,
        c: updateData.c,
        p: updateData.p,
        o: updateData.o,
        f: updateData.f
      }
      // console.log(cpofTime);
      this.orderListService.update(id, cpofTime)
    }
    else if (updateData.shipqty) {
      let qtyUpdate = {
        shipqty: updateData.shipqty,
        qty: updateData.qty,
        itemdesc: updateData.itemdesc,
        comment: updateData.comment,
        prodqty: updateData.shipqty,
        pendingqty: updateData.shipqty
      }
      this.orderListService.update(id, qtyUpdate)
    }
    else {
      this.orderListService.update(id, updateData)
    }

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderListService.remove(+id);
  }
}
