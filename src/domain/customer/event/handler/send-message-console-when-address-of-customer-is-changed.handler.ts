import CustomerAddrresChangedEvent from '../customer-address-changed.event';
import EventHandlerInterface from '../../../@shared/event/event-handler.interface';

export default class SendMessageConsoleWhenAddressOfCustomerIsChangedHanddler implements EventHandlerInterface<CustomerAddrresChangedEvent> {

    handle(event: CustomerAddrresChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.Address.toString()}`)
    }

}