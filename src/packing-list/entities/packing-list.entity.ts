import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { PackingDetails } from "./packing-detail.entity"

@Entity()
export class PackingList {
    @PrimaryGeneratedColumn()
    id: number
    @OneToMany(() => PackingDetails, (details) => details.pl)
    pd: PackingDetails[]
    @Column({ nullable: true })
    name: string
    @Column({ nullable: true })
    truck: string
    @Column({ nullable: true })
    capacity: number
    @Column({ nullable: true })
    total: number
    @Column({ nullable: true })
    percent: number
}
