import { Router } from "express"
import { ProductModel } from "../models/products.model.js"
import { ProductManager } from "../class/productManager.js"
import { uploader } from "../utils.js"

const route = Router()
const model = new ProductManager(ProductModel)

route.get('/', async (req, res) => {

    const query = req.query

    const filter = {}
    if(query.titulo){filter.titulo = query.titulo}
    if(query.categoria){filter.categoria = query.categoria}

    const sorted = {
        'asc':1,
        'desc':-1,
        default: 0
    }

    const opcion = {
        limit: query.limit || 10,
        page: query.page || 1,
        ...(query.sort ? { sort: { precio: sorted[query.sort] } } : {})
    }

    const result = await model.paginate(filter, opcion)
    console.log(result)

    const response = {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: `?page${result.prevPage}&limit=${query.limit}`,
        nextLink: `?page${result.nextPage}&limit=${query.limit}`
    }

    res.json({response})
})


route.get('/:id', async (req, res) => {
    const { id } = req.params

    const product = await model.findById({ _id: id })

    if(!product) return res.json({ mensaje: 'Error', payload: result })

    res.json({ payload: product })
})



route.post('/', uploader.single('file') , async (req, res) => {

    try {
        const file = req.file
        const body = req.body
    
        const newProducts =  {
            ...body,
            imagen: file ? file.path.split('public')[1] : body.imagen
        }
    
        console.log({file})
        console.log({body})
    
        const result = await model.add(newProducts)
    
        res.json({payload: result})
    } catch (error) {
        console.log('error al agregar el producto:' + error)
    }

})


route.delete('/:pid', async (req, res) => {
    const { pid } = req.params

    const product = await model.findByQuery({ _id: pid })

    const result = await model.deleteById(pid);

    console.log(result)

    res.json({ payload: result })
})




export default route