import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema } = mongoose;

const productCollection = 'products';

const productSchema = new Schema({
    titulo: String,
    description: String,
    imagen: String,
    precio: Number,
    categoria: String,
    descuento: Boolean,
    precioDescuento: Number,
    stock: Number
})

productSchema.plugin(mongoosePaginate)

export const ProductModel = mongoose.model(productCollection, productSchema)