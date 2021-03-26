import { Publisher, Subjects, TicketUpdatedEvent } from "@sharedlib/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
