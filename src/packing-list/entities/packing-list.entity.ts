import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { PackingDetails } from "./packing-detail.entity"

@Entity()
export class PackingList {
    @PrimaryColumn()
    id: number
    @Column({ nullable: true })
    name: string
    @Column({ nullable: true })
    truck: string
    @Column({ nullable: true, type: 'double precision' })
    capacity: number
    @Column({ nullable: true, type: 'double precision' })
    total: number
    @Column({ nullable: true, type: 'double precision' })
    percent: number
    @Column({ nullable: true, type: 'date' })
    date: string
    @Column({ default: 0 })
    printed: number
}
