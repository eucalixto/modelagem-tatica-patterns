import ProductCreatedEvent from '../product-created.event';
import EventHandlerInterface from '../../../@shared/event/event-handler.interface';

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductCreatedEvent> {

    handle(event: ProductCreatedEvent): void {
        console.log(`Sending e-mail to ........`)

    }

}