import { Listener, NotFoundError, OrderCancelledEvent, Subjects } from '@sharedlib/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { queueGroupName } from './queue-group-name'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // Find the ticket from the cancelled order
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) throw new NotFoundError()
        ticket.set({ orderId: undefined })

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
