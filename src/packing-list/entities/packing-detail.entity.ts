import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { PackingList } from "./packing-list.entity"
@Entity()
export class PackingDetails {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => PackingList, (pl) => pl.pd)
    pl: PackingList
}