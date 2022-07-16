import { PartialType } from '@nestjs/mapped-types';
import { PackingDTO } from './create-packing-list.dto';

export class packingUpdate extends PartialType(PackingDTO) { }
