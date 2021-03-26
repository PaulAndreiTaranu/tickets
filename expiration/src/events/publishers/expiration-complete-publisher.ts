import { ExpirationCompleteEvent, Publisher, Subjects } from '@sharedlib/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
