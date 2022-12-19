import Customer from './customer'
import Address from './address'

describe("Customer unit testes", () => {

    it("should throw error when id is empry", () => {
               expect(() => {
                let customer = new Customer("", "John");
               }).toThrowError("Id is required")

    });

    it("should throw error when name is empry", () => {
        expect(() => {
         let customer = new Customer("1234", "");
        }).toThrowError("Name is required")
    });

    it("should throw error when try active customer and the address field is empty", () => {
        expect(() => {
         let customer = new Customer("1234", "John");
         customer.activate();
        }).toThrowError(`Address is mandatory for activate a costumer`)
    });

    it("should change name", () => {
       const nameExpected = "Pedro";
       let customer = new Customer("1234", "John");
       customer.changeName(nameExpected);
       expect(customer.name).toBe(nameExpected);

    });

    it("should actived customer", () => {
        let customer = new Customer("1234", "John");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.Address = address;
        customer.activate();
        expect(customer.isActive()).toBe(true);
 
     });

     it("should deactived customer", () => {
        let customer = new Customer("1234", "John");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.Address = address;
        customer.activate();
        expect(customer.isActive()).toBe(true);
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
 
     });

    
});