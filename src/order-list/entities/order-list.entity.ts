import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderList {
    @PrimaryGeneratedColumn()
    id: number
    @Column({type: "date"})
    date: string
    @Column({nullable:true})
    po: string
    @Column({nullable:true})
    so: string
    @Column()
    name: string
    @Column()
    item: string
    @Column()
    itemdesc: string
    @Column()
    qty: number
    @Column({default: false})
    lineup: boolean
    @Column({default: false})
    converting: boolean
    @Column({default: false})
    fg: boolean
    @Column({default: false})
    delivery: boolean
    @Column({nullable:true})
    shipqty: number
    @Column({nullable:true, type: 'date'})
    deliverydate: string
    @Column({nullable:true})
    comment: string
}
