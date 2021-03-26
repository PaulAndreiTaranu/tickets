import { Publisher, Subjects, TicketCreatedEvent } from "@sharedlib/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}
