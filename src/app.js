import express from "express"
import handlebars from 'express-handlebars'
import { __dirname } from "./utils.js"
import ViewsRouter from './routes/view.routes.js'
import connectionMongo from './connection/mongo.js'
import ProductsRouter from './routes/product.route.js'
import CartRouter from './routes/cart.route.js'

const app = express()

connectionMongo()

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', ViewsRouter)

app.use('/api/product', ProductsRouter)
app.use('/api/carts', CartRouter)




app.listen(8080, () => {
    console.log (`Server en puerto 8080`)
})