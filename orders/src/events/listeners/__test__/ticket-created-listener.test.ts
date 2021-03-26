import { TicketCreatedEvent } from '@sharedlib/common'
import { Types } from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedListener } from '../ticket-created-listener'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)
    // Create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new Types.ObjectId().toHexString(),
        title: 'validTitle',
        price: 10,
        userId: new Types.ObjectId().toHexString(),
    }
    // Create a fake message event
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup()
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    // Write assertion to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    // Write assertion to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})
