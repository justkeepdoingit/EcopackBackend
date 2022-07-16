import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class itemRecords{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    itemid: string
    @Column({nullable: true, type: 'double precision'})
    volume: number
}