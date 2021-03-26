import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from '@sharedlib/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) throw new NotFoundError()
        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id })
        // Save the ticket
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        })
        // Ack the message
        msg.ack()
    }
}
