import fs from 'fs'


class ProductManager {
    #path
    // contructor 
    constructor(path) {
        this.#path = path
        this.init()
    }
    async init() {
        if(!fs.existsSync(this.#path)){ 
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2))
        }
    }
    verifyFile() {
        !fs.existsSync(this.#path) && '[500] el archivo no existe '

    }

    // generar id 
    idGenerate(products) {
        return products.length === 0 ? 1 : products[products.length - 1].id + 1;
    }
    // añadir producto

    async addProduct(product) {
        if (!product.title || !product.description || !product.price  || !product.code || !product.stock) {
            return '[400] Todos los campos son obligatorios'
        }
        await this.verifyFile()
        let data = await fs.promises.readFile(this.#path, 'utf-8');
        const products = JSON.parse(data);
        const found = products.some(item => item.code === product.code);
        if (found) {
            return '[400] Ya existe un producto con ese code'
        } else {


            const productAdd = { id: this.idGenerate(products), status: true, thumbnails: [], ...product }
            //  pushear producto en el array products
            products.push(productAdd)
            await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
            return productAdd
        }
    }
    // traer todos los productos
    async getProducts() {
        await this.verifyFile()
        let data = await fs.promises.readFile(this.#path, 'utf-8');
        const items = JSON.parse(data)
        return items;
    }
    // traer producto por id
    async getProductById(id) {
        let data = await this.getProducts();
        const product = data.find(item => item.id === id);
        if (!product) {
            return '[404] el producto que buscas no existe '
        }
        return product


    }
    // actualizar producto por id
    async updateProduct(id, updatedProduct) {
        await this.verifyFile();
        let isFound = false;
        let products = await this.getProducts();
        const newProducts = products.map(item => {
            if (item.id === id) {
                isFound = true
                return {
                    ...item,
                    ...updatedProduct

                }
            } else {
                return item
            }
        })
        if (!isFound) return '[404] El producto no existe'
        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
        return newProducts.find(item => item.id === id)

    }
    // borrar un producto por id
    async deleteProduct(id) {
        await this.verifyFile();
        let isFound = false
        let products = await this.getProducts();
        const newProducts = products.filter(item => item.id != id)
        if (products.length !== newProducts.length) isFound = true
        if (!isFound) return '[404] el producto no existe'
        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
        return newProducts
    }

}
export default ProductManager;