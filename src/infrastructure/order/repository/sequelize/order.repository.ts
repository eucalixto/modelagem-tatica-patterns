import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model"

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customerId: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item)=> ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,

      })),
    },
    {
      include: [{ model: OrderItemModel }],
    }
    );
  }

  async update(entity: Order): Promise<void> {

    try {
      await OrderModel.findOne(
          {
              where: {
                  id: entity.id
              },
              rejectOnEmpty: true
          }
      );
      } catch(error) {
        throw new Error(`Order not found`);
    }
   
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (transaction) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id : entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction });
      await OrderModel.update(
        { order_id: entity.id , customerId: entity.customerId, total: entity.total(), items },
        { where: { id: entity.id }, transaction }
      );
    });
  }
  async find(id: string): Promise<Order> {

    let orderModel;
    try { 
      orderModel = await OrderModel.findOne({ where: { id }, include: ["items"],  rejectOnEmpty: true });
    } catch (err) {
        throw new Error(`Order ${id} not found !`);
    }
    const items = orderModel.items.map(item => new OrderItem(
      item.id, 
      item.name, 
      item.price, 
      item.product_id, 
      item.quantity
      ));
    return new Order(orderModel.id, orderModel.customerId, items);
  }

  async findAll(): Promise<Order[]> {
    
    const orderModel = await OrderModel.findAll( { include: ["items"]});
    if(orderModel === null) return [];

    return orderModel.map(order => {
      const items = order.items.map(item => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      ));

      return new Order(order.id, order.customerId, items);
    })
  }
}