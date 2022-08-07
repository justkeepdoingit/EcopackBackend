import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class returnList {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    orderid: number
    @Column()
    qtyreturn: number
    @Column()
    reason: string
    @Column()
    action: string
    @Column({ type: 'date' })
    returndate: string
    @Column()
    receipt: string
}