import { PaymentCreatedEvent, Publisher, Subjects } from '@sharedlib/common'

export class PaymentCreatedPubliser extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
