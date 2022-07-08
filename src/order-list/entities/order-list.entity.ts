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
    @Column({nullable: true, type: 'date'})
    lineuptime: string
    @Column({nullable: true, type: 'date'})
    converttime: string
    @Column({nullable: true, type: 'date'})
    fgtime: string
    @Column({nullable: true, type: 'date'})
    lastedited: string
    @Column({default: false})
    c: boolean
    @Column({default: false})
    p: boolean
    @Column({default: false})
    o: boolean
    @Column({default: false})
    f: boolean
}
