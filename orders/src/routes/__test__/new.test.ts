import { OrderStatus } from '@sharedlib/common'
import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('returns an error if the ticket does not exist', async () => {
    const ticketId = Types.ObjectId().toHexString()
    await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId }).expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({ id: Types.ObjectId().toHexString(), title: 'validTitle', price: 10 })
    await ticket.save()
    const order = Order.build({ userId: '123123123', status: OrderStatus.Created, expiresAt: new Date(), ticket })
    await order.save()
    await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id }).expect(400)
})

it('reserves a ticket', async () => {
    const ticket = Ticket.build({ id: Types.ObjectId().toHexString(), title: 'validTitle', price: 10 })
    await ticket.save()
    await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id }).expect(201)
})

it('emits and order created event', async () => {
    const ticket = Ticket.build({ id: Types.ObjectId().toHexString(), title: 'validTitle', price: 10 })
    await ticket.save()
    await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id }).expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
