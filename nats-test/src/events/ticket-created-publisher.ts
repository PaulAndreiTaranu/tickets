import { Publisher } from "./base-publisher"
import { TicketCreatedEvent } from "./ticket-create-event"
import { Subjects } from "./subjects"

export class TicketCreatedPubliser extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}
