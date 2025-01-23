export class ProductManager {
    constructor(model){
        this.model = model
    }

    async add(product){
        try {
            const result = await this.model.create(product)
            return result
        } catch (error) {
            return error
        }
    }

    async edit(product, id){
        try {
            const result = await this.model.findByIdAndUpdate(id, product, {new: true})
            return result
        } catch (error) {
            return error
        }
    }

    async editByQuery(product, query){
        try {
            const result = await this.model.findAndUpdate(query, product, {new: true})
            return result
        } catch (error) {
            return error
        }
    }

    async findById(id){
        try {
            const result = await this.model.findOne(id)
            return result
        } catch (error) {
            return error
        }
    }

    async find(){
        try {
            const result = await this.model.find()
            return result
        } catch (error) {
            return error
        }
    }

    async findByQuery(query = {}){
        try {
            const result = await this.model.find(query)
            return result
        } catch (error) {
            console.log('Error en findByQuery:', error);
            return error
        }
    }



    async deleteById(id){
        try {
            const result = await this.model.deleteOne({ _id: id })
            return result
        } catch (error) {
            return error
        }
    }

    async deleteByquery(query){
        try {
            const result = await this.model.delete(query)
            return result
        } catch (error) {
            return error
        }
    }

    async paginate(filter, options) {
        try {
            const result = await this.model.paginate(filter, options)
            return result
        } catch (error) {
            return error
        }
    }

}