import { Router } from "express"
import { ProductModel } from "../models/products.model.js"
import { ProductManager } from "../class/productManager.js"
const model = new ProductManager(ProductModel)

const route = Router()

route.get('/', async (req, res) => {
    res.render('index', {})
})

route.get('/products/:pid', async (req, res) => {

    const { pid } = req.params;
    const product = await ProductModel.findById(pid);

    if (!product) {
        return res.status(404).render('item', {
            error: 'Producto no encontrado'
        });
    }

    res.render('item', {
        product: {
            _id: pid,
            titulo: product.titulo,
            description: product.description,
            imagen: product.imagen,
            precio: product.precio,
            descuento: product.descuento,
            precioDescuento: product.precioDescuento,
            stock: product.stock,
            categoria: product.categoria
        }
    });
})

export default route