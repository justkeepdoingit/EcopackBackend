import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackingListService } from './packing-list.service';
import { PackingDTO } from './dto/create-packing-list.dto';
import { packingUpdate } from './dto/update-packing-list.dto';
import { truckDTO } from './dto/truckDto.dto';

@Controller('packing-list')
export class PackingListController {
  constructor(private readonly packingListService: PackingListService) { }

  @Post()
  create(@Body() createPackingListDto: PackingDTO) {
    return this.packingListService.create(createPackingListDto);
  }

  @Get()
  findAll() {
    return this.packingListService.findAll();
  }

  @Post('saveTruck')
  saveTruck(@Body() data: truckDTO) {
    this.packingListService.saveTruck(data);
  }

  @Post('savePacking')
  savePacking(@Body() data: any) {
    let newData = data.data;

    let pl: any[] = []

    data.list.forEach(item => {
      let pushData = {
        orderid: item.orderid,
        qtydeliver: item.qtydeliver
      }
      pl.push(pushData)
    })

    this.packingListService.savePacking(newData, pl)
  }

  @Post('editPacking')
  editPacking(@Body() data: any) {
    this.packingListService.editPacking(data.data, data.list)
  }

  @Get('getTrucks')
  getTrucks() {
    return this.packingListService.getTrucks()
  }

  @Get('findTruckInfo/:id')
  getTruckInfos(@Param('id') id: number) {
    return this.packingListService.findPl(id);
  }

  @Get('findTruck/:id')
  findTrucks(@Param('id') data: number) {
    return this.packingListService.findTruck(data)
  }

  @Delete('deletePacking/:id')
  deletePacking(@Param('id') id: number) {
    this.packingListService.deletePacking(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packingListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackingListDto: packingUpdate) {
    return this.packingListService.update(+id, updatePackingListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packingListService.remove(+id);
  }
}