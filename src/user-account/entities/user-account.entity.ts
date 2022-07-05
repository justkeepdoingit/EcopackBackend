import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class UserAccount {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    username: string
    @Column()
    password: string
    @Column({nullable:true})
    firstname: string
    @Column({nullable:true})
    lastname: string
    @Column({default: 0})
    user_rights: number
    @Column({default: false})
    planner: boolean
    @Column({default: false})
    converting: boolean
    @Column({default: false})
    delivery: boolean
    @Column({default: false})
    edit_orders: boolean
    @Column({default: false})
    lineup: boolean
    @Column({default: false})
    fg: boolean
    @Column({default: false})
    returns: boolean
    @Column({default: false})
    status_page: boolean
    @Column({default: false})
    import_orders: boolean
    @Column({default: false})
    useracc: boolean
    @Column({nullable: true})
    contact: string
    @Column({nullable: true})
    email: string
}
