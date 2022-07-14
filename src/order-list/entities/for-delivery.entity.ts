import { Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderList } from "./order-list.entity";

@Entity()
export class forDelivery{
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(()=>OrderList, (orders)=>orders.id)
    @Column()
    orderid: number
    @Column()
    itemid: string
    @Column({default: 0})
    qtyship: number
    @Column()
    shipstatus: string
    @Column()
    receipt: string
}