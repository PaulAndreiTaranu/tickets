import { OrderCreatedEvent, Publisher, Subjects } from '@sharedlib/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
