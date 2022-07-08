import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class rejectList{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    orderid: number
    @Column({nullable: true})
    creasingr: number
    @Column({nullable: true})
    printingr: number
    @Column({nullable: true})
    dcr: number
    @Column({nullable: true})
    finishr: number
    @Column({nullable: true})
    corr: number
    @Column({nullable: true})
    corl: number
    @Column({nullable:true})
    comment: string
}