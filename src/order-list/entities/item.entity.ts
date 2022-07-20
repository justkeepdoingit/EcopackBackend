import { Column, Double, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderList } from "./order-list.entity";

@Entity()
export class itemRecords {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    itemid: string
    @Column({ nullable: true, type: 'double precision', default: 0 })
    volume: number
}