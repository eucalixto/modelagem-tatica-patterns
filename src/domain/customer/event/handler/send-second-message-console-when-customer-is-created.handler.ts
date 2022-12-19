import CustomerCreatedEvent from '../customer-address-changed.event';
import EventHandlerInterface from '../../../@shared/event/event-handler.interface';

export default class SendSecondMessageConsoleWhenCustomerIsCratedHanddler implements EventHandlerInterface<CustomerCreatedEvent> {

    handle(event: CustomerCreatedEvent): void {
        console.log(`Esse é o segundo console.log do evento: CustomerCreated`)
    }

}