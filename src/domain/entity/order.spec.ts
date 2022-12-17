import Order from './order'
import OrderItem from './order_item'


describe("Order unit testes", () => {

    it("should throw error when id is empty", () => {
               expect(() => {
                let order = new Order("", "123", []);
               }).toThrowError("Id is required")

    });

    it("should throw error when customer id is empty", () => {
        expect(() => {
         let order = new Order("123", "", []);
        }).toThrowError("Customer Id is required")

});

it("should throw error when items is empty", () => {
    expect(() => {
     let order = new Order("123", "235", []);
    }).toThrowError("Item is is required")

});

it("should calculate total", () => {
   const item = new OrderItem("i1", "Item 1", 100);
   const item2 = new OrderItem("i1", "Item 1", 200);
   const order = new Order("o1", "c1", [item, item2]);
   let total = order.total();
    expect(total).toBe(300);

});

   

    
});