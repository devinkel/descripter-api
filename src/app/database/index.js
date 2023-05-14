import mongoose from "mongoose";

export const connect = async () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Conexão com o MongoDB estabelecida com sucesso!')
    }).catch((error) => {
        console.error('Erro ao estabelecer conexão com o MongoDB:', error)
    })
}

export const close = () => mongoose.connection.close()