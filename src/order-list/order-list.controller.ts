import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { OrderListService } from './order-list.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { orderList } from './dto/orderlist.dto';
import { Response, Express} from 'express';
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

  @Post('/lineup')
  updateToLineup(@Body() data: orderList[]){
    data.forEach(element => {
      let newData = {
        lineup: true
      }
      this.orderListService.lineup(element.id, newData)
    });
  }

  @Post('/fg')
  updateToFG(@Body() data: orderList[]){
    data.forEach(element => {
      let newData = {
        fg: true
      }
      this.orderListService.fg(element.id, newData)
    });
  }

  @Post('/convert')
  updateToCon(@Body() data: orderList[]){
    data.forEach(element => {
      let newData = {
        fg: true
      }
      this.orderListService.con(element.id, newData)
    });
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
          // console.log(results);
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
