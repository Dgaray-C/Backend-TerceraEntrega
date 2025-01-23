import { Schema, model } from "mongoose"

const cartCollection = 'cart';

const cartSchema = new Schema({
    fecha: String,
    monto: Number,
    estado: String,
    products:{
        type:[{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            cantidad: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        default: []
    }
})

export const cartModel = model(cartCollection, cartSchema)