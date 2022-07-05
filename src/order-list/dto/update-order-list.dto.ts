import { PartialType } from '@nestjs/mapped-types';
import { orderList } from './orderlist.dto';

export class UpdateOrderListDto extends PartialType(orderList) {}
