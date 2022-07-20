import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingDTO } from './dto/create-packing-list.dto';
import { packingUpdate } from './dto/update-packing-list.dto';
import { PackingList } from './entities/packing-list.entity';
import { PackingDetails } from './entities/packing-detail.entity';
import { Repository } from 'typeorm';
import { truckDetails } from './entities/truck-details.entity';
import { truckDTO } from './dto/truckDto.dto';
import { OrderList } from 'src/order-list/entities/order-list.entity';
@Injectable()
export class PackingListService {
  constructor(
    @InjectRepository(PackingList)
    private readonly pl: Repository<PackingList>,
    @InjectRepository(PackingDetails)
    private readonly pld: Repository<PackingDetails>,
    @InjectRepository(truckDetails)
    private readonly trucks: Repository<truckDetails>,
    @InjectRepository(OrderList)
    private readonly orders: Repository<OrderList>,
  ) { }


  create(createPackingListDto: PackingDTO) {
    return 'This action adds a new packingList';
  }

  async findAll() {
    return await this.pl.find()
  }

  async getTrucks() {
    return await this.trucks.find();
  }

  async deletePacking(id: number) {
    this.pl.createQueryBuilder().delete().where('id = :plid', { plid: id }).execute();
    this.pld.createQueryBuilder().delete().where('plid = :plid', { plid: id }).execute();
  }

  async findTruck(data: number) {
    return await this.trucks.findOne({ where: { id: data } });
  }

  async saveTruck(data: truckDTO) {
    this.trucks.save(data);
  }

  async savePacking(truck: any, pl: any) {
    let id = await this.pl.createQueryBuilder().select('id').orderBy('id', 'DESC').limit(1).execute();
    let pldid = 1;
    if (id) {
      id.forEach(data => {
        pldid = data.id + 1;
      })
    }

    let pld: any[] = [];

    pl.forEach(data => {
      let newData = {
        plid: pldid,
        orderid: data.orderid,
        qtydeliver: data.qtydeliver
      }
      pld.push(newData);
    })

    let newTruck = {
      id: pldid,
      name: truck.name,
      truck: truck.truck,
      date: truck.date,
      capacity: truck.capacity,
      total: truck.total,
      percent: truck.percent
    }

    this.pl.save(newTruck)
    this.pld.save(pld)
  }

  findOne(id: number) {
    return `This action returns a #${id} packingList`;
  }

  async findPl(id: number) {
    // let pld = await this.pld.find({ where: { plid: id } })
    let query = await this.orders.
      query(
        `SELECT orders.id,orders.date,orders.po,orders.name,orders.item,orders.itemdesc,orders.qty,pld.qtydeliver,records.volume FROM packing_details as pld INNER JOIN order_list as orders ON pld.orderid=orders.id INNER JOIN item_records as records ON records.itemid=orders.item WHERE pld.plid = ${id}`
      );
    return query
  }

  update(id: number, updatePackingListDto: packingUpdate) {
    return `This action updates a #${id} packingList`;
  }

  remove(id: number) {
    return `This action removes a #${id} packingList`;
  }
}
