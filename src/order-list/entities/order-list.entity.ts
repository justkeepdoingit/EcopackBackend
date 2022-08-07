import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { forDelivery } from "./for-delivery.entity";
import { itemRecords } from "./item.entity";
@Entity()
export class OrderList {
    @OneToMany(() => forDelivery, (del) => del.orderid, { cascade: true })
    @PrimaryGeneratedColumn()
    id: number
    @Column({ type: "date" })
    date: string
    @Column({ nullable: true })
    po: string
    @Column({ nullable: true })
    so: string
    @Column()
    name: string
    @Column()
    item: string
    @Column()
    itemdesc: string
    @Column()
    qty: number
    @Column({ default: false })
    lineup: boolean
    @Column({ default: false })
    converting: boolean
    @Column({ default: false })
    fg: boolean
    @Column({ default: false })
    delivery: boolean
    @Column({ nullable: true })
    shipqty: number
    @Column({ nullable: true })
    prodqty: number
    @Column({ nullable: true })
    pendingqty: number
    @Column({ nullable: true, type: 'date' })
    deliverydate: string
    @Column({ nullable: true })
    comment: string
    @Column({ nullable: true, type: 'timestamp' })
    lineuptime: string
    @Column({ nullable: true, type: 'timestamp' })
    converttime: string
    @Column({ nullable: true, type: 'timestamp' })
    fgtime: string
    @Column({ nullable: true, type: 'timestamp' })
    lastedited: string
    @Column({ nullable: true, type: 'timestamp' })
    deliverytime: string
    @Column({ default: false })
    c: boolean
    @Column({ default: false })
    p: boolean
    @Column({ default: false })
    o: boolean
    @Column({ default: false })
    f: boolean
    @Column({ nullable: true })
    shipstatus: string
    @Column({ nullable: true })
    orderstatus: string
    @Column({ nullable: true, type: 'timestamp' })
    creasingtime: string
    @Column({ nullable: true, type: 'timestamp' })
    printingtime: string
    @Column({ nullable: true, type: 'timestamp' })
    dcrtime: string
    @Column({ nullable: true, type: 'timestamp' })
    finishrtime: string
}
