import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingDTO } from './dto/create-packing-list.dto';
import { packingUpdate } from './dto/update-packing-list.dto';
import { PackingList } from './entities/packing-list.entity';
import { Repository } from 'typeorm';
@Injectable()
export class PackingListService {
  constructor(
    @InjectRepository(PackingList)
    private readonly pl: Repository<PackingList>
  ) { }


  create(createPackingListDto: PackingDTO) {
    return 'This action adds a new packingList';
  }

  async findAll() {
    return await this.pl.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} packingList`;
  }

  update(id: number, updatePackingListDto: packingUpdate) {
    return `This action updates a #${id} packingList`;
  }

  remove(id: number) {
    return `This action removes a #${id} packingList`;
  }
}
