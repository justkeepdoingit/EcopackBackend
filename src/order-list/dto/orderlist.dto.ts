export class orderList {
    id?: number
    date: string
    po: string
    so: string
    name: string
    item: string
    itemdesc: string
    qty: number
    lineup: boolean
    converting: boolean
    fg: boolean
    delivery: boolean
    shipqty: number
    prodqty: number
    pendingqty: number
    deliverydate: string
    deliverytime: string
    comment: string
    creasingtime?: string
    printingtime?: string
    dcrtime?: string
    finishrtime?: string
}