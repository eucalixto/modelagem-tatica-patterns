import Product from '../entity/product';

export default class ProductService {

    static increasePrice(products : Product[], perentage : number) : void {
        products.forEach( (product) => {
            product.changePrice((product.price * perentage)/100 + product.price);
        });
    }
}