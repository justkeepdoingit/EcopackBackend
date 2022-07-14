import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { OrderListService } from './order-list.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { orderList } from './dto/orderlist.dto';
import { Response, Express} from 'express';
import { rejectList } from './entities/reject-list.entity';
import { rejectListDTO } from './dto/rejectList.dto';
import { forDelivery } from './entities/for-delivery.entity';
@Controller('order-list')
export class OrderListController {
  constructor(private readonly orderListService: OrderListService) {}

  @Get('/planners')
  async getPlanners(){
    return await this.orderListService.getPlanner();
  }
  
  @Get('lineupOrders')
  async getLineup(){
    return await this.orderListService.getLineup();
  }

  @Get('fgOrders')
  async getFg(){
    return await this.orderListService.getFg();
  }

  @Get('deliveryorders')
  async getDelivery(){
    return await this.orderListService.getDelivery();
  }

  @Get('convertOrders')
  async getConvert(){
    return await this.orderListService.getConvert();
  }

  @Post('/lineup')
  updateToLineup(@Body() data: orderList[]){
    const date = require('date-and-time')
    data.forEach(element => {
      let newData = {
        lineup: true,
        lineuptime: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        lastedited: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
      }
      this.orderListService.lineup(element.id, newData)
    });
  }

  @Post('/fg')
  updateToFG(@Body() data: orderList[]){
    const date = require('date-and-time')
    data.forEach(element => {
      let newData = {
        fg: true,
        fgtime: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        lastedited: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
      }
      this.orderListService.fg(element.id, newData)
    });
  }

  @Post('/convert')
  updateToCon(@Body() data: orderList[]){
    const date = require('date-and-time')
    data.forEach(element => {
      let newData = {
        converting: true,
        converttime: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        lastedited: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
      }
      this.orderListService.con(element.id, newData)
    });
  }

  @Post('/delivery')
  updateToDelivery(@Body() data: orderList[]){
    const date = require('date-and-time')
    data.forEach(element => {
      let newData = {
        delivery: true,
        status: 'Queue',
        lastedited: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
      }
      this.orderListService.delivery(element.id, newData)
    });
  }

  @Get('/getShipping/:id')
  getShipping(@Param() orderid: number){
    return this.orderListService.shipping(orderid);
  }

  @Post('/updateDelivery')
  postDelivery(@Body() data: any){
    this.orderListService.updateAdd(data);
  }

  @Post('/updateShipping')
  shippingUpdate(@Body() data: forDelivery){
    this.orderListService.updateShipping(data);
  }

  @Post('updateReject/:id')
  updateReject(@Param('id') id:number, @Body() data: rejectList){
    let newData: rejectListDTO = {
      orderid: id,
      creasingr: data.creasingr,
      dcr: data.dcr,
      printingr: data.printingr,
      finishr: data.finishr,
      corr: data.corr,
      corl: data.corl,
      comment: data.comment
    }
    return this.orderListService.updateReject(newData);
  }

  @Get('/getReject/:id')
  getReject(@Param('id') id: number){
    return this.orderListService.getReject(id);
  }

  @Get('/getStatuses')
  getOrderStatus(){
    return this.orderListService.getOrderStatus();
  }

  @Post('/uploads')
  @UseInterceptors(
    FileInterceptor("csv", {
      dest: './csvFileUploaded'
    })
  )
  async fileUploader(@UploadedFile() file: Express.Multer.File, @Res({passthrough: true}) responses: Response){
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

  @Get()
  findAll() {
    return this.orderListService.findAll();
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
  updateOrder(@Param('id') id: number, @Body() updateData: orderList){
    return this.orderListService.update(id, updateData)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderListService.remove(+id);
  }
}
