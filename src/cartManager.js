import fs from 'fs'
import ProductManager from './productManager.js';

const productManager = new ProductManager('./data/products.json')

export class CartManager {
    #path 

    constructor(path){
        this.#path = path;
        this.init();
    }

    async init() {
       if(!fs.existsSync(this.#path)){
         await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2));
        }
    }
    idGenerate(products) {
        return products.length === 0 ? 1 : products[products.length - 1].id + 1;
    }
    verifyFile() {
        !fs.existsSync(this.#path) && '[500] el archivo no existe ';
    }
    async createCart(){
        await this.verifyFile();
        let data = await fs.promises.readFile(this.#path, 'utf-8');
        let carts = JSON.parse(data);
        const cartToAdd = { id: this.idGenerate(carts), products: []};
        carts.push(cartToAdd);
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2))
        return  cartToAdd
    }

  async  getProductsFromCart(id){
    await this.verifyFile();
    let data = await fs.promises.readFile(this.#path, 'utf-8');
        let carts = JSON.parse(data);
        let cart = carts.find(item => item.id === id);
        if(!cart) return '[404] el carrito no existe'
    return cart
  }
async addProductToCart(cid, pid){
    await this.verifyFile();
    const result = await productManager.getProductById(pid);
    if ( typeof result == 'string') return `[404] El producto con id:${pid} no existe`;
    const cart = await this.getProductsFromCart(cid);
    if ( typeof cart == 'string') return `[404] El carrito con id:${cid} no existe`;
    const productIndex = cart.products.findIndex(item => item.product === pid);
    if ( productIndex > -1){
        cart.products[productIndex].quantity += 1
    }else{
        cart.products.push({product: pid, quantity: 1 })
    }
    let data = await fs.promises.readFile(this.#path, 'utf-8');
        let carts = JSON.parse(data);
        carts = carts.map(item =>{
            if(item.id === cid){
                return cart
            } else{
                return item
            }
        })
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2))
        return cart

}

}
export default CartManager