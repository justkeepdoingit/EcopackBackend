import { PartialType } from '@nestjs/mapped-types';
import { truckDTO } from './truckDto.dto';

export class updateTruck extends PartialType(truckDTO) { }