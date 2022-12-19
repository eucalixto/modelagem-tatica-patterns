import EventDispatcher from './event-dispatcher'
import SendEmailWhenProductIsCreatedHandler from '../../product/event/handler/send-email-when-product-is-created.handler';
import SendFirstMessageConsoleWhenCustomerIsCratedHanddler from '../../customer/event/handler/send-first-message-console-when-customer-is-created.handler'
import SendSecondMessageConsoleWhenCustomerIsCratedHanddler from '../../customer/event/handler/send-second-message-console-when-customer-is-created.handler'
import SendMessageConsoleWhenAddressOfCustomerIsChangedHanddler from '../../customer/event/handler/send-message-console-when-address-of-customer-is-changed.handler'
import ProductCreatedEvent from '../../product/event/product-created.event';
import CustomerCreatedEvent from '../../customer/event/customer-created.event';
import CustomerAddrresChangedEvent from '../../customer/event/customer-address-changed.event';
import Customer from '../../customer/entity/customer';
import Address from '../../customer/entity/address';

describe("Domain events tests", () => {
    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    });


    it("should unregister an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unRegister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);

    });

    it("should unregister all events handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unRegisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();

    });


    it("should notify handlers when a product is created", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Prodcut 1", 
            description: "Product 1 description", 
            price: 10.0
        });

        eventDispatcher.notify(productCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();

    });

    
    it("should register an customer event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendFirstMessageConsoleWhenCustomerIsCratedHanddler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

    });


    it("should notify handlers when a customer is created", () => {

        const eventDispatcher = new EventDispatcher();

        const firstEventHandler = new SendFirstMessageConsoleWhenCustomerIsCratedHanddler();
        const spyFirstEventHandler = jest.spyOn(firstEventHandler, "handle");

        const secondEventHandler = new SendSecondMessageConsoleWhenCustomerIsCratedHanddler();
        const spySecondEventHandler = jest.spyOn(secondEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
    
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "123456",
            name: "John", 
            address: {
                street: "street 1",
                number: 123,
                zip: "12345-678",
                city: "São Paulo",
            },
            active: true,
            rewardPoints: 0, 
        });

        eventDispatcher.notify(customerCreatedEvent);
        expect(spyFirstEventHandler).toHaveBeenCalledWith(customerCreatedEvent)
        expect(spySecondEventHandler).toHaveBeenCalledWith(customerCreatedEvent);

    });

    it("should notify handlers when a addres of customer is changed", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler = new SendMessageConsoleWhenAddressOfCustomerIsChangedHanddler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddrresChangedEvent", eventHandler);
       

        expect(eventDispatcher.getEventHandlers["CustomerAddrresChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddrresChangedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddrresChangedEvent"][0]).toMatchObject(eventHandler);

        let customer = new Customer("1234", "John");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.Address = address;
        customer.activate();
        expect(customer.isActive()).toBe(true);
        const addressChanged = new Address("Street 2", 12, "23335-260", "São Paulo");
        customer.changeAddress(addressChanged);
    
        const customerAddrresChangedEvent = new CustomerAddrresChangedEvent(customer);

        eventDispatcher.notify(customerAddrresChangedEvent);
        expect(spyEventHandler).toHaveBeenCalledWith(customerAddrresChangedEvent);
        

    });


});