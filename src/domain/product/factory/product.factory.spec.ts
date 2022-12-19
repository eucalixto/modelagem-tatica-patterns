import ProductFactory from "./product.factory";

describe("Product factory unit test", ()=> {

    it("should create a product a", ()=> {
        const product = ProductFactory.create("a", "Product a", 1);
        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product a");
        expect(product.price).toBe(1);
        expect(product.constructor.name).toBe("Product")
    });

    it("should create a product b", ()=> {
        const product = ProductFactory.create("b", "Product b", 1);
        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product b");
        expect(product.price).toBe(2);
        expect(product.constructor.name).toBe("ProductB")
    });

    it("should throw an error when type is not supported", ()=> {

        expect(() => {
            ProductFactory.create("c", "Product b", 1);
        }).toThrowError(`Product type not supported`);   
    });

});