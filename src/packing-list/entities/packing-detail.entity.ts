import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
@Entity()
export class PackingDetails {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    plid: number
    @Column()
    orderid: number
    @Column()
    qtydeliver: number
    @Column({ nullable: true })
    prio: number
    @Column({ nullable: true })
    fdid: number
}