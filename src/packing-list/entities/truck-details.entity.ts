import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class truckDetails {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    plate: string
    @Column()
    desc: string
    @Column()
    ban: string
    @Column({ type: 'double precision' })
    capacity: number
}