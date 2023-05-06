import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

mongoose.set('strictQuery', false);

const database: string = process.env.MONGODB_URI.replace('<USER:PASSWORD>', `${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}`)

mongoose
    .connect(database)
    .then(() => {
        console.log('Connexion à la base de donnée réussie !')
    })
    .catch(err => {
        console.log('Impossible de se connecter à la base de donnée : ', err)
    })