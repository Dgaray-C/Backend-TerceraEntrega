import { Router } from "express"
import { cartModel } from "../models/cart.model.js"
import { ProductModel } from '../models/products.model.js';

const route = Router()


route.get('/:cid', async (req, res) => {
    const response = await cartModel.find().populate('products.product')
    res.json({response})

})

route.post('/', async (req, res) => {
    const { monto, fecha, cantidad, estado } = req.body

    if (!monto || !fecha || !cantidad || !estado) {
        return res.status(400).json({status: 'error', message: 'Ingresar monto, fecha, cantidad y estado'})
    }


    const result = await cartModel.create({
        fecha,
        monto,
        cantidad,
        estado
    })
    res.json({result})
})

route.post('/add', async (req, res) => {
    const { productId, cantidad } = req.body;


    let cart = await cartModel.findOne({ estado: 'abierto' });

    if (!cart) {
        cart = await cartModel.create({
            fecha: new Date().toISOString().replace('T', ' ').slice(0, 19),
            monto: 0,
            estado: 'abierto',
            products: []
        });
    }

    const product = await ProductModel.findById(productId);


    cart.products.push({ product: productId, cantidad: cantidad })
    cart.monto += product.precio * cantidad

    const result = await cartModel.updateOne({ _id: cart._id }, cart);

    res.json({result})
})


route.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await cartModel.findById(cid).populate('products.product')

    const ProductoEliminar = cart.products.find(item => item.product._id.toString() === pid)

    const nuevoMonto = cart.monto - (ProductoEliminar.cantidad * ProductoEliminar.product.precio)
    
    const result = await cartModel.updateOne({ _id: cid },{ $pull: { products: { product: pid } }, monto: nuevoMonto > 0 ? nuevoMonto : 0 } )

    res.json({payload: result })
})

route.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const { products } = req.body
    const { product, cantidad } = products[0]

    let cart = await cartModel.findOne({ _id: cid })

    const product_m = await ProductModel.findById(product);

    const NuevoMonto = product_m.precio * cantidad;

    const existingProductIndex = cart.products.findIndex((item) => item.product.toString() === product_m._id.toString())

    if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].cantidad += cantidad
    } else {
        cart.products.push({ product: product_m._id, cantidad })
    }

    cart.monto += NuevoMonto;

    const result = await cartModel.updateOne({ _id: cid },{ products: cart.products, monto: cart.monto })

    res.json({ payload: result });
});




route.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { cantidad } = req.body

    const cart = await cartModel.findById(cid)

    const prod_cart_id = cart.products.findIndex(item => item.product.toString() === pid)

    console.log(prod_cart_id)

    cart.products[prod_cart_id].cantidad = cantidad

    let total = 0;
    for (const item of cart.products) {
        const itemProduct = await ProductModel.findById(item.product)
        total += item.cantidad * itemProduct.precio
    }

    const result = await cartModel.updateOne({ _id: cid },{ products: cart.products, monto: total })

    res.json({ payload: result })
})

route.delete('/:cid', async (req, res) => {

    const { cid } = req.params
    
    const result = await cartModel.updateOne({ _id: cid },{ products: [], monto: 0 } )

    res.json({ payload: result });
})


route.get('/:cid', async (req, res) => {
    const response = await cartModel.find().populate('products.product')
    res.json({response})

})

export default route