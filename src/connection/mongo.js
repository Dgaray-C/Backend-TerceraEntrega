import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectionMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: 'Products'
        })
        console.log('BD esta conectada')
    } catch (error) {
        console.log (`Error al conectase a la BD:  ${error}`)
    }
}

export default connectionMongo