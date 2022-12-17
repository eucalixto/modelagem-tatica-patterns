import { Sequelize } from "sequelize-typescript";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import Address from "../../domain/entity/address";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model"
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository"

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

   sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem ("1", product.name, product.price, product.id, 2); 
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({ 
      where : {id: order.id},
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id:"123",
      customerId: "123",
      total: order.total(), 
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price, 
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        }
      ]

    })
    
  });


  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem ("1", product.name, product.price, product.id, 2); 
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const product2 = new Product("124", "Product 1", 15);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem ("124",product2.name, product2.price, product2.id, 2);
    order.addItem(orderItem2); 
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({ 
      where : {id: order.id},
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id:order.id,
      customerId: order.customerId,
      total: order.total(), 
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price, 
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: product.id,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price, 
          quantity: orderItem2.quantity,
          order_id: "123",
          product_id: product2.id,
        }
      ],
   })
    
  });
  
  it("should throw error when try update an order that doesn't exist", async () => {

      const orderItem = new OrderItem ("1", "Product 1", 10, "123", 2); 
      const order = new Order("123", "123", [orderItem]);
      const orderRepository = new OrderRepository();

      expect(async () => {
        await orderRepository.update(order);
      }).rejects.toThrow("Order not found");
  });
  
  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem ("1", product.name, product.price, product.id, 2); 
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderDatabase = await orderRepository.find(order.id);

    expect(orderDatabase.id).toEqual(order.id);
    expect(orderDatabase.customerId).toEqual(order.customerId);
    expect(orderDatabase.items).toEqual(order.items);
    
  });

  it("should throw error when doesn't find an order", async () => {
   
    const orderRepository = new OrderRepository();
    const id = "nao_existe";

    expect(async () => {
      await orderRepository.find(id);
    }).rejects.toThrowError(`Order ${id} not found !`);
     
  });

  it("should find all orders", async () => {

    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem ("1", product.name, product.price, product.id, 2); 
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
   
    const orderItem2 = new OrderItem ("2", product.name, product.price, product.id, 2); 
    const order2 = new Order("124", "123", [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders.length).toBe(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(order2);
  });

  it("should emprty array when not found orders", async () => {
   
    const orderRepository = new OrderRepository();
    const result =   await orderRepository.findAll();
    expect(result.length).toBe(0);
     
  });

});

