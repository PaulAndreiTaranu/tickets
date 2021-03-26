import { OrderStatus } from '@sharedlib/common'
import { Types } from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('marks an order as cancelled', async () => {
    // create a ticket with Ticket Model
    const ticket = Ticket.build({ id: Types.ObjectId().toHexString(), title: 'validTitle', price: 20 })
    await ticket.save()
    const user = global.signin()

    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // make a request to cancel an order
    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204)

    // expect the order to be cancelled
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits and order cancelled event', async () => {
    // create a ticket with Ticket Model
    const ticket = Ticket.build({ id: Types.ObjectId().toHexString(), title: 'validTitle', price: 20 })
    await ticket.save()
    const user = global.signin()

    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // make a request to cancel an order
    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
